import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { LibreClient } from '@/lib/cgm/libre';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { User } from '@/types';

// Authenticate with LibreView (uses email/password, not OAuth)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'LibreView email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with LibreView
    const libreClient = await LibreClient.authenticate(email, password);
    const connections = await libreClient.getConnections();

    if (connections.length === 0) {
      return NextResponse.json(
        { error: 'No LibreView connections found' },
        { status: 404 }
      );
    }

    // Use the first connection (usually the user's own data)
    const patientId = connections[0];
    libreClient.setPatientId(patientId);

    // Save auth token to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    await usersCollection.updateOne(
      { _id: new ObjectId(userPayload.userId) },
      {
        $set: {
          cgmProvider: 'libre',
          cgmAccessToken: libreClient.getAuthToken(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: 'LibreView connected successfully',
      provider: 'libre',
      connections,
    });
  } catch (error) {
    console.error('LibreView auth error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to authenticate with LibreView',
      },
      { status: 500 }
    );
  }
}
