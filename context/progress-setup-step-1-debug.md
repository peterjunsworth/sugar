# Setup Step 1 - Authentication Debugging Session

## Date
2026-01-23

## Problem Statement
Users were being redirected away from /setup/step-1 after successful signup. The middleware was incorrectly verifying tokens causing authentication to fail even though the cookie was set correctly.

## Investigation Process

### 1. Initial Analysis
Reviewed the authentication flow components:
- `/home/jake/ws/sugar/src/lib/auth/jwt.ts` - JWT token generation and verification
- `/home/jake/ws/sugar/src/middleware.ts` - Route protection middleware
- `/home/jake/ws/sugar/src/components/auth/SignupForm.tsx` - Signup form component
- `/home/jake/ws/sugar/src/app/api/auth/register/route.ts` - Registration API endpoint

### 2. Added Diagnostic Logging
Added comprehensive console.log statements to trace the authentication flow:

**JWT Library** (`/home/jake/ws/sugar/src/lib/auth/jwt.ts`):
- Added logging for token verification attempts
- Added error logging to see why verification fails

**Middleware** (`/home/jake/ws/sugar/src/middleware.ts`):
- Added request path logging
- Added route type detection logging
- Added token presence and source logging
- Added user verification result logging
- Added redirect decision logging

**SignupForm** (`/home/jake/ws/sugar/src/components/auth/SignupForm.tsx`):
- Added registration response logging
- Added token storage confirmation logging
- Added redirect intention logging

### 3. Created Diagnostic Test
Created `/home/jake/ws/sugar/tests/setup-step-1-debug.spec.ts` with comprehensive diagnostics:
- Captures browser console logs
- Tracks network responses
- Monitors cookies before and after signup
- Checks localStorage
- Takes screenshots for debugging
- Provides detailed step-by-step output

### 4. Ran Initial Diagnostic Test
**Command:**
```bash
npx playwright test tests/setup-step-1-debug.spec.ts --headed --timeout=60000 --workers=1 --project=chromium
```

**Result:** FAILED - Redirected to login

**Critical Error Found:**
```
[JWT] Token verification failed: The edge runtime does not support Node.js 'crypto' module.
```

## Root Cause Identified

**THE PROBLEM:** Next.js middleware runs in the Edge Runtime, which doesn't support Node.js's `crypto` module. The `jsonwebtoken` library uses the `crypto` module, so `verifyToken()` was failing silently in the middleware, causing all authentication checks to fail.

**The Flow:**
1. User signs up → API creates token using `jsonwebtoken` ✅
2. API sets HTTP-only cookie with token ✅
3. Browser redirects to /setup/step-1 ✅
4. Middleware intercepts request ✅
5. Middleware reads cookie token ✅
6. Middleware tries to verify token with `jsonwebtoken` ❌ **FAILS - crypto module not available**
7. Middleware sees user as unauthenticated ❌
8. Middleware redirects to /login ❌

## Solution Applied

### 1. Installed jose Library
The `jose` library is designed to work in Edge Runtime environments without Node.js dependencies.

```bash
npm install jose
```

### 2. Updated JWT Library
**File:** `/home/jake/ws/sugar/src/lib/auth/jwt.ts`

Added Edge Runtime compatible token verification:
```typescript
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

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
```

Kept the original `verifyToken()` for API routes that run in Node.js runtime.

### 3. Updated Middleware
**File:** `/home/jake/ws/sugar/src/middleware.ts`

Changed from synchronous `verifyToken()` to asynchronous `verifyTokenEdge()`:
```typescript
import { verifyTokenEdge } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  // ... existing code ...

  let user = null;
  if (token) {
    user = await verifyTokenEdge(token);  // Changed to async Edge-compatible version
    console.log('[Middleware] User verified:', !!user);
  }

  // ... rest of middleware logic ...
}
```

### 4. Added slowMo to Playwright Config
**File:** `/home/jake/ws/sugar/playwright.config.ts`

Added slowMo for better visual debugging:
```typescript
use: {
  launchOptions: {
    slowMo: 500,
  },
}
```

## Verification

### Diagnostic Test - PASSED ✅
```bash
npx playwright test tests/setup-step-1-debug.spec.ts --headed --timeout=60000 --workers=1 --project=chromium
```

**Output:**
```
=== STEP 7: Verify final destination ===
✅ SUCCESS: Reached setup page
✓ Screenshot saved to tests/screenshots/setup-step-1-success.png
✓ 1 [chromium] › tests/setup-step-1-debug.spec.ts:4:7 › Setup Step 1 - Diagnostics › should complete signup flow and reach setup page (7.0s)

1 passed (9.8s)
```

**Key Success Indicators:**
- Cookie set correctly ✅
- Token present in localStorage ✅
- Token verified by middleware ✅
- User redirected to /setup/step-1 ✅
- User NOT redirected to /login ✅

### Setup Step 1 Tests - 8/15 PASSED ✅

Fixed the test setup to use the natural authentication flow:
```bash
npx playwright test tests/setup-step-1.spec.ts --project=chromium --workers=2
```

