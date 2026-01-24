import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/types';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateToken(userId: string, email: string): string {
  return sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Edge Runtime compatible token verification using jose
export async function verifyTokenEdge(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    console.log('[JWT Edge] Verifying token...');
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    console.log('[JWT Edge] Token verified successfully for user:', payload.email);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    console.error('[JWT Edge] Token verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

// Node.js Runtime token verification (for API routes)
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    console.log('[JWT] Verifying token with secret:', JWT_SECRET.substring(0, 10) + '...');
    const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
    console.log('[JWT] Token verified successfully for user:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

export function extractUserFromRequest(authHeader: string | null): { userId: string; email: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}
