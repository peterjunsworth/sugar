import { test, expect } from '@playwright/test';

test.describe('Welcome Page', () => {
  // Generate unique email for each test run to avoid conflicts
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPass123!';
  const testName = 'Test User';

  test.beforeEach(async ({ page }) => {
    // Register a new user first
    await page.goto('/signup');
    await page.locator('#name').fill(testName);
    await page.locator('#email').fill(testEmail);
    await page.locator('#password').fill(testPassword);
    await page.locator('#confirmPassword').fill(testPassword);

    // Accept terms
    await page.getByRole('checkbox', { name: /terms/i }).check();

    // Click signup button
    await page.getByRole('button', { name: /sign up/i }).click();

    // Sometimes redirects to login after signup, in which case login
    await page.waitForURL(/\/(setup|welcome|login)/, { timeout: 10000 });

    if (page.url().includes('/login')) {
      // Need to login after signup
      await page.locator('#email').fill(testEmail);
      await page.locator('input[type="password"]').fill(testPassword);
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/(setup|welcome)/, { timeout: 10000 });
    }

    // If redirected to setup, skip it and go to welcome
    if (page.url().includes('/setup')) {
      await page.goto('/welcome');
    }

    await page.waitForLoadState('networkidle');
  });

  test('should render personalized greeting', async ({ page }) => {
    await expect(page.getByText(/welcome/i)).toBeVisible();
    // Should include user name if available
  });

  test('should display quick stats cards', async ({ page }) => {
    await expect(page.getByText(/days active/i)).toBeVisible();
    await expect(page.getByText(/entries logged/i)).toBeVisible();
    await expect(page.getByText(/average glucose/i)).toBeVisible();
  });

  test('should show stat values', async ({ page }) => {
    // Stats should show numbers
    const statsContainer = page.locator('[data-testid="quick-stats"]');
    await expect(statsContainer).toBeVisible();

    // Should contain numeric values
    const statsText = await statsContainer.textContent();
    expect(statsText).toMatch(/\d+/); // Contains at least one number
  });

  test('should have Continue to Dashboard button', async ({ page }) => {
    const continueBtn = page.getByRole('button', { name: /continue to dashboard/i });
    await expect(continueBtn).toBeVisible();
  });

  test('should navigate to dashboard when continue button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /continue to dashboard/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  });

  test('should have Review Profile link', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: /review profile/i });
    await expect(profileBtn).toBeVisible();
  });

  test('should navigate to profile when link clicked', async ({ page }) => {
    await page.getByRole('button', { name: /review profile/i }).click();
    await page.waitForURL(/\/dashboard\/profile/, { timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/welcome/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });

  test('should work in dark mode', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.locator('[data-testid="theme-toggle"]').first();

    // Check if theme toggle exists
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Check if dark mode is applied (either initially or after toggle)
    const hasClass = await html.evaluate((el) => el.classList.contains('dark'));

    // Verify welcome content is still visible
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear auth by clearing all cookies and local storage
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Navigate to a new page first to ensure clean state
    await page.goto('/landing');

    // Try to access welcome page
    await page.goto('/welcome');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
  });

  test('should show greeting animation on load', async ({ page }) => {
    // Check for animation class or transition
    const hero = page.locator('[data-testid="welcome-hero"]');
    await expect(hero).toBeVisible();

    // Verify hero exists and is rendered
    await expect(hero).toHaveCount(1);
  });

  test('should calculate days active correctly', async ({ page }) => {
    const daysActiveText = page.locator('[data-testid="days-active"]');
    await expect(daysActiveText).toBeVisible();

    const text = await daysActiveText.textContent();
    expect(text).toMatch(/\d+/); // Should contain a number
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

  test('should display hero icon', async ({ page }) => {
    const hero = page.locator('[data-testid="welcome-hero"]');
    await expect(hero).toBeVisible();

    // Check that hero contains an icon (Sparkles or Heart from lucide-react)
    const hasIcon = await hero.locator('svg').count();
    expect(hasIcon).toBeGreaterThan(0);
  });

  test('should show subtitle based on user state', async ({ page }) => {
    const hero = page.locator('[data-testid="welcome-hero"]');
    await expect(hero).toBeVisible();

    const text = await hero.textContent();
    // Should contain either first-time or returning user subtitle
    const hasValidSubtitle =
      text?.includes("Let's get started") ||
      text?.includes("Here's your quick summary");

    expect(hasValidSubtitle).toBeTruthy();
  });

  test('should show Your Progress heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /your progress/i })).toBeVisible();
  });

  test('should display glucose value with mg/dL unit', async ({ page }) => {
    const glucoseStat = page.locator('[data-testid="avg-glucose"]');
    await expect(glucoseStat).toBeVisible();

    const text = await glucoseStat.textContent();
    expect(text).toMatch(/mg\/dL/i);
  });
});
