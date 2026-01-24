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

    // Get user profile
    const user = await usersCollection.findOne({ _id: new ObjectId(userPayload.userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return profile data with mock values for missing fields
    const profile = {
      name: user.name || 'John Doe',
      email: user.email,
      age: (user as any).age || 35,
      weight: (user as any).weight || 75,
      weightUnit: (user as any).weightUnit || 'kg',
      diabetesType: (user as any).diabetesType || 'Type 2',
      glucoseTargets: (user as any).glucoseTargets || {
        low: 70,
        high: 180,
        unit: 'mg/dL',
      },
      device: user.cgmProvider || 'Dexcom G6',
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    // Get update data
    const body = await req.json();
    const { age, weight, weightUnit, name, email, diabetesType, glucoseTargets, device } = body;

    // Build update object
    const updateFields: any = { updatedAt: new Date() };
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (age) updateFields.age = age;
    if (weight) updateFields.weight = weight;
    if (weightUnit) updateFields.weightUnit = weightUnit;
    if (diabetesType) updateFields.diabetesType = diabetesType;
    if (glucoseTargets) updateFields.glucoseTargets = glucoseTargets;
    if (device) updateFields.cgmProvider = device;

    // Update user profile
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userPayload.userId) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = result;
    const profile = {
      name: updatedUser.name || 'John Doe',
      email: updatedUser.email,
      age: (updatedUser as any).age || 35,
      weight: (updatedUser as any).weight || 75,
      weightUnit: (updatedUser as any).weightUnit || 'kg',
      diabetesType: (updatedUser as any).diabetesType || 'Type 2',
      glucoseTargets: (updatedUser as any).glucoseTargets || {
        low: 70,
        high: 180,
        unit: 'mg/dL',
      },
      device: updatedUser.cgmProvider || 'Dexcom G6',
    };

    return NextResponse.json({ success: true, user: profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
