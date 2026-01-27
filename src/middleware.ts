import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth/jwt';

// Define public and protected routes
const publicRoutes = ['/landing', '/login', '/signup'];
const protectedRoutes = ['/welcome', '/setup', '/dashboard', '/history', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[Middleware] Processing request:', pathname);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  console.log('[Middleware] Route type:', { isProtectedRoute, isPublicRoute });

  // Get token from cookies or Authorization header
  const tokenFromCookie = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = tokenFromCookie || tokenFromHeader;

  console.log('[Middleware] Token present:', !!token, 'Source:', tokenFromCookie ? 'cookie' : tokenFromHeader ? 'header' : 'none');
  if (token) {
    console.log('[Middleware] Token preview:', token.substring(0, 20) + '...');
  }

  // Verify token
  let user = null;
  if (token) {
    user = await verifyTokenEdge(token);
    console.log('[Middleware] User verified:', !!user);
  }

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Unauthenticated user trying to access protected route -> redirect to login
    console.log('[Middleware] Redirecting to login - protected route without auth');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && user) {
    // Authenticated user trying to access public auth pages -> redirect to dashboard
    console.log('[Middleware] Redirecting to dashboard - auth user on public route');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('[Middleware] Allowing request to proceed');
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
