import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * API Security Utilities
 *
 * This module provides security helpers for API routes:
 * - Origin validation (CSRF protection)
 * - Authentication verification
 * - Input validation helpers
 */

const isDev = process.env.NODE_ENV === 'development';

// Allowed origins for production
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://sugar-app.vercel.app', // Update with actual production domain
].filter(Boolean);

/**
 * Validates request origin for CSRF protection.
 * Skipped in development mode for easier testing.
 */
export function validateOrigin(request: NextRequest): { valid: boolean; error?: string } {
  // Skip origin validation in development
  if (isDev) {
    return { valid: true };
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // For same-origin requests (no Origin header), check Referer
  if (!origin) {
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (ALLOWED_ORIGINS.includes(refererUrl.origin)) {
          return { valid: true };
        }
      } catch {
        // Invalid referer URL
      }
    }
    // Allow requests without Origin/Referer (same-origin browser requests)
    // This is safe because browsers always send Origin for cross-origin requests
    return { valid: true };
  }

  // Validate Origin header
  if (ALLOWED_ORIGINS.includes(origin)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Cross-origin request blocked'
  };
}

/**
 * Extracts and verifies authentication from request.
 * Checks both cookie and Authorization header.
 */
export function verifyAuth(request: NextRequest): {
  authenticated: boolean;
  user?: { userId: string; email: string };
  error?: string;
} {
  // Check cookie first (preferred for browser requests)
  const tokenFromCookie = request.cookies.get('token')?.value;

  // Check Authorization header (for API clients)
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return { authenticated: false, error: 'Authentication required' };
  }

  const user = verifyToken(token);
  if (!user) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }

  return { authenticated: true, user };
}

/**
 * Middleware wrapper that applies security checks to API handlers.
 *
 * Usage:
 * ```ts
 * export const GET = withApiSecurity(async (request, { user }) => {
 *   // Your handler code here
 *   return NextResponse.json({ data: 'protected' });
 * }, { requireAuth: true });
 * ```
 */
export function withApiSecurity(
  handler: (
    request: NextRequest,
    context: { user?: { userId: string; email: string } }
  ) => Promise<NextResponse>,
  options: { requireAuth?: boolean } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Validate origin (CSRF protection)
    const originCheck = validateOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { error: originCheck.error },
        { status: 403 }
      );
    }

    // Check authentication if required
    let user: { userId: string; email: string } | undefined;
    if (options.requireAuth) {
      const authCheck = verifyAuth(request);
      if (!authCheck.authenticated) {
        return NextResponse.json(
          { error: authCheck.error },
          { status: 401 }
        );
      }
      user = authCheck.user;
    }

    // Call the actual handler
    return handler(request, { user });
  };
}

/**
 * Email validation using stricter regex (RFC 5322 simplified).
 */
export function isValidEmail(email: string): boolean {
  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates pagination parameters with bounds.
 */
export function validatePagination(
  limitParam: string | null,
  offsetParam: string | null,
  maxLimit: number = 100
): { limit: number; offset: number } {
  let limit = parseInt(limitParam || '50', 10);
  let offset = parseInt(offsetParam || '0', 10);

  // Enforce bounds
  if (isNaN(limit) || limit < 1) limit = 50;
  if (limit > maxLimit) limit = maxLimit;
  if (isNaN(offset) || offset < 0) offset = 0;

  return { limit, offset };
}

/**
 * Cookie configuration for auth tokens.
 * Uses SameSite=Strict in production for CSRF protection.
 */
export function getAuthCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
} {
  return {
    httpOnly: true,
    secure: !isDev, // Secure in production
    sameSite: isDev ? 'lax' : 'strict', // Strict in production for CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

// TODO: Implement CSRF token middleware
// For full CSRF protection, implement:
// 1. Generate CSRF token on session creation
// 2. Store in httpOnly cookie + return to client
// 3. Client sends token in X-CSRF-Token header
// 4. Server validates token matches cookie
//
// Example implementation:
// export function generateCsrfToken(): string {
//   return crypto.randomUUID();
// }
//
// export function validateCsrfToken(request: NextRequest): boolean {
//   const cookieToken = request.cookies.get('csrf-token')?.value;
//   const headerToken = request.headers.get('x-csrf-token');
//   return cookieToken && headerToken && cookieToken === headerToken;
// }
