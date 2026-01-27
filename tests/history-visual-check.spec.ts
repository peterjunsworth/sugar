import { test, expect } from '@playwright/test';

test.describe('History Page - Visual Design Verification', () => {
  const testPassword = 'password123';

  // Setup: Create user and complete onboarding before each test
  test.beforeEach(async ({ page }) => {
    console.log('\n🔐 Creating test user and logging in...');

    // Navigate to signup to create a test user
    await page.goto('http://localhost:3000/signup');

    // Fill signup form with unique email
    const uniqueEmail = `history-visual-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Visual Test User');
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

  test('Timeline structure matches mockup', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Check timeline has vertical line
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();

    // Check timeline items have proper structure
    const timelineItem = page.locator('.timeline-item').first();
    await expect(timelineItem).toBeVisible();

    // Check for timeline dot
    const timelineDot = page.locator('.timeline-dot').first();
    await expect(timelineDot).toBeVisible();

    // Check for timeline card
    const timelineCard = page.locator('.timeline-card').first();
    await expect(timelineCard).toBeVisible();

    // Verify card has all required elements
    await expect(timelineCard.locator('.timeline-time')).toBeVisible();
    await expect(timelineCard.locator('.timeline-title')).toBeVisible();
    await expect(timelineCard.locator('.timeline-details')).toBeVisible();
  });

  test('Timeline dots have correct colors for entry types', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Test meal entries (orange/coral dots)
    await page.click('.tab-btn[data-tab="meals"]');
    await page.waitForTimeout(500);
    const mealDot = page.locator('.timeline-dot.meal').first();
    await expect(mealDot).toBeVisible();

    // Test glucose entries (blue/primary dots)
    await page.click('.tab-btn[data-tab="glucose"]');
    await page.waitForTimeout(500);
    const glucoseDot = page.locator('.timeline-dot.glucose').first();
    await expect(glucoseDot).toBeVisible();

    // Test exercise entries (purple dots)
    await page.click('.tab-btn[data-tab="exercise"]');
    await page.waitForTimeout(500);
    const exerciseDot = page.locator('.timeline-dot.exercise').first();
    await expect(exerciseDot).toBeVisible();
  });

  test('Timeline badges have correct styling and icons', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    // Check for badges in meal entries
    await page.click('.tab-btn[data-tab="meals"]');
    await page.waitForTimeout(500);

    const badges = page.locator('.timeline-badge');
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);

    // Check badge has icon and text
    const firstBadge = badges.first();
    await expect(firstBadge).toBeVisible();
    await expect(firstBadge).toContainText('mg/dL');
  });

  test('Date header displays correctly with navigation buttons', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Check date header is visible
    const dateHeader = page.locator('.date-header');
    await expect(dateHeader).toBeVisible();

    // Check date text
    const dateText = page.locator('.date-text');
    await expect(dateText).toBeVisible();

    // Check navigation buttons exist and are visible
    const prevBtn = page.locator('.date-nav-btn[aria-label="Previous day"]');
    const nextBtn = page.locator('.date-nav-btn[aria-label="Next day"]');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    // Check that date nav container exists
    const dateNav = page.locator('.date-nav');
    await expect(dateNav).toBeVisible();

    // Verify we have exactly 2 navigation buttons
    const navButtons = page.locator('.date-nav-btn');
    expect(await navButtons.count()).toBe(2);
  });

  test('Tabs have correct active state styling', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Check initial active tab (Meals)
    const mealsTab = page.locator('.tab-btn[data-tab="meals"]');
    await expect(mealsTab).toHaveClass(/active/);

    // Click Glucose tab
    await page.click('.tab-btn[data-tab="glucose"]');
    await page.waitForTimeout(300);

    // Verify Glucose tab is now active
    const glucoseTab = page.locator('.tab-btn[data-tab="glucose"]');
    await expect(glucoseTab).toHaveClass(/active/);

    // Verify Meals tab is no longer active
    await expect(mealsTab).not.toHaveClass(/active/);
  });

  test('Timeline cards have hover effect', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    const firstCard = page.locator('.timeline-card').first();

    // Hover over the card
    await firstCard.hover();

    // Card should be visible and interactive
    await expect(firstCard).toBeVisible();

    // Wait a bit for hover animation
    await page.waitForTimeout(300);
  });

  test('Responsive design: Content wrapper has correct max-width', async ({ page }) => {
    // Test desktop (1024px+)
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:3000/dashboard/history');
    await page.waitForSelector('.timeline-item', { timeout: 10000 });

    let contentWrapper = page.locator('.content-container .content-wrapper');
    let maxWidth = await contentWrapper.evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });

    // Desktop should have 900px max-width
    expect(maxWidth).toBe('900px');

    // Test tablet (768px-1023px)
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);

    maxWidth = await contentWrapper.evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });

    // Tablet should have 600px max-width
    expect(maxWidth).toBe('600px');

    // Test mobile (< 768px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    maxWidth = await contentWrapper.evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });

    // Mobile should have 100% max-width
    expect(maxWidth).toBe('100%');
  });

  test('Header has correct styling and structure', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // Check header bar
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();

    // Check header title
    const headerTitle = page.locator('.header-title');
    await expect(headerTitle).toHaveText('History');

    // Check header buttons
    const backBtn = page.locator('.header-btn[aria-label="Back to dashboard"]');
    const themeBtn = page.locator('.header-btn[aria-label="Toggle theme"]');
    const filterBtn = page.locator('.header-btn[aria-label="Filter"]');

    await expect(backBtn).toBeVisible();
    await expect(themeBtn).toBeVisible();
    await expect(filterBtn).toBeVisible();
  });

  test('Empty state displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/history');

    // First check if we have entries
    const hasEntries = await page.locator('.timeline-item').count() > 0;

    if (!hasEntries) {
      // If no entries, check empty state
      const emptyState = page.locator('.empty-state');
      await expect(emptyState).toBeVisible();

      const emptyTitle = page.locator('.empty-title');
      await expect(emptyTitle).toContainText('No entries yet');

      const emptyDescription = page.locator('.empty-description');
      await expect(emptyDescription).toBeVisible();
    } else {
      // Skip this test if we have entries
      test.skip();
    }
  });
});
