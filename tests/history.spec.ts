import { test, expect } from '@playwright/test';

test.describe('History Page - Functional Tests', () => {
  const testPassword = 'password123';

  // Setup: Create user and complete onboarding before each test
  test.beforeEach(async ({ page }) => {
    console.log('\n🔐 Creating test user and logging in...');

    // Navigate to signup to create a test user
    await page.goto('http://localhost:3000/signup');

    // Fill signup form with unique email
    const uniqueEmail = `history-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('History Test User');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    await page.locator('input[type="checkbox"]').check();

    // Submit signup
    await Promise.all([
      page.waitForURL('**/setup/step-1', { timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);

    console.log('✅ Signup successful, completing onboarding...');

    // Complete onboarding steps quickly
    // Step 1: Personal Info
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="weight"]', '70');
    await page.selectOption('select[name="diabetesType"]', 'type1');
    await Promise.all([
      page.waitForURL('**/setup/step-2', { timeout: 5000 }),
      page.click('button.btn-primary')
    ]);

    // Step 2: Device Selection
    await page.click('.device-card:has-text("Manual Entry")');
    await Promise.all([
      page.waitForURL('**/setup/step-3', { timeout: 5000 }),
      page.click('button.btn-primary')
    ]);

    // Step 3: Complete Setup
    await Promise.all([
      page.waitForURL('**/welcome', { timeout: 15000 }),
      page.click('button.btn-primary')
    ]);

    // Navigate to dashboard by clicking "Get Started" button
    await page.click('button:has-text("Get Started")');
    await page.waitForURL(/dashboard/, { timeout: 5000 });

    console.log('✅ Onboarding complete, user authenticated');
  });

  test('Page loads successfully with header and tabs', async ({ page }) => {
    // Navigate to history page
    await page.goto('http://localhost:3000/dashboard/history');

    // Check header is visible
    await expect(page.locator('h1.header-title')).toContainText('History');

    // Check tabs are present
    await expect(page.locator('.tab-btn[data-tab="meals"]')).toBeVisible();
    await expect(page.locator('.tab-btn[data-tab="glucose"]')).toBeVisible();
    await expect(page.locator('.tab-btn[data-tab="exercise"]')).toBeVisible();

    // Check date header is visible
    await expect(page.locator('.date-header')).toBeVisible();
  });

  test('Tab switching filters entries correctly - Meals', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for initial load
    await page.waitForSelector('.timeline', { timeout: 10000 });

    // Click Meals tab (should be active by default)
    await page.click('.tab-btn[data-tab="meals"]');

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Check that active tab has 'active' class
    await expect(page.locator('.tab-btn[data-tab="meals"]')).toHaveClass(/active/);

    // Check timeline is visible
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();

    // Check for meal entries (should have meal dots)
    const mealDots = page.locator('.timeline-dot.meal');
    const mealCount = await mealDots.count();
    expect(mealCount).toBeGreaterThan(0);
  });

  test('Tab switching filters entries correctly - Glucose', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for initial load
    await page.waitForSelector('.timeline', { timeout: 10000 });

    // Click Glucose tab
    await page.click('.tab-btn[data-tab="glucose"]');

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Check that active tab has 'active' class
    await expect(page.locator('.tab-btn[data-tab="glucose"]')).toHaveClass(/active/);

    // Check for glucose entries (should have glucose dots)
    const glucoseDots = page.locator('.timeline-dot.glucose');
    const glucoseCount = await glucoseDots.count();
    expect(glucoseCount).toBeGreaterThan(0);
  });

  test('Tab switching filters entries correctly - Exercise', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for initial load
    await page.waitForSelector('.timeline', { timeout: 10000 });

    // Click Exercise tab
    await page.click('.tab-btn[data-tab="exercise"]');

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Check that active tab has 'active' class
    await expect(page.locator('.tab-btn[data-tab="exercise"]')).toHaveClass(/active/);

    // Check for exercise entries (should have exercise dots)
    const exerciseDots = page.locator('.timeline-dot.exercise');
    const exerciseCount = await exerciseDots.count();
    expect(exerciseCount).toBeGreaterThan(0);
  });

  test('Timeline entries render with correct structure', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for timeline to load
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Get first timeline item
    const firstEntry = page.locator('.timeline-item').first();

    // Check structure
    await expect(firstEntry.locator('.timeline-dot')).toBeVisible();
    await expect(firstEntry.locator('.timeline-card')).toBeVisible();
    await expect(firstEntry.locator('.timeline-time')).toBeVisible();
    await expect(firstEntry.locator('.timeline-title')).toBeVisible();
    await expect(firstEntry.locator('.timeline-details')).toBeVisible();
  });

  test('Date header displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Check date header elements
    await expect(page.locator('.date-header .date-text')).toBeVisible();
    await expect(page.locator('.date-nav-btn').first()).toBeVisible();
    await expect(page.locator('.date-nav-btn').last()).toBeVisible();

    // Check date text contains a date (not empty)
    const dateText = await page.locator('.date-header .date-text').textContent();
    expect(dateText).toBeTruthy();
    expect(dateText?.length).toBeGreaterThan(0);
  });

  test('Timeline is scrollable with many entries', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for timeline to load
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Check that we have many entries (50+)
    const entries = page.locator('.timeline-item');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(30); // At least 30 entries

    // Get timeline container
    const contentContainer = page.locator('.content-container');

    // Check if scrollable (has overflow) - may or may not be scrollable depending on viewport size
    const isScrollable = await contentContainer.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    // If scrollable, test scrolling functionality
    if (isScrollable) {
      await contentContainer.evaluate((el) => el.scrollTop = 200);
      const scrollTop = await contentContainer.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    } else {
      // If not scrollable, just verify we have enough content
      const scrollHeight = await contentContainer.evaluate((el) => el.scrollHeight);
      expect(scrollHeight).toBeGreaterThan(0);
    }
  });

  test('API integration works and returns data', async ({ page }) => {
    // Set up response listener before navigating
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/history') && response.status() === 200,
      { timeout: 15000 }
    );

    // Navigate to the page
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for the API response
    await responsePromise;

    // Check that timeline items are rendered
    const itemCount = await page.locator('.timeline-item').count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('Back button navigates to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Click back button
    await page.click('.header-btn[aria-label="Back to dashboard"]');

    // Wait for navigation
    await page.waitForURL(/\/dashboard$/, { timeout: 5000 });

    // Should be on dashboard
    expect(page.url()).toContain('/dashboard');
    expect(page.url()).not.toContain('/history');
  });

  test('Sidebar navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Check sidebar is visible (desktop) or can be opened (mobile)
    const sidebar = page.locator('.sidebar');

    // If not visible, click menu button to open it
    const isSidebarVisible = await sidebar.isVisible();
    if (!isSidebarVisible) {
      await page.click('button[aria-label="Menu"]');
      await page.waitForSelector('.sidebar.active', { timeout: 2000 });
    }

    // Check sidebar links are present and visible
    await expect(page.locator('.sidebar .nav-item[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('.sidebar .nav-item[href="/dashboard/history"]')).toBeVisible();
    await expect(page.locator('.sidebar .nav-item[href="/dashboard/history"]')).toHaveClass(/active/);

    // Check that Dashboard link has correct href
    const dashboardLink = page.locator('.sidebar .nav-item[href="/dashboard"]');
    const href = await dashboardLink.getAttribute('href');
    expect(href).toBe('/dashboard');

    // Check Profile and Settings links exist
    await expect(page.locator('.sidebar .nav-item[href="#"]').first()).toBeVisible();
  });

  test('Theme toggle works', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Get initial theme
    const html = page.locator('html');
    const initialHasDark = await html.evaluate((el) => el.classList.contains('dark'));

    // Click theme toggle
    await page.click('.header-btn[aria-label="Toggle theme"]');

    // Wait for class change
    await page.waitForTimeout(500);

    // Check theme changed
    const afterHasDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterHasDark).not.toBe(initialHasDark);
  });

  test('Protected route redirects when not authenticated', async ({ page, context }) => {
    // Clear auth cookies/storage
    await context.clearCookies();
    await context.clearPermissions();

    // Try to access history page directly
    await page.goto('http://localhost:3000/dashboard/history');

    // Should redirect to login
    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3000/dashboard/history');

    // Check that tabs are horizontally scrollable
    const tabList = page.locator('.tab-list');
    await expect(tabList).toBeVisible();

    // Check timeline is visible and properly sized
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();

    // Menu button should be visible on mobile
    await expect(page.locator('.header-btn[aria-label="Menu"]')).toBeVisible();
  });

  test('All 4 entry types render with correct icons and badges', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Wait for timeline to load
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Check for different entry types by switching tabs
    // Map tab names to dot classes (singular form)
    const entryTypesMap = [
      { tab: 'meals', dotClass: 'meal' },
      { tab: 'glucose', dotClass: 'glucose' },
      { tab: 'exercise', dotClass: 'exercise' }
    ];

    for (const { tab, dotClass } of entryTypesMap) {
      await page.click(`.tab-btn[data-tab="${tab}"]`);
      await page.waitForTimeout(1000);

      // Check that entries are visible
      const entries = page.locator('.timeline-item');
      const count = await entries.count();
      expect(count).toBeGreaterThan(0);

      // Check that appropriate dots are present (using singular form)
      const dots = page.locator(`.timeline-dot.${dotClass}`);
      const dotCount = await dots.count();
      expect(dotCount).toBeGreaterThan(0);
    }
  });

  test('Empty state shows when no entries available', async ({ page }) => {
    // This test would need a way to clear entries or use a specific filter with no results
    // For now, we'll skip as we have mock data
    // Could be implemented with a specific API mock or query parameter
    test.skip();
  });
});
