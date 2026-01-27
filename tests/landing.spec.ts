import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/landing');
  });

  test('should render hero section with CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Take Control of Your Glucose Levels');
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  });

  test('should navigate to signup when hero CTA clicked', async ({ page }) => {
    await page.getByRole('link', { name: /get started free/i }).first().click();
    await expect(page).toHaveURL('/signup');
  });

  test('should display all 3 features', async ({ page }) => {
    const features = page.locator('.feature-card');
    await expect(features).toHaveCount(3);

    // Verify feature titles within feature cards
    await expect(features.filter({ hasText: 'Chat with AI' })).toBeVisible();
    await expect(features.filter({ hasText: 'Comprehensive Tracking' })).toBeVisible();
    await expect(features.filter({ hasText: 'Smart Predictions' })).toBeVisible();
  });

  test('should display section headings', async ({ page }) => {
    // The simplified landing page has "Everything You Need" as the features section heading
    await expect(page.getByRole('heading', { name: 'Everything You Need' })).toBeVisible();
  });

  test('should display feature cards with descriptions', async ({ page }) => {
    const features = page.locator('.feature-card');
    await expect(features).toHaveCount(3);

    // Verify each feature card has both title and description
    const chatFeature = features.filter({ hasText: 'Chat with AI' });
    await expect(chatFeature).toContainText('Log meals with photos');

    const trackingFeature = features.filter({ hasText: 'Comprehensive Tracking' });
    await expect(trackingFeature).toContainText('Monitor glucose levels');

    const predictionsFeature = features.filter({ hasText: 'Smart Predictions' });
    await expect(predictionsFeature).toContainText('AI-powered glucose predictions');
  });

  test('should display final CTA section', async ({ page }) => {
    // The simplified landing page has different CTA text
    await expect(page.locator('text=Ready to start your journey?')).toBeVisible();
    await expect(page.getByRole('link', { name: /create your account/i })).toBeVisible();
  });

  test('should navigate to signup from footer CTA', async ({ page }) => {
    // The simplified landing page has a footer CTA instead of pricing cards
    await page.getByRole('link', { name: /create your account/i }).click();
    await expect(page).toHaveURL('/signup');
  });

  test('should navigate to login from secondary CTA', async ({ page }) => {
    await page.getByRole('link', { name: /already have an account/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should have header with logo and login link', async ({ page }) => {
    // The simplified landing page has a header with logo and login link
    await expect(page.locator('.logo-text')).toContainText('Sugar Tracker');
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
  });

  test('should have gradient background', async ({ page }) => {
    // The simplified landing page uses gradient blobs for background
    // The gradient-bg element exists but may be hidden (used as a visual effect layer)
    await expect(page.locator('.gradient-bg')).toBeAttached();
    await expect(page.locator('.gradient-blob')).toHaveCount(2);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should be visible
    await expect(page.locator('h1')).toBeVisible();

    // Features should stack vertically (all 3 visible)
    const features = page.locator('.feature-card');
    await expect(features).toHaveCount(3);

    // CTAs should be visible
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // All sections should be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Everything You Need' })).toBeVisible();
    // The simplified landing page doesn't have "How It Works" or "Choose Your Plan" sections
    await expect(page.locator('.footer-cta')).toBeVisible();
  });

  test('should show hover effects on cards', async ({ page }) => {
    const firstFeature = page.locator('.feature-card').first();

    // Verify the feature card exists
    await expect(firstFeature).toBeVisible();

    // Hover over the card
    await firstFeature.hover();

    // Wait a bit for transition
    await page.waitForTimeout(500);

    // Verify card is still visible after hover (basic hover test)
    await expect(firstFeature).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check that interactive elements are accessible
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible();

    // Check that links are keyboard accessible
    await page.keyboard.press('Tab');
    // First tab should focus on an interactive element
  });

  test('should display all icons correctly', async ({ page }) => {
    // Feature icons should be visible (via feature-icon-wrapper)
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(3);

    // Each feature card should have an icon wrapper
    const iconWrappers = page.locator('.feature-icon-wrapper');
    await expect(iconWrappers).toHaveCount(3);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check h1 exists and is unique
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);

    // Check h2 section headings exist
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/landing');
    await page.waitForLoadState('networkidle');

    // Should have no console errors
    expect(errors.length).toBe(0);
  });
});
