import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { DexcomClient } from '@/lib/cgm/dexcom';
import { LibreClient } from '@/lib/cgm/libre';
import { EversenseClient } from '@/lib/cgm/eversense';
import { User, BloodGlucoseReading } from '@/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    const glucoseCollection = db.collection<BloodGlucoseReading>(
      COLLECTIONS.GLUCOSE_READINGS
    );

    // Get user's CGM configuration
    const user = await usersCollection.findOne({
      _id: new ObjectId(userPayload.userId),
    });

    if (!user || !user.cgmProvider || !user.cgmAccessToken) {
      return NextResponse.json(
        { error: 'No CGM connected. Please connect a CGM device first.' },
        { status: 400 }
      );
    }

    // Get time range for sync (last 7 days by default)
    const { daysBack = 7 } = await request.json().catch(() => ({}));
    const endDate = new Date();
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    let readings: BloodGlucoseReading[] = [];

    // Fetch data based on provider
    switch (user.cgmProvider) {
      case 'dexcom':
        if (!user.cgmRefreshToken) {
          return NextResponse.json(
            { error: 'Dexcom refresh token not found' },
            { status: 400 }
          );
        }
        const dexcomClient = new DexcomClient(
          user.cgmAccessToken,
          user.cgmRefreshToken
        );
        readings = await dexcomClient.getGlucoseReadings(startDate, endDate);

        // Update tokens if they were refreshed
        const dexcomTokens = dexcomClient.getTokens();
        await usersCollection.updateOne(
          { _id: new ObjectId(userPayload.userId) },
          {
            $set: {
              cgmAccessToken: dexcomTokens.accessToken,
              cgmRefreshToken: dexcomTokens.refreshToken,
              updatedAt: new Date(),
            },
          }
        );
        break;

      case 'libre':
        const libreClient = new LibreClient(user.cgmAccessToken);
        const connections = await libreClient.getConnections();
        if (connections.length > 0) {
          readings = await libreClient.getGlucoseReadings(connections[0]);
        }
        break;

      case 'eversense':
        if (!user.cgmRefreshToken) {
          return NextResponse.json(
            { error: 'Eversense refresh token not found' },
            { status: 400 }
          );
        }
        const eversenseClient = new EversenseClient(
          user.cgmAccessToken,
          user.cgmRefreshToken
        );
        readings = await eversenseClient.getGlucoseReadings(startDate, endDate);

        // Update tokens if they were refreshed
        const eversenseTokens = eversenseClient.getTokens();
        await usersCollection.updateOne(
          { _id: new ObjectId(userPayload.userId) },
          {
            $set: {
              cgmAccessToken: eversenseTokens.accessToken,
              cgmRefreshToken: eversenseTokens.refreshToken,
              updatedAt: new Date(),
            },
          }
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported CGM provider' },
          { status: 400 }
        );
    }

    // Save readings to database (avoiding duplicates)
    if (readings.length > 0) {
      const bulkOps = readings.map((reading) => ({
        updateOne: {
          filter: {
            userId: userPayload.userId,
            timestamp: reading.timestamp,
            source: reading.source,
          },
          update: {
            $set: {
              ...reading,
              userId: userPayload.userId,
            },
          },
          upsert: true,
        },
      }));

      await glucoseCollection.bulkWrite(bulkOps);
    }

    return NextResponse.json({
      message: 'Glucose data synced successfully',
      provider: user.cgmProvider,
      readingsCount: readings.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error('CGM sync error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to sync CGM data',
      },
      { status: 500 }
    );
  }
}

// Get sync status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userPayload = extractUserFromRequest(authHeader);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    const glucoseCollection = db.collection<BloodGlucoseReading>(
      COLLECTIONS.GLUCOSE_READINGS
    );

    const user = await usersCollection.findOne({
      _id: new ObjectId(userPayload.userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get latest reading
    const latestReading = await glucoseCollection
      .find({ userId: userPayload.userId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // Get total readings count
    const totalReadings = await glucoseCollection.countDocuments({
      userId: userPayload.userId,
    });

    return NextResponse.json({
      cgmProvider: user.cgmProvider || null,
      isConnected: !!(user.cgmProvider && user.cgmAccessToken),
      totalReadings,
      latestReading: latestReading[0] || null,
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
