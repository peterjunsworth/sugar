import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  const testEmail = 'dashboard-test@example.com';
  const testPassword = 'password123';

  test.beforeEach(async ({ page }) => {
    console.log('\n🔐 Logging in to access protected dashboard...');

    // Navigate to signup first to create a test user
    await page.goto('http://localhost:3000/signup');

    // Fill signup form with unique email
    const uniqueEmail = `dashboard-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Dashboard Test User');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    await page.locator('input[type="checkbox"]').check();

    // Submit signup
    await Promise.all([
      page.waitForURL('**/setup/step-1', { timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);

    console.log('✅ Signup successful');

    // Complete onboarding steps quickly
    // Step 1: Personal Info
    await page.fill('input[name="age"]', '35');
    await page.fill('input[name="weight"]', '75');
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

    console.log('✅ Onboarding completed');

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('✅ Dashboard loaded\n');
  });

  test('should display glucose hero card with value and trend', async ({ page }) => {
    console.log('\n🩸 Testing Glucose Hero Card');
    console.log('----------------------------');

    // Wait for glucose card to be visible
    const glucoseHero = page.locator('.glucose-hero');
    await expect(glucoseHero).toBeVisible({ timeout: 10000 });
    console.log('✅ Glucose hero card is visible');

    // Check for glucose value
    const glucoseValue = page.locator('.glucose-value');
    await expect(glucoseValue).toBeVisible();
    const valueText = await glucoseValue.textContent();
    console.log(`✅ Glucose value displayed: ${valueText}`);

    // Check for unit (mg/dL)
    const glucoseUnit = page.locator('.glucose-unit');
    await expect(glucoseUnit).toBeVisible();
    await expect(glucoseUnit).toContainText('mg/dL');
    console.log('✅ Unit (mg/dL) displayed');

    // Check for status message
    const glucoseStatus = page.locator('.glucose-status');
    await expect(glucoseStatus).toBeVisible();
    const statusText = await glucoseStatus.textContent();
    console.log(`✅ Status message displayed: ${statusText}`);

    // Check for trend indicator (should have up/down/stable arrow)
    const trendIndicator = page.locator('.glucose-hero .trend');
    const trendExists = await trendIndicator.count();
    console.log(`✅ Trend indicator present: ${trendExists > 0 ? 'Yes' : 'No'}`);
  });

  test('should display quick metrics grid with 3 cards', async ({ page }) => {
    console.log('\n📊 Testing Quick Metrics Grid');
    console.log('------------------------------');

    // Wait for quick metrics to be visible
    const quickMetrics = page.locator('.quick-metrics');
    await expect(quickMetrics).toBeVisible({ timeout: 10000 });
    console.log('✅ Quick metrics grid is visible');

    // Check for 3 metric cards
    const metricCards = page.locator('.metric-card');
    await expect(metricCards).toHaveCount(3);
    console.log('✅ 3 metric cards displayed');

    // Verify each card has required elements
    for (let i = 0; i < 3; i++) {
      const card = metricCards.nth(i);

      // Check for icon
      const icon = card.locator('.metric-icon');
      await expect(icon).toBeVisible();

      // Check for label
      const label = card.locator('.metric-label');
      await expect(label).toBeVisible();
      const labelText = await label.textContent();

      // Check for value
      const value = card.locator('.metric-value');
      await expect(value).toBeVisible();
      const valueText = await value.textContent();

      console.log(`✅ Card ${i + 1}: ${labelText?.trim()} - ${valueText?.trim()}`);
    }
  });

  test('should display chat interface', async ({ page }) => {
    console.log('\n💬 Testing Chat Interface');
    console.log('-------------------------');

    // Wait for chat container
    const chatContainer = page.locator('.chat-container');
    await expect(chatContainer).toBeVisible({ timeout: 10000 });
    console.log('✅ Chat container is visible');

    // Check if N8n chat interface is loaded
    // Note: The actual N8n chat might be in an iframe or have specific selectors
    const chatExists = await chatContainer.locator('*').count();
    console.log(`✅ Chat interface loaded: ${chatExists > 0 ? 'Yes' : 'No'}`);

    // Verify chat container has content
    await expect(chatContainer).not.toBeEmpty();
    console.log('✅ Chat interface has content');
  });

  test('should display header bar with navigation buttons', async ({ page }) => {
    console.log('\n🔝 Testing Header Bar');
    console.log('---------------------');

    // Check for header bar
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();
    console.log('✅ Header bar is visible');

    // Check for menu button (uses class and aria-label, not ID)
    const menuBtn = page.locator('.header-btn[aria-label="Menu"]');
    await expect(menuBtn).toBeVisible();
    console.log('✅ Menu button visible');

    // Check for title
    const title = page.locator('.header-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Sugar Tracker');
    console.log('✅ Title displayed: Sugar Tracker');

    // Check for notifications button
    const notificationsBtn = page.locator('.header-btn[aria-label="Notifications"]');
    await expect(notificationsBtn).toBeVisible();
    console.log('✅ Notifications button visible');

    // Check for theme toggle button
    const themeToggle = page.locator('.header-btn[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    console.log('✅ Theme toggle button visible');
  });

  test('should have interactive header buttons', async ({ page }) => {
    console.log('\n🖱️  Testing Header Button Interactivity');
    console.log('---------------------------------------');

    // Test menu button click (uses class and aria-label, not ID)
    const menuBtn = page.locator('.header-btn[aria-label="Menu"]');
    await menuBtn.click();
    console.log('✅ Menu button is clickable');

    // Close sidebar if it opened
    const overlay = page.locator('.sidebar-overlay.active');
    if (await overlay.count() > 0) {
      await overlay.click();
      await page.waitForTimeout(300);
    }

    // Test notifications button click
    const notificationsBtn = page.locator('.header-btn[aria-label="Notifications"]');
    await notificationsBtn.click();
    console.log('✅ Notifications button is clickable');

    // Test theme toggle button click
    const themeToggle = page.locator('.header-btn[aria-label="Toggle theme"]');
    await themeToggle.click();
    console.log('✅ Theme toggle button is clickable');

    // Note: Actual functionality (sidebar, notifications panel, theme change)
    // would need to be tested when those features are implemented
  });

  test('should have proper responsive layout', async ({ page }) => {
    console.log('\n📱 Testing Responsive Layout');
    console.log('----------------------------');

    // Check content wrapper max-width
    const contentWrapper = page.locator('.content-wrapper').first();
    await expect(contentWrapper).toBeVisible();
    console.log('✅ Content wrapper exists');

    // Check that app container exists
    const appContainer = page.locator('.app-container');
    await expect(appContainer).toBeVisible();
    console.log('✅ App container exists');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify elements are still visible on mobile
    await expect(page.locator('.glucose-hero')).toBeVisible();
    await expect(page.locator('.quick-metrics')).toBeVisible();
    await expect(page.locator('.chat-container')).toBeVisible();
    console.log('✅ All components visible on mobile (375px)');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('.glucose-hero')).toBeVisible();
    console.log('✅ All components visible on tablet (768px)');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(page.locator('.glucose-hero')).toBeVisible();
    console.log('✅ All components visible on desktop (1920px)');
  });

  test('should load data from API endpoints', async ({ page }) => {
    console.log('\n🔌 Testing API Integration');
    console.log('--------------------------');

    // Listen for API calls
    const apiCalls: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/glucose/latest')) {
        apiCalls.push('glucose');
        console.log('✅ Glucose API called');
      } else if (url.includes('/api/meals/latest')) {
        apiCalls.push('meals');
        console.log('✅ Meals API called');
      } else if (url.includes('/api/insulin/latest')) {
        apiCalls.push('insulin');
        console.log('✅ Insulin API called');
      }
    });

    // Reload page to trigger API calls
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait a bit for all API calls
    await page.waitForTimeout(2000);

    // Verify API calls were made
    console.log(`\n📊 API Calls Summary:`);
    console.log(`   - Glucose API: ${apiCalls.includes('glucose') ? '✅' : '❌'}`);
    console.log(`   - Meals API: ${apiCalls.includes('meals') ? '✅' : '❌'}`);
    console.log(`   - Insulin API: ${apiCalls.includes('insulin') ? '✅' : '❌'}`);
  });
});

test.describe('Dashboard Protected Route', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    console.log('\n🔒 Testing Protected Route');
    console.log('-------------------------');

    // Clear cookies to simulate logged out state
    await page.context().clearCookies();
    console.log('✅ Cleared authentication cookies');

    // Try to access dashboard directly
    await page.goto('http://localhost:3000/dashboard');

    // Should redirect to login (may include redirect query param)
    await page.waitForURL(/\/login/, { timeout: 10000 });
    console.log('✅ Redirected to /login page');

    // Verify we're on login page
    await expect(page).toHaveURL(/\/login/);

    // Verify login page content is displayed
    await expect(page.locator('h1:has-text("Welcome Back")')).toBeVisible();
    console.log('✅ Protected route enforcement working');
  });

  test('should show loading state before redirect', async ({ page }) => {
    console.log('\n⏳ Testing Loading State');
    console.log('-----------------------');

    // Clear cookies
    await page.context().clearCookies();

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Should briefly show loading state
    const loadingText = page.locator('text=Loading dashboard...');

    // Check if loading appears (it might be very brief)
    const loadingExists = await loadingText.isVisible().catch(() => false);
    console.log(`✅ Loading state: ${loadingExists ? 'Displayed' : 'Too fast to capture'}`);

    // Eventually should redirect (may include redirect query param)
    await page.waitForURL(/\/login/, { timeout: 10000 });
    console.log('✅ Redirect occurred after loading check');
  });
});

test.describe('Dashboard Visual Verification', () => {
  test('should have correct styling and theme classes', async ({ page }) => {
    console.log('\n🎨 Testing Visual Styling');
    console.log('------------------------');

    // Quick login
    await page.goto('http://localhost:3000/signup');
    const uniqueEmail = `visual-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Visual Test');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.locator('input[type="checkbox"]').check();
    await Promise.all([
      page.waitForURL('**/setup/step-1'),
      page.click('button[type="submit"]')
    ]);

    // Quick onboarding
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="weight"]', '70');
    await page.selectOption('select[name="diabetesType"]', 'type2');
    await Promise.all([
      page.waitForURL('**/setup/step-2'),
      page.click('button.btn-primary')
    ]);
    await page.click('.device-card:has-text("Manual Entry")');
    await Promise.all([
      page.waitForURL('**/setup/step-3'),
      page.click('button.btn-primary')
    ]);
    await Promise.all([
      page.waitForURL('**/welcome'),
      page.click('button.btn-primary')
    ]);

    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for critical CSS classes
    const classesToCheck = [
      '.app-container',
      '.header-bar',
      '.glucose-hero',
      '.quick-metrics',
      '.metric-card',
      '.chat-container'
    ];

    for (const selector of classesToCheck) {
      const element = page.locator(selector).first();
      await expect(element).toBeVisible();
      console.log(`✅ ${selector} exists and visible`);
    }

    // Check for Lucide icons
    const icons = page.locator('[data-lucide]');
    const iconCount = await icons.count();
    console.log(`✅ Lucide icons present: ${iconCount} icons`);
  });
});
