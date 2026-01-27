import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { verifyPassword, generateToken } from '@/lib/auth/jwt';
import { User } from '@/types';
import { validateOrigin, isValidEmail, getAuthCookieOptions } from '@/lib/api/security';

export async function POST(request: NextRequest) {
  try {
    // Validate origin (CSRF protection - skipped in dev)
    const originCheck = validateOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ error: originCheck.error }, { status: 403 });
    }

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Create response with token
    const response = NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted || false,
        cgmProvider: user.cgmProvider,
      },
    });

    // Set token as HTTP-only cookie with SameSite=Strict in production
    const cookieOptions = getAuthCookieOptions();
    response.cookies.set('token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
