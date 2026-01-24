import { test, expect } from '@playwright/test';

test.describe('Setup Step 1 - Diagnostics', () => {
  test('should complete signup flow and reach setup page', async ({ page, context }) => {
    // Enable verbose console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[Browser ${type}]:`, text);
    });

    // Log page errors
    page.on('pageerror', error => {
      console.error('[Browser ERROR]:', error.message);
    });

    // Log network responses
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/auth/register') || url.includes('/setup')) {
        console.log(`[Network ${response.status()}]:`, url);
      }
    });

    // Go to signup
    console.log('=== STEP 1: Navigate to signup page ===');
    await page.goto('/signup');
    console.log('✓ Navigated to signup page');

    // Fill form
    const testEmail = `diagtest${Date.now()}@example.com`;
    console.log('=== STEP 2: Fill signup form ===');
    console.log('✓ Using test email:', testEmail);

    await page.getByLabel(/full name/i).fill('Diagnostic Test User');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/terms/i).check();
    console.log('✓ Form filled');

    // Check cookies before submit
    console.log('=== STEP 3: Check state before signup ===');
    const cookiesBefore = await context.cookies();
    console.log('✓ Cookies before signup:', cookiesBefore.length);
    cookiesBefore.forEach(c => {
      console.log('  - Cookie:', c.name, '=', c.value.substring(0, 20) + '...');
    });

    // Submit form
    console.log('=== STEP 4: Submit signup form ===');
    await page.getByRole('button', { name: /sign up/i }).click();
    console.log('✓ Signup button clicked');

    // Wait for navigation or error
    console.log('=== STEP 5: Wait for response ===');
    await page.waitForTimeout(3000); // Give it time to process

    const currentUrl = page.url();
    console.log('✓ Current URL after signup:', currentUrl);

    // Check cookies after submit
    console.log('=== STEP 6: Check state after signup ===');
    const cookiesAfter = await context.cookies();
    console.log('✓ Cookies after signup:', cookiesAfter.length);
    cookiesAfter.forEach(c => {
      console.log('  - Cookie:', c.name, '=', c.value.substring(0, 20) + '...');
    });

    const tokenCookie = cookiesAfter.find(c => c.name === 'token');
    if (tokenCookie) {
      console.log('✓ Token cookie found:');
      console.log('  - Value:', tokenCookie.value.substring(0, 30) + '...');
      console.log('  - Domain:', tokenCookie.domain);
      console.log('  - Path:', tokenCookie.path);
      console.log('  - HttpOnly:', tokenCookie.httpOnly);
      console.log('  - Secure:', tokenCookie.secure);
      console.log('  - SameSite:', tokenCookie.sameSite);
    } else {
      console.log('✗ No token cookie found');
    }

    // Check localStorage
    const localStorageToken = await page.evaluate(() => localStorage.getItem('token'));
    if (localStorageToken) {
      console.log('✓ Token in localStorage:', localStorageToken.substring(0, 30) + '...');
    } else {
      console.log('✗ No token in localStorage');
    }

    // Check if we're on setup page
    console.log('=== STEP 7: Verify final destination ===');
    if (currentUrl.includes('/setup/step-1')) {
      console.log('✅ SUCCESS: Reached setup page');
      await expect(page).toHaveURL('/setup/step-1');

      // Take a screenshot for verification
      await page.screenshot({ path: 'tests/screenshots/setup-step-1-success.png' });
      console.log('✓ Screenshot saved to tests/screenshots/setup-step-1-success.png');
    } else if (currentUrl.includes('/login')) {
      console.log('❌ FAIL: Redirected to login (auth failed)');

      // Take a screenshot for debugging
      await page.screenshot({ path: 'tests/screenshots/setup-step-1-fail-login.png' });
      console.log('✓ Screenshot saved to tests/screenshots/setup-step-1-fail-login.png');

      throw new Error('Redirected to login instead of setup - authentication failed');
    } else if (currentUrl.includes('/signup')) {
      console.log('❌ FAIL: Still on signup (submit failed)');

      // Check for error messages
      const errorMessage = await page.locator('[style*="destructive"]').textContent().catch(() => 'No error message found');
      console.log('Error message on page:', errorMessage);

      // Take a screenshot for debugging
      await page.screenshot({ path: 'tests/screenshots/setup-step-1-fail-signup.png' });
      console.log('✓ Screenshot saved to tests/screenshots/setup-step-1-fail-signup.png');

      throw new Error('Still on signup page - submission failed');
    } else {
      console.log('❌ FAIL: Unexpected URL:', currentUrl);

      // Take a screenshot for debugging
      await page.screenshot({ path: 'tests/screenshots/setup-step-1-fail-unexpected.png' });
      console.log('✓ Screenshot saved to tests/screenshots/setup-step-1-fail-unexpected.png');

      throw new Error(`Unexpected URL: ${currentUrl}`);
    }
  });
});
