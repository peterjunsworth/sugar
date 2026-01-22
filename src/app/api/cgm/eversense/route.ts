import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { EversenseClient } from '@/lib/cgm/eversense';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { User, CGMConfig } from '@/types';

// Initiate Eversense OAuth flow
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate state parameter with user ID for verification
    const state = Buffer.from(
      JSON.stringify({ userId: userPayload.userId, timestamp: Date.now() })
    ).toString('base64');

    const authUrl = EversenseClient.getAuthorizationUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Eversense auth init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Eversense authentication' },
      { status: 500 }
    );
  }
}

// Eversense OAuth callback
export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      );
    }

    // Decode and verify state parameter
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { userId } = stateData;

    // Exchange code for tokens
    const tokens = await EversenseClient.exchangeCodeForTokens(code);

    // Save tokens to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    const cgmConfigsCollection = db.collection<CGMConfig>(COLLECTIONS.CGM_CONFIGS);

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          cgmProvider: 'eversense',
          cgmAccessToken: tokens.access_token,
          cgmRefreshToken: tokens.refresh_token,
          updatedAt: new Date(),
        },
      }
    );

    const cgmConfig: Partial<CGMConfig> = {
      provider: 'eversense',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      lastSync: new Date(),
    };

    await cgmConfigsCollection.updateOne(
      { provider: 'eversense' },
      { $set: cgmConfig },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Eversense connected successfully',
      provider: 'eversense',
    });
  } catch (error) {
    console.error('Eversense callback error:', error);
    return NextResponse.json(
      { error: 'Failed to complete Eversense authentication' },
      { status: 500 }
    );
  }
}
