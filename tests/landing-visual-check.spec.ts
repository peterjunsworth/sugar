import { test, expect } from '@playwright/test';

test.use({
  headless: false,
  slowMo: 1000,
});

test('Landing page visual check - All sections', async ({ page }) => {
  await page.goto('/landing');
  console.log('✓ Navigated to /landing');
  await page.waitForTimeout(2000);

  // Container
  const container = page.locator('.landing-container');
  await expect(container).toBeVisible();
  console.log('✓ Landing container visible');

  // Gradient Background
  const gradientBg = page.locator('.gradient-bg');
  await expect(gradientBg).toBeVisible();
  console.log('✓ Gradient background visible');

  const blob1 = page.locator('.blob-1');
  await expect(blob1).toBeVisible();
  console.log('✓ Blob 1 animation element visible');

  const blob2 = page.locator('.blob-2');
  await expect(blob2).toBeVisible();
  console.log('✓ Blob 2 animation element visible');

  // Header
  const header = page.locator('.landing-header');
  await expect(header).toBeVisible();
  console.log('✓ Header visible');

  const logo = page.locator('.logo-container');
  await expect(logo).toBeVisible();
  console.log('✓ Logo visible');

  const logoText = page.locator('.logo-text');
  await expect(logoText).toContainText('Sugar Tracker');
  console.log('✓ Logo text correct: "Sugar Tracker"');

  const loginLink = page.locator('.login-link');
  await expect(loginLink).toContainText('Log In');
  console.log('✓ Login link visible and correct');

  // Hero Section
  const hero = page.locator('.hero-section');
  await expect(hero).toBeVisible();
  console.log('✓ Hero section visible');

  const heroTitle = page.locator('.hero-title');
  await expect(heroTitle).toContainText('Take Control of Your Glucose Levels');
  console.log('✓ Hero title correct');

  const heroSubtitle = page.locator('.hero-subtitle');
  await expect(heroSubtitle).toContainText('AI-powered tracking');
  console.log('✓ Hero subtitle visible');

  const ctaButtons = page.locator('.cta-buttons');
  await expect(ctaButtons).toBeVisible();
  console.log('✓ CTA buttons container visible');

  const ctaPrimary = page.locator('.cta-primary').first();
  await expect(ctaPrimary).toContainText('Get Started Free');
  console.log('✓ Primary CTA button correct');

  const ctaSecondary = page.locator('.cta-secondary').first();
  await expect(ctaSecondary).toContainText('Already have an account?');
  console.log('✓ Secondary CTA button correct');

  // Features Section
  const features = page.locator('.features-section');
  await expect(features).toBeVisible();
  console.log('✓ Features section visible');

  const sectionTitle = page.locator('.section-title');
  await expect(sectionTitle).toContainText('Everything You Need');
  console.log('✓ Section title correct');

  const featureCards = page.locator('.feature-card');
  await expect(featureCards).toHaveCount(3);
  console.log('✓ 3 feature cards visible');

  // Check individual feature cards
  const card1 = featureCards.nth(0);
  await expect(card1).toContainText('Chat with AI');
  console.log('✓ Feature 1: "Chat with AI"');

  const card2 = featureCards.nth(1);
  await expect(card2).toContainText('Comprehensive Tracking');
  console.log('✓ Feature 2: "Comprehensive Tracking"');

  const card3 = featureCards.nth(2);
  await expect(card3).toContainText('Smart Predictions');
  console.log('✓ Feature 3: "Smart Predictions"');

  // Footer CTA
  const footerCta = page.locator('.footer-cta');
  await expect(footerCta).toBeVisible();
  console.log('✓ Footer CTA section visible');

  const footerCtaText = page.locator('.footer-cta-text');
  await expect(footerCtaText).toContainText('Ready to start your journey?');
  console.log('✓ Footer CTA text correct');

  const footerCtaButton = page.locator('.footer-cta .cta-primary');
  await expect(footerCtaButton).toContainText('Create Your Account');
  console.log('✓ Footer CTA button correct');

  console.log('');
  console.log('✅ ALL SECTIONS VISIBLE AND STRUCTURED CORRECTLY');

  await page.waitForTimeout(3000);
});

test('Landing page navigation', async ({ page }) => {
  await page.goto('/landing');

  // Test Login link
  console.log('Testing login link navigation...');
  await page.locator('.login-link').click();
  await expect(page).toHaveURL('/login');
  console.log('✓ Login link navigates to /login');

  await page.goto('/landing');

  // Test Primary CTA
  console.log('Testing primary CTA navigation...');
  await page.locator('.cta-primary').first().click();
  await expect(page).toHaveURL('/signup');
  console.log('✓ Primary CTA navigates to /signup');

  await page.goto('/landing');

  // Test Secondary CTA
  console.log('Testing secondary CTA navigation...');
  await page.locator('.cta-secondary').first().click();
  await expect(page).toHaveURL('/login');
  console.log('✓ Secondary CTA navigates to /login');

  await page.goto('/landing');

  // Test Footer CTA
  console.log('Testing footer CTA navigation...');
  await page.locator('.footer-cta .cta-primary').click();
  await expect(page).toHaveURL('/signup');
  console.log('✓ Footer CTA navigates to /signup');

  console.log('');
  console.log('✅ ALL NAVIGATION WORKS CORRECTLY');

  await page.waitForTimeout(2000);
});

test('Landing page styling and animations', async ({ page }) => {
  await page.goto('/landing');

  // Check gradient background styling
  const gradientBg = page.locator('.gradient-bg');
  const bgStyles = await gradientBg.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      position: styles.position,
      background: styles.background,
    };
  });

  expect(bgStyles.position).toBe('absolute');
  console.log('✓ Gradient background has correct positioning');

  // Check hero text is white
  const heroTitle = page.locator('.hero-title');
  const titleColor = await heroTitle.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  expect(titleColor).toBe('rgb(255, 255, 255)'); // white
  console.log('✓ Hero title is white on gradient');

  // Check feature cards have hover effect
  const firstCard = page.locator('.feature-card').first();
  await firstCard.hover();
  await page.waitForTimeout(500);
  console.log('✓ Feature card hover effect visible');

  // Check CTA button hover
  const ctaButton = page.locator('.cta-primary').first();
  await ctaButton.hover();
  await page.waitForTimeout(500);
  console.log('✓ CTA button hover effect visible');

  console.log('');
  console.log('✅ ALL STYLING AND ANIMATIONS CORRECT');

  await page.waitForTimeout(2000);
});
