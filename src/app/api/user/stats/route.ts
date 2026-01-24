import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { User } from '@/types';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(userPayload.userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate days active (days since user creation)
    const createdAt = user.createdAt || new Date();
    const now = new Date();
    const daysActive = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Mock stats data - in production, calculate from actual glucose readings
    const stats = {
      daysActive: daysActive > 0 ? daysActive : 28,
      inRange: Math.floor(Math.random() * 15) + 70, // 70-85%
      timeInRange: Math.floor(Math.random() * 15) + 70, // 70-85%
      averageGlucose: Math.floor(Math.random() * 40) + 110, // 110-150 mg/dL
      totalEntries: Math.floor(Math.random() * 200) + 100, // 100-300
      glucoseReadings: Math.floor(Math.random() * 150) + 50, // 50-200
      meals: Math.floor(Math.random() * 50) + 20, // 20-70
      insulinDoses: Math.floor(Math.random() * 30) + 10, // 10-40
      exercises: Math.floor(Math.random() * 20) + 5, // 5-25
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
