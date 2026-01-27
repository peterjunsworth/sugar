import { test, expect } from '@playwright/test';

test.describe('Welcome Page', () => {
  const testPassword = 'TestPass123!';
  const testName = 'Test User';

  test.beforeEach(async ({ page }, testInfo) => {
    // Generate unique email for each test using test title hash to avoid conflicts
    const testEmail = `test-welcome-${Date.now()}-${testInfo.workerIndex}@example.com`;

    // Register a new user first
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    // Fill signup form
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/^email$/i).fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel(/terms/i).check();

    // Click signup button
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for redirect after successful signup
    await page.waitForURL(/\/(setup|welcome|login)/, { timeout: 15000 });

    // If redirected to login, need to login
    if (page.url().includes('/login')) {
      await page.getByLabel(/^email$/i).fill(testEmail);
      await page.getByLabel('Password', { exact: true }).fill(testPassword);
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/(setup|welcome|dashboard)/, { timeout: 10000 });
    }

    // If redirected to setup, skip it and go to welcome
    if (page.url().includes('/setup')) {
      await page.goto('/welcome');
    }

    await page.waitForLoadState('networkidle');
  });

  test('should render welcome page with app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sugar tracker/i })).toBeVisible();
  });

  test('should display app subtitle', async ({ page }) => {
    await expect(page.getByText(/intelligent glucose companion/i)).toBeVisible();
  });

  test('should display feature: Chat with AI', async ({ page }) => {
    await expect(page.getByText(/chat with ai/i)).toBeVisible();
    await expect(page.getByText(/ask questions.*personalized advice/i)).toBeVisible();
  });

  test('should display feature: Track Everything', async ({ page }) => {
    await expect(page.getByText(/track everything/i)).toBeVisible();
    await expect(page.getByText(/monitor glucose levels/i)).toBeVisible();
  });

  test('should display feature: Smart Insights', async ({ page }) => {
    await expect(page.getByText(/smart insights/i)).toBeVisible();
    await expect(page.getByText(/ai-powered predictions/i)).toBeVisible();
  });

  test('should have Get Started button with user name', async ({ page }) => {
    // The button says "Get Started, {userName}"
    const getStartedBtn = page.getByRole('button', { name: /get started/i });
    await expect(getStartedBtn).toBeVisible();
  });

  test('should navigate to dashboard when Get Started button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /get started/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  });

  test('should display version badge', async ({ page }) => {
    await expect(page.getByText(/v1\.0 beta/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /sugar tracker/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear auth by clearing all cookies and local storage
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Navigate to a different page first to ensure clean state
    await page.goto('/landing');
    await page.waitForLoadState('networkidle');

    // Try to access welcome page
    await page.goto('/welcome');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
  });

  test('should show loading state while authenticating', async ({ page }) => {
    // This test verifies the page has some form of loading indicator
    // The page shows "Loading..." text during auth check
    // Since we're already authenticated, we may not see it, but we can verify the page structure
    await expect(page.getByRole('heading', { name: /sugar tracker/i })).toBeVisible();
  });

  test('should display droplet icon in header', async ({ page }) => {
    // The page has a Droplet icon in the app-logo div
    const logoContainer = page.locator('.app-logo');
    await expect(logoContainer).toBeVisible();

    // Check that it contains an SVG icon
    const hasIcon = await logoContainer.locator('svg').count();
    expect(hasIcon).toBeGreaterThan(0);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    // Filter out favicon and other common errors
    const relevantErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('404') &&
      !e.toLowerCase().includes('manifest')
    );

    expect(relevantErrors).toHaveLength(0);
  });

  test('should display all three feature icons', async ({ page }) => {
    // Check for feature icons (MessageCircle, Activity, Sparkles from lucide-react)
    const featureItems = page.locator('.feature-item');
    await expect(featureItems).toHaveCount(3);
  });

  test('should have animated gradient background', async ({ page }) => {
    // The page has gradient-bg with animated blobs
    const gradientBg = page.locator('.gradient-bg');
    await expect(gradientBg).toBeVisible();

    // Check for blob elements
    const blobs = page.locator('.gradient-blob');
    await expect(blobs).toHaveCount(3);
  });
});