**Results:**
- 8 tests passing ✅
- 7 tests failing (due to UI selector issues, NOT authentication) ⚠️

**Passing Tests:**
1. should render all form sections
2. should show progress indicator
3. should toggle weight unit
4. should select diabetes type
5. should toggle glucose unit
6. should have default glucose targets
7. should be responsive on mobile
8. should work in dark mode

**Failing Tests (NOT auth-related):**
1. should validate age input - Next button selector ambiguous
2. should validate weight input - Next button selector ambiguous
3. should require diabetes type selection - Next button selector ambiguous
4. should validate glucose targets - Next button selector ambiguous
5. should validate low < high glucose targets - Next button selector ambiguous
6. should proceed to step 2 with valid data - Next button selector ambiguous
7. should have back button - Back button not found in component

These failures are component/UI issues, not authentication issues. The fact that all tests successfully reach the /setup/step-1 page proves authentication is working.

## Files Changed

### Modified Files
1. `/home/jake/ws/sugar/src/lib/auth/jwt.ts`
   - Added `jose` library imports
   - Added `verifyTokenEdge()` function for Edge Runtime
   - Added diagnostic logging to both verification functions

2. `/home/jake/ws/sugar/src/middleware.ts`
   - Changed to async function
   - Switched to `verifyTokenEdge()` for token verification
   - Added comprehensive diagnostic logging

3. `/home/jake/ws/sugar/src/components/auth/SignupForm.tsx`
   - Added diagnostic logging for registration flow

4. `/home/jake/ws/sugar/tests/setup-step-1.spec.ts`
   - Simplified `beforeEach` to use natural auth flow
   - Removed manual cookie manipulation
   - Uses automatic redirect to /setup/step-1

5. `/home/jake/ws/sugar/playwright.config.ts`
   - Added slowMo: 500 for visual debugging

### New Files Created
1. `/home/jake/ws/sugar/tests/setup-step-1-debug.spec.ts`
   - Comprehensive diagnostic test
   - Detailed logging and debugging
   - Screenshot capture

2. `/home/jake/ws/sugar/tests/screenshots/` (directory)
   - Contains test screenshots

### Dependencies Added
1. `jose` (v5.9.6) - Edge Runtime compatible JWT library

## Technical Details

### Why Edge Runtime?
Next.js middleware runs in the Edge Runtime by default for better performance and global distribution. The Edge Runtime is a lightweight JavaScript runtime that doesn't include all Node.js APIs.

### Why jsonwebtoken Doesn't Work in Edge Runtime
The `jsonwebtoken` library depends on Node.js's `crypto` module for cryptographic operations. This module is not available in the Edge Runtime.

### Why jose Works
The `jose` library is designed specifically for Edge Runtime and uses Web Crypto API instead of Node.js crypto module. It provides the same JWT functionality but with broader runtime compatibility.

### Token Generation vs Verification
- **Token Generation** (signup API): Uses `jsonwebtoken` in Node.js runtime ✅
- **Token Verification** (middleware): Uses `jose` in Edge Runtime ✅
- **Token Verification** (API routes): Uses `jsonwebtoken` in Node.js runtime ✅

This hybrid approach works because:
1. Tokens are JWT standard format
2. Both libraries use the same secret
3. Both libraries follow the same JWT specification
4. The token format is interoperable

## Success Criteria - Status

- ✅ Identified root cause of redirect issue
- ✅ Fixed the authentication flow
- ✅ Diagnostic test passes
- ✅ User can signup and reach /setup/step-1 successfully
- ✅ Ran test in headed Chrome mode (visible, slow)
- ✅ Documented findings and fixes

## Next Steps

### Optional Improvements
1. **Remove Diagnostic Logging** (optional)
   - The console.log statements can be removed or converted to proper logging
   - Keep them for now as they're helpful for debugging

2. **Fix UI Test Selectors** (separate issue)
   - Update button selectors to be more specific
   - Add data-testid attributes to components
   - Fix back button visibility issue

3. **Add Server-Side Logging**
   - Consider using a proper logging library
   - Log authentication events for monitoring

### Test Results Summary
- Authentication flow: **WORKING** ✅
- Diagnostic test: **1/1 PASSING** ✅
- Setup step 1 tests: **8/15 PASSING** ✅ (other 7 are UI issues, not auth)
- Users can successfully: Sign up → Get token → Access /setup/step-1 ✅

## Lessons Learned

1. **Always check runtime environment** - Next.js middleware runs in Edge Runtime, not Node.js
2. **Read error messages carefully** - The "crypto module not supported" error was the key clue
3. **Use appropriate libraries** - Use `jose` for Edge Runtime, `jsonwebtoken` for Node.js
4. **Add diagnostic logging early** - Would have caught this faster with logging from the start
5. **Test in headed mode** - Seeing the browser makes debugging much easier
6. **Watch network and console** - Browser DevTools + Playwright logs = debugging superpower

## References

- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [jose library](https://github.com/panva/jose)
- [jsonwebtoken library](https://github.com/auth0/node-jsonwebtoken)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
