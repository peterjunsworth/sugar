import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.age || !data.weight || !data.diabetesType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection(COLLECTIONS.USERS);

    // Update user with onboarding data
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userPayload.userId) },
      {
        $set: {
          onboardingCompleted: true,
          profile: {
            age: parseInt(data.age),
            weight: parseFloat(data.weight),
            diabetesType: data.diabetesType,
            glucoseTargets: {
              min: parseFloat(data.glucoseMin || 70),
              max: parseFloat(data.glucoseMax || 180),
            },
            device: data.device || 'manual',
          },
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Setup completed successfully',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
