import { NextRequest, NextResponse } from 'next/server';
import { extractUserFromRequest } from '@/lib/auth/jwt';
import { DexcomClient } from '@/lib/cgm/dexcom';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { User, CGMConfig } from '@/types';

// Initiate Dexcom OAuth flow
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

    const authUrl = DexcomClient.getAuthorizationUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Dexcom auth init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Dexcom authentication' },
      { status: 500 }
    );
  }
}

// Dexcom OAuth callback
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
    const tokens = await DexcomClient.exchangeCodeForTokens(code);

    // Save tokens to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    const cgmConfigsCollection = db.collection<CGMConfig>(COLLECTIONS.CGM_CONFIGS);

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          cgmProvider: 'dexcom',
          cgmAccessToken: tokens.access_token,
          cgmRefreshToken: tokens.refresh_token,
          updatedAt: new Date(),
        },
      }
    );

    const cgmConfig: Partial<CGMConfig> = {
      provider: 'dexcom',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      lastSync: new Date(),
    };

    await cgmConfigsCollection.updateOne(
      { provider: 'dexcom' },
      { $set: cgmConfig },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Dexcom connected successfully',
      provider: 'dexcom',
    });
  } catch (error) {
    console.error('Dexcom callback error:', error);
    return NextResponse.json(
      { error: 'Failed to complete Dexcom authentication' },
      { status: 500 }
    );
  }
}
