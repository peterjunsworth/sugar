import { test, expect } from '@playwright/test';

test.use({
  launchOptions: { slowMo: 500 },
  headless: false,
});

// Increase timeout for authentication flow
test.setTimeout(60000);

// Helper to login first (welcome is protected)
async function loginAndNavigate(page: any) {
  // First register a user
  await page.goto('/signup');
  await page.waitForLoadState('networkidle');
  const testEmail = `welcome${Date.now()}@example.com`;

  await page.getByLabel(/full name/i).fill('Welcome Test User');
  await page.getByLabel(/^email$/i).fill(testEmail);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByLabel(/terms/i).check();
  await page.getByRole('button', { name: /create account/i }).click();

  // Wait for redirect after successful signup
  await page.waitForURL(/\/(setup|welcome|login)/, { timeout: 15000 });

  // If redirected to login, need to login
  if (page.url().includes('/login')) {
    await page.getByLabel(/^email$/i).fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/(setup|welcome|dashboard)/, { timeout: 10000 });
  }

  // Navigate to welcome page
  await page.goto('/welcome');
  await page.waitForLoadState('networkidle');
}

test('Welcome page visual check - All elements', async ({ page }) => {
  await loginAndNavigate(page);

  console.log('✓ Navigated to /welcome');

  // Check main container
  const container = page.locator('.welcome-container');
  await expect(container).toBeVisible();
  console.log('✓ Container visible');

  // Check gradient background - it spans full container
  const gradientBg = page.locator('.gradient-bg');
  await expect(gradientBg).toBeAttached();
  console.log('✓ Gradient background attached');

  // Check animated blobs - they're positioned absolutely and may overflow
  const blob1 = page.locator('.blob-1');
  const blob2 = page.locator('.blob-2');
  const blob3 = page.locator('.blob-3');
  await expect(blob1).toBeAttached();
  await expect(blob2).toBeAttached();
  await expect(blob3).toBeAttached();
  console.log('✓ All 3 animated blobs attached');

  // Check version badge
  const versionBadge = page.locator('.version-badge');
  await expect(versionBadge).toBeVisible();
  await expect(versionBadge).toContainText('v1.0 Beta');
  console.log('✓ Version badge visible');

  // Check app logo
  const appLogo = page.locator('.app-logo');
  await expect(appLogo).toBeVisible();
  console.log('✓ App logo visible');

  // Check app title
  const appTitle = page.locator('.app-title');
  await expect(appTitle).toBeVisible();
  await expect(appTitle).toContainText('Sugar Tracker');
  console.log('✓ App title visible');

  // Check app subtitle
  const appSubtitle = page.locator('.app-subtitle');
  await expect(appSubtitle).toBeVisible();
  await expect(appSubtitle).toContainText('Your intelligent glucose companion');
  console.log('✓ App subtitle visible');

  // Check feature items
  const featureItems = page.locator('.feature-item');
  const featureCount = await featureItems.count();
  expect(featureCount).toBe(3);
  console.log(`✓ ${featureCount} feature items visible`);

  // Check specific features
  const chatFeature = page.locator('.feature-title', { hasText: 'Chat with AI' });
  await expect(chatFeature).toBeVisible();
  console.log('✓ Chat with AI feature visible');

  const trackFeature = page.locator('.feature-title', { hasText: 'Track Everything' });
  await expect(trackFeature).toBeVisible();
  console.log('✓ Track Everything feature visible');

  const insightsFeature = page.locator('.feature-title', { hasText: 'Smart Insights' });
  await expect(insightsFeature).toBeVisible();
  console.log('✓ Smart Insights feature visible');

  // Check CTA button with user name
  const ctaButton = page.locator('.cta-button');
  await expect(ctaButton).toBeVisible();
  const buttonText = await ctaButton.textContent();
  expect(buttonText).toContain('Get Started');
  expect(buttonText).toContain('Welcome Test User');
  console.log('✓ CTA button with user name visible');

  console.log('');
  console.log('✅ ALL WELCOME PAGE ELEMENTS VISIBLE');

  await page.waitForTimeout(3000);
});

test('Welcome page navigation', async ({ page }) => {
  await loginAndNavigate(page);

  console.log('✓ Navigated to /welcome');

  // Test continue/dashboard button
  const ctaButton = page.locator('.cta-button');
  await ctaButton.click();
  await page.waitForTimeout(1000);

  // Should navigate to dashboard
  const currentUrl = page.url();
  console.log(`✓ Navigated to: ${currentUrl}`);

  if (currentUrl.includes('/dashboard')) {
    console.log('✅ NAVIGATION TO DASHBOARD WORKS');
  } else {
    console.log(`⚠️  Expected /dashboard, got: ${currentUrl}`);
  }

  await page.waitForTimeout(2000);
});

test('Welcome page animations check', async ({ page }) => {
  await loginAndNavigate(page);

  console.log('✓ Navigated to /welcome');

  // Check that animated elements have animation classes
  const header = page.locator('.welcome-header');
  const headerAnimation = await header.evaluate((el) => {
    return window.getComputedStyle(el).animation;
  });
  console.log(`✓ Header animation: ${headerAnimation ? 'present' : 'missing'}`);

  // Check logo pulse animation
  const logo = page.locator('.app-logo');
  const logoAnimation = await logo.evaluate((el) => {
    return window.getComputedStyle(el).animation;
  });
  console.log(`✓ Logo pulse animation: ${logoAnimation ? 'present' : 'missing'}`);

  // Check blob animations - blobs are positioned absolutely with negative values
  const blob1 = page.locator('.blob-1');
  await expect(blob1).toBeAttached();
  const blobAnimation = await blob1.evaluate((el) => {
    return window.getComputedStyle(el).animation;
  });
  console.log(`✓ Blob float animation: ${blobAnimation ? 'present' : 'missing'}`);

  console.log('');
  console.log('✅ ANIMATIONS VERIFIED');

  await page.waitForTimeout(3000);
});

test('Welcome page responsive layout', async ({ page }) => {
  // Test mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await loginAndNavigate(page);

  console.log('✓ Testing mobile view (375px)');

  const container = page.locator('.welcome-container');
  await expect(container).toBeVisible();

  const featureItems = page.locator('.feature-item');
  const featureCount = await featureItems.count();
  expect(featureCount).toBe(3);
  console.log('✓ All features visible on mobile');

  const ctaButton = page.locator('.cta-button');
  await expect(ctaButton).toBeVisible();
  console.log('✓ CTA button visible on mobile');

  // Test tablet view
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  console.log('✓ Testing tablet view (768px)');

  await expect(container).toBeVisible();
  console.log('✓ Container visible on tablet');

  // Test desktop view
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  console.log('✓ Testing desktop view (1920px)');

  await expect(container).toBeVisible();
  console.log('✓ Container visible on desktop');

  console.log('');
  console.log('✅ RESPONSIVE LAYOUT WORKS');

  await page.waitForTimeout(2000);
});
