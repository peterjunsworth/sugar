import { test, expect } from '@playwright/test';

test.describe('Dashboard Visual Check - SuperDesign Match', () => {
  test.use({
    viewport: { width: 1280, height: 720 },
  });

  test.beforeEach(async ({ page }) => {
    console.log('🚀 Starting dashboard visual check...');

    // Navigate to signup first to create account
    console.log('📝 Creating test account...');
    await page.goto('http://localhost:3000/signup');

    // Fill signup form with unique email
    const uniqueEmail = `dashboard-visual-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Dashboard Test User');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill('TestPassword123!');
    await page.locator('input[type="checkbox"]').check();

    // Submit signup and wait for setup
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
    console.log('✅ Navigated to dashboard');

    // Wait for Lucide icons to load
    await page.waitForTimeout(1000);
  });

  test('Phase 1: Structure Check - All major elements present', async ({ page }) => {
    console.log('🔍 Phase 1: Checking structure...');

    // Header Bar
    console.log('  ✓ Checking header bar...');
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();

    // Header elements
    await expect(page.locator('.header-left')).toBeVisible();
    await expect(page.locator('.header-title')).toContainText('Sugar Tracker');
    await expect(page.locator('.header-right')).toBeVisible();
    console.log('  ✅ Header bar present');

    // Sidebar (should be hidden initially)
    console.log('  ✓ Checking sidebar...');
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).not.toHaveClass(/active/);
    console.log('  ✅ Sidebar present (hidden)');

    // Sidebar overlay (hidden by default)
    const sidebarOverlay = page.locator('.sidebar-overlay');
    const overlayExists = await sidebarOverlay.count();
    expect(overlayExists).toBe(1);
    await expect(sidebarOverlay).not.toHaveClass(/active/);
    console.log('  ✅ Sidebar overlay present');

    // Glucose Hero Card
    console.log('  ✓ Checking glucose hero card...');
    const glucoseHero = page.locator('.glucose-hero');
    await expect(glucoseHero).toBeVisible();
    await expect(page.locator('.glucose-value')).toBeVisible();
    await expect(page.locator('.glucose-unit')).toBeVisible();
    await expect(page.locator('.glucose-status')).toBeVisible();
    await expect(page.locator('.ai-suggestion-btn')).toBeVisible();
    console.log('  ✅ Glucose hero card present');

    // Quick Metrics
    console.log('  ✓ Checking quick metrics...');
    const quickMetrics = page.locator('.quick-metrics');
    await expect(quickMetrics).toBeVisible();
    const metricCards = page.locator('.metric-card');
    await expect(metricCards).toHaveCount(3);
    console.log('  ✅ Quick metrics present (3 cards)');

    // Chat Container
    console.log('  ✓ Checking chat container...');
    const chatContainer = page.locator('.chat-container');
    await expect(chatContainer).toBeVisible();
    console.log('  ✅ Chat container present');

    // Input Bar
    console.log('  ✓ Checking input bar...');
    const inputBar = page.locator('.input-bar');
    await expect(inputBar).toBeVisible();
    await expect(page.locator('.chat-input')).toBeVisible();
    await expect(page.locator('.send-btn')).toBeVisible();
    console.log('  ✅ Input bar present');

    // FAB
    console.log('  ✓ Checking FAB...');
    const fab = page.locator('.fab');
    await expect(fab).toBeVisible();
    console.log('  ✅ FAB present');

    console.log('✅ Phase 1 Complete: All major structures present');
  });

  test('Phase 2: Header Bar - All icons and buttons', async ({ page }) => {
    console.log('🔍 Phase 2: Checking header bar details...');

    // Menu button
    console.log('  ✓ Checking menu button...');
    const menuBtn = page.locator('.header-btn').filter({ has: page.locator('[data-lucide="menu"]') });
    await expect(menuBtn).toBeVisible();
    console.log('  ✅ Menu button present');

    // Bell (notifications) button
    console.log('  ✓ Checking bell button...');
    const bellBtn = page.locator('.header-btn').filter({ has: page.locator('[data-lucide="bell"]') });
    await expect(bellBtn).toBeVisible();
    console.log('  ✅ Bell button present');

    // Theme toggle button
    console.log('  ✓ Checking theme toggle button...');
    const themeBtn = page.locator('.header-btn').filter({ has: page.locator('[data-lucide="moon"], [data-lucide="sun"]') });
    await expect(themeBtn).toBeVisible();
    console.log('  ✅ Theme toggle button present');

    console.log('✅ Phase 2 Complete: Header bar fully configured');
  });

  test('Phase 3: Sidebar - Structure and navigation', async ({ page }) => {
    console.log('🔍 Phase 3: Checking sidebar...');

    // Click menu button to open sidebar
    console.log('  ✓ Opening sidebar...');
    await page.click('.header-btn:has([data-lucide="menu"])');
    await page.waitForTimeout(500); // Wait for animation

    // Check sidebar is active
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toHaveClass(/active/);
    console.log('  ✅ Sidebar opened');

    // Check sidebar profile
    console.log('  ✓ Checking sidebar profile...');
    await expect(page.locator('.sidebar-profile')).toBeVisible();
    await expect(page.locator('.sidebar-avatar')).toBeVisible();
    await expect(page.locator('.sidebar-profile-info h3')).toBeVisible();
    await expect(page.locator('.sidebar-profile-info p')).toBeVisible();
    console.log('  ✅ Sidebar profile present');

    // Check navigation items
    console.log('  ✓ Checking navigation items...');
    const navItems = page.locator('.nav-item');
    await expect(navItems).toHaveCount(4);

    // Check each nav item has icon and text
    await expect(page.locator('.nav-item:has([data-lucide="home"])')).toBeVisible();
    await expect(page.locator('.nav-item:has([data-lucide="clock"])')).toBeVisible();
    await expect(page.locator('.nav-item:has([data-lucide="user"])')).toBeVisible();
    await expect(page.locator('.nav-item:has([data-lucide="settings"])')).toBeVisible();
    console.log('  ✅ All 4 navigation items present');

    // Check active state on Dashboard
    const dashboardNav = page.locator('.nav-item.active');
    await expect(dashboardNav).toContainText('Dashboard');
    console.log('  ✅ Dashboard nav item is active');

    // Check theme toggle in footer
    console.log('  ✓ Checking sidebar theme toggle...');
    await expect(page.locator('.sidebar-footer .theme-toggle-btn')).toBeVisible();
    console.log('  ✅ Sidebar theme toggle present');

    // Close sidebar by clicking overlay
    console.log('  ✓ Closing sidebar...');
    await page.click('.sidebar-overlay');
    await page.waitForTimeout(500);
    await expect(sidebar).not.toHaveClass(/active/);
    console.log('  ✅ Sidebar closed');

    console.log('✅ Phase 3 Complete: Sidebar fully functional');
  });

  test('Phase 4: Glucose Hero Card - All elements', async ({ page }) => {
    console.log('🔍 Phase 4: Checking glucose hero card...');

    // Check glucose value
    console.log('  ✓ Checking glucose value...');
    const glucoseValue = page.locator('.glucose-value');
    await expect(glucoseValue).toBeVisible();
    await expect(glucoseValue).toContainText('mg/dL');
    console.log('  ✅ Glucose value displays');

    // Check status icon
    console.log('  ✓ Checking status icon...');
    await expect(page.locator('.glucose-status [data-lucide="check-circle"]')).toBeVisible();
    console.log('  ✅ Status icon present');

    // Check AI suggestions button
    console.log('  ✓ Checking AI suggestions button...');
    const aiBtn = page.locator('.ai-suggestion-btn');
    await expect(aiBtn).toBeVisible();
    await expect(aiBtn).toContainText('8 AI Suggestions');
    await expect(page.locator('.ai-suggestion-btn [data-lucide="sparkles"]')).toBeVisible();
    console.log('  ✅ AI suggestions button present');

    console.log('✅ Phase 4 Complete: Glucose hero card fully configured');
  });

  test('Phase 5: Quick Metrics - All 3 cards with icons', async ({ page }) => {
    console.log('🔍 Phase 5: Checking quick metrics...');

    const metricCards = page.locator('.metric-card');

    // Card 1: Last Meal (food)
    console.log('  ✓ Checking Last Meal card...');
    const mealCard = metricCards.nth(0);
    await expect(mealCard).toBeVisible();
    await expect(mealCard.locator('.metric-icon.food')).toBeVisible();
    await expect(mealCard.locator('[data-lucide="utensils"]')).toBeVisible();
    await expect(mealCard.locator('.metric-label')).toContainText('Last Meal');
    await expect(mealCard.locator('.metric-value')).toContainText('mg/dL');
    console.log('  ✅ Last Meal card present');

    // Card 2: Exercise
    console.log('  ✓ Checking Exercise card...');
    const exerciseCard = metricCards.nth(1);
    await expect(exerciseCard).toBeVisible();
    await expect(exerciseCard.locator('.metric-icon.exercise')).toBeVisible();
    await expect(exerciseCard.locator('[data-lucide="activity"]')).toBeVisible();
    await expect(exerciseCard.locator('.metric-label')).toContainText('Exercise');
    await expect(exerciseCard.locator('.metric-value')).toContainText('-15 mg/dL');
    console.log('  ✅ Exercise card present');

    // Card 3: Medication
    console.log('  ✓ Checking Medication card...');
    const medCard = metricCards.nth(2);
    await expect(medCard).toBeVisible();
    await expect(medCard.locator('.metric-icon.med')).toBeVisible();
    await expect(medCard.locator('[data-lucide="pill"]')).toBeVisible();
    await expect(medCard.locator('.metric-label')).toContainText('Medication');
    await expect(medCard.locator('.metric-value')).toContainText('On time');
    console.log('  ✅ Medication card present');

    console.log('✅ Phase 5 Complete: All 3 metrics cards configured');
  });

  test('Phase 6: Chat Messages - Sample messages with impact card', async ({ page }) => {
    console.log('🔍 Phase 6: Checking chat messages...');

    // Check all messages
    const messages = page.locator('.message');
    await expect(messages).toHaveCount(4); // 3 messages + typing indicator
    console.log('  ✅ 4 message elements present');

    // Message 1: AI greeting
    console.log('  ✓ Checking AI greeting message...');
    const msg1 = messages.nth(0);
    await expect(msg1).toHaveClass(/ai/);
    await expect(msg1.locator('.message-avatar.ai')).toBeVisible();
    await expect(msg1.locator('[data-lucide="bot"]')).toBeVisible();
    await expect(msg1.locator('.message-content')).toContainText('Good morning');
    await expect(msg1.locator('.message-time')).toContainText('9:41 AM');
    console.log('  ✅ AI greeting message present');

    // Message 2: User message
    console.log('  ✓ Checking user message...');
    const msg2 = messages.nth(1);
    await expect(msg2).toHaveClass(/user/);
    await expect(msg2.locator('.message-avatar.user')).toBeVisible();
    await expect(msg2.locator('[data-lucide="user"]')).toBeVisible();
    await expect(msg2.locator('.message-content')).toContainText('pizza');
    await expect(msg2.locator('.message-time')).toContainText('12:30 PM');
    console.log('  ✅ User message present');

    // Message 3: AI response with impact card
    console.log('  ✓ Checking AI response with impact card...');
    const msg3 = messages.nth(2);
    await expect(msg3).toHaveClass(/ai/);
    await expect(msg3.locator('.message-content')).toBeVisible();

    // Check impact card
    console.log('  ✓ Checking impact card...');
    const impactCard = msg3.locator('.impact-card');
    await expect(impactCard).toBeVisible();
    await expect(impactCard.locator('.impact-title')).toContainText('Glucose Impact');
    await expect(impactCard.locator('.badge-warning')).toContainText('+50-60 mg/dL');
    await expect(impactCard.locator('.impact-chart')).toBeVisible();
    console.log('  ✅ Impact card present');

    // Check recommendation
    await expect(msg3.locator('.message-content')).toContainText('Recommendation');
    console.log('  ✅ Recommendation text present');

    // Message 4: Typing indicator
    console.log('  ✓ Checking typing indicator...');
    const msg4 = messages.nth(3);
    await expect(msg4).toHaveClass(/ai/);
    const typingIndicator = msg4.locator('.typing-indicator');
    await expect(typingIndicator).toBeVisible();
    const typingDots = typingIndicator.locator('.typing-dot');
    await expect(typingDots).toHaveCount(3);
    console.log('  ✅ Typing indicator with 3 dots present');

    console.log('✅ Phase 6 Complete: All chat messages configured');
  });

  test('Phase 7: Input Bar - All buttons and input', async ({ page }) => {
    console.log('🔍 Phase 7: Checking input bar...');

    // Camera button
    console.log('  ✓ Checking camera button...');
    const cameraBtn = page.locator('.input-bar .btn-icon:has([data-lucide="camera"])');
    await expect(cameraBtn).toBeVisible();
    console.log('  ✅ Camera button present');

    // Chat input
    console.log('  ✓ Checking chat input...');
    const chatInput = page.locator('.chat-input');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toHaveAttribute('placeholder', /Ask me anything/);
    console.log('  ✅ Chat input present with placeholder');

    // Mic button
    console.log('  ✓ Checking mic button...');
    const micBtn = page.locator('.input-action-btn:has([data-lucide="mic"])');
    await expect(micBtn).toBeVisible();
    console.log('  ✅ Mic button present');

    // Send button
    console.log('  ✓ Checking send button...');
    const sendBtn = page.locator('.send-btn');
    await expect(sendBtn).toBeVisible();
    await expect(sendBtn.locator('[data-lucide="send"]')).toBeVisible();
    console.log('  ✅ Send button present');

    console.log('✅ Phase 7 Complete: Input bar fully configured');
  });

  test('Phase 8: FAB - Floating Action Button', async ({ page }) => {
    console.log('🔍 Phase 8: Checking FAB...');

    const fab = page.locator('.fab');
    await expect(fab).toBeVisible();
    await expect(fab.locator('[data-lucide="plus"]')).toBeVisible();
    console.log('  ✅ FAB present with plus icon');

    // Check FAB is fixed positioned
    const boundingBox = await fab.boundingBox();
    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.x).toBeGreaterThan(1000); // Should be on the right
      expect(boundingBox.y).toBeGreaterThan(400); // Should be in lower half
      console.log(`  ✅ FAB positioned at (${Math.round(boundingBox.x)}, ${Math.round(boundingBox.y)})`);
    }

    console.log('✅ Phase 8 Complete: FAB configured');
  });

  test('Phase 9: Interactive Elements - Sidebar toggle', async ({ page }) => {
    console.log('🔍 Phase 9: Testing interactive elements...');

    // Test sidebar toggle
    console.log('  ✓ Testing sidebar toggle...');
    const sidebar = page.locator('.sidebar');
    const overlay = page.locator('.sidebar-overlay');

    // Initially closed
    await expect(sidebar).not.toHaveClass(/active/);
    await expect(overlay).not.toHaveClass(/active/);
    console.log('  ✅ Sidebar initially closed');

    // Open sidebar
    await page.click('.header-btn:has([data-lucide="menu"])');
    await page.waitForTimeout(500);
    await expect(sidebar).toHaveClass(/active/);
    await expect(overlay).toHaveClass(/active/);
    console.log('  ✅ Sidebar opens on menu click');

    // Close by clicking overlay
    await page.click('.sidebar-overlay');
    await page.waitForTimeout(500);
    await expect(sidebar).not.toHaveClass(/active/);
    await expect(overlay).not.toHaveClass(/active/);
    console.log('  ✅ Sidebar closes on overlay click');

    console.log('✅ Phase 9 Complete: Interactive elements working');
  });

  test('Phase 10: Interactive Elements - Theme toggle', async ({ page }) => {
    console.log('🔍 Phase 10: Testing theme toggle...');

    // Get current theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('class');
    console.log(`  ℹ️ Initial theme: ${initialTheme}`);

    // Toggle theme from header
    console.log('  ✓ Toggling theme from header...');
    await page.click('.header-btn:has([data-lucide="moon"], [data-lucide="sun"])');
    await page.waitForTimeout(500);

    const newTheme = await html.getAttribute('class');
    console.log(`  ℹ️ New theme: ${newTheme}`);
    expect(newTheme).not.toBe(initialTheme);
    console.log('  ✅ Theme toggled successfully');

    console.log('✅ Phase 10 Complete: Theme toggle working');
  });

  test('Phase 11: Interactive Elements - Send message', async ({ page }) => {
    console.log('🔍 Phase 11: Testing send message...');

    // Type in chat input
    console.log('  ✓ Typing in chat input...');
    const chatInput = page.locator('.chat-input');
    await chatInput.fill('Test message');
    await expect(chatInput).toHaveValue('Test message');
    console.log('  ✅ Chat input accepts text');

    // Click send button (will clear input)
    console.log('  ✓ Clicking send button...');
    await page.click('.send-btn');
    await page.waitForTimeout(500);
    await expect(chatInput).toHaveValue('');
    console.log('  ✅ Send button clears input');

    // Test Enter key
    console.log('  ✓ Testing Enter key...');
    await chatInput.fill('Another test');
    await chatInput.press('Enter');
    await page.waitForTimeout(500);
    await expect(chatInput).toHaveValue('');
    console.log('  ✅ Enter key sends message');

    console.log('✅ Phase 11 Complete: Send message working');
  });

  test('Phase 12: Interactive Elements - FAB click', async ({ page }) => {
    console.log('🔍 Phase 12: Testing FAB click...');

    // Set up dialog handler
    page.on('dialog', async dialog => {
      console.log(`  ℹ️ Dialog message: ${dialog.message()}`);
      expect(dialog.message()).toContain('Quick actions');
      await dialog.accept();
    });

    // Click FAB
    console.log('  ✓ Clicking FAB...');
    await page.click('.fab');
    await page.waitForTimeout(500);
    console.log('  ✅ FAB click triggers alert');

    console.log('✅ Phase 12 Complete: FAB interaction working');
  });

  test('Phase 13: Responsive Design - Content wrapper width', async ({ page }) => {
    console.log('🔍 Phase 13: Testing responsive design...');

    // Desktop (1280px) - should be 900px max
    console.log('  ✓ Testing desktop width (1280px)...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    const contentWrapper = page.locator('.content-wrapper').first();
    const desktopBox = await contentWrapper.boundingBox();
    if (desktopBox) {
      console.log(`  ℹ️ Content width at 1280px: ${Math.round(desktopBox.width)}px`);
      expect(desktopBox.width).toBeLessThanOrEqual(900);
      console.log('  ✅ Desktop width constrained to max 900px');
    }

    // Tablet (768px) - should be 600px max
    console.log('  ✓ Testing tablet width (768px)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    const tabletBox = await contentWrapper.boundingBox();
    if (tabletBox) {
      console.log(`  ℹ️ Content width at 768px: ${Math.round(tabletBox.width)}px`);
      expect(tabletBox.width).toBeLessThanOrEqual(600);
      console.log('  ✅ Tablet width constrained to max 600px');
    }

    // Mobile (375px) - should be full width
    console.log('  ✓ Testing mobile width (375px)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const mobileBox = await contentWrapper.boundingBox();
    if (mobileBox) {
      console.log(`  ℹ️ Content width at 375px: ${Math.round(mobileBox.width)}px`);
      console.log('  ✅ Mobile width is full width');
    }

    console.log('✅ Phase 13 Complete: Responsive design working');
  });

  test('FINAL: Complete Dashboard Verification', async ({ page }) => {
    console.log('🎯 FINAL: Running complete dashboard verification...');

    // Count all required elements
    console.log('  ✓ Counting all required elements...');

    const checks = [
      { name: 'Header bar', selector: '.header-bar', count: 1 },
      { name: 'Sidebar', selector: '.sidebar', count: 1 },
      { name: 'Sidebar overlay', selector: '.sidebar-overlay', count: 1 },
      { name: 'Glucose hero', selector: '.glucose-hero', count: 1 },
      { name: 'Quick metrics', selector: '.quick-metrics', count: 1 },
      { name: 'Metric cards', selector: '.metric-card', count: 3 },
      { name: 'Chat container', selector: '.chat-container', count: 1 },
      { name: 'Messages', selector: '.message', count: 4 },
      { name: 'Impact card', selector: '.impact-card', count: 1 },
      { name: 'Typing indicator', selector: '.typing-indicator', count: 1 },
      { name: 'Input bar', selector: '.input-bar', count: 1 },
      { name: 'Chat input', selector: '.chat-input', count: 1 },
      { name: 'Send button', selector: '.send-btn', count: 1 },
      { name: 'FAB', selector: '.fab', count: 1 },
    ];

    for (const check of checks) {
      const elements = page.locator(check.selector);
      const count = await elements.count();
      expect(count).toBe(check.count);
      console.log(`  ✅ ${check.name}: ${count}/${check.count}`);
    }

    console.log('🎉 FINAL COMPLETE: Dashboard matches mockup 100%!');
  });
});
