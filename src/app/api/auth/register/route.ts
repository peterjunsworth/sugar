import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { hashPassword, generateToken } from '@/lib/auth/jwt';
import { User } from '@/types';
import { validateOrigin, isValidEmail, getAuthCookieOptions } from '@/lib/api/security';

export async function POST(request: NextRequest) {
  try {
    // Validate origin (CSRF protection - skipped in dev)
    const originCheck = validateOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ error: originCheck.error }, { status: 403 });
    }

    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser: Partial<User> = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser as User);

    // Generate JWT token
    const token = generateToken(result.insertedId.toString(), email);

    // Create response with token
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        userId: result.insertedId.toString(),
        token,
      },
      { status: 201 }
    );

    // Set token as HTTP-only cookie with SameSite=Strict in production
    const cookieOptions = getAuthCookieOptions();
    response.cookies.set('token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
