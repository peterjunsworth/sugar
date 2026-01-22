import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { sendChatMessage } from '@/lib/utils/n8n-client';
import {
  ChatSession,
  ChatMessage,
  BloodGlucoseReading,
  Meal,
  InsulinDose,
} from '@/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const chatSessionsCollection = db.collection<ChatSession>(
      COLLECTIONS.CHAT_SESSIONS
    );
    const glucoseCollection = db.collection<BloodGlucoseReading>(
      COLLECTIONS.GLUCOSE_READINGS
    );
    const mealsCollection = db.collection<Meal>(COLLECTIONS.MEALS);
    const insulinCollection = db.collection<InsulinDose>(
      COLLECTIONS.INSULIN_DOSES
    );

    // Get recent context for better AI responses
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentGlucose, recentMeals, recentInsulin] = await Promise.all([
      glucoseCollection
        .find({
          userId: userPayload.userId,
          timestamp: { $gte: twentyFourHoursAgo },
        })
        .sort({ timestamp: -1 })
        .limit(20)
        .toArray(),
      mealsCollection
        .find({
          userId: userPayload.userId,
          timestamp: { $gte: twentyFourHoursAgo },
        })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray(),
      insulinCollection
        .find({
          userId: userPayload.userId,
          timestamp: { $gte: twentyFourHoursAgo },
        })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray(),
    ]);

    // Send message to n8n with context
    const n8nResponse = await sendChatMessage(
      userPayload.userId,
      message,
      sessionId,
      {
        recentGlucose,
        recentMeals,
        recentInsulin,
      }
    );

    // Create or update chat session
    const userMessage: ChatMessage = {
      id: new ObjectId().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: new ObjectId().toString(),
      role: 'assistant',
      content: n8nResponse.response,
      timestamp: new Date(),
      metadata: n8nResponse.extractedData
        ? { extractedData: n8nResponse.extractedData as any }
        : undefined,
    };

    let currentSessionId = sessionId;

    if (sessionId) {
      // Update existing session
      await chatSessionsCollection.updateOne(
        { _id: new ObjectId(sessionId) },
        {
          $push: {
            messages: { $each: [userMessage, assistantMessage] },
          },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      // Create new session
      const newSession: Partial<ChatSession> = {
        userId: userPayload.userId,
        messages: [userMessage, assistantMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await chatSessionsCollection.insertOne(
        newSession as ChatSession
      );
      currentSessionId = result.insertedId.toString();
    }

    // If n8n extracted structured data, save it to appropriate collections
    if (n8nResponse.extractedData) {
      const { type, data } = n8nResponse.extractedData;

      switch (type) {
        case 'glucose':
          await glucoseCollection.insertOne({
            ...data,
            userId: userPayload.userId,
          });
          break;
        case 'meal':
          await mealsCollection.insertOne({
            ...data,
            userId: userPayload.userId,
          });
          break;
        case 'insulin':
          await insulinCollection.insertOne({
            ...data,
            userId: userPayload.userId,
          });
          break;
        // Add other cases as needed
      }
    }

    return NextResponse.json({
      sessionId: currentSessionId,
      message: assistantMessage,
      suggestions: n8nResponse.suggestions,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = await getDatabase();
    const chatSessionsCollection = db.collection<ChatSession>(
      COLLECTIONS.CHAT_SESSIONS
    );

    if (sessionId) {
      // Get specific session
      const session = await chatSessionsCollection.findOne({
        _id: new ObjectId(sessionId),
        userId: userPayload.userId,
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ session });
    } else {
      // Get recent sessions
      const sessions = await chatSessionsCollection
        .find({ userId: userPayload.userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();

      return NextResponse.json({ sessions });
    }
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
