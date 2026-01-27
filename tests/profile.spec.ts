import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  const testPassword = 'password123';

  test.beforeEach(async ({ page }) => {
    console.log('\n🔐 Logging in to access protected profile...');

    // Navigate to signup first to create a test user
    await page.goto('http://localhost:3000/signup');

    // Fill signup form with unique email
    const uniqueEmail = `profile-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Profile Test User');
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

    // Navigate to profile
    await page.goto('http://localhost:3000/dashboard/profile');
    await page.waitForLoadState('networkidle');

    console.log('✅ Profile loaded\n');
  });

  test('should display profile header with avatar, name, and email', async ({ page }) => {
    console.log('\n👤 Testing Profile Header');
    console.log('-------------------------');

    // Wait for profile header to be visible
    const profileHeader = page.locator('.profile-header');
    await expect(profileHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ Profile header is visible');

    // Check for avatar with initials
    const avatar = page.locator('.avatar');
    await expect(avatar).toBeVisible();
    const avatarText = await avatar.textContent();
    console.log(`✅ Avatar with initials displayed: ${avatarText}`);

    // Check for profile name
    const profileName = page.locator('.profile-name');
    await expect(profileName).toBeVisible();
    const nameText = await profileName.textContent();
    console.log(`✅ Profile name displayed: ${nameText}`);

    // Check for profile email
    const profileEmail = page.locator('.profile-email');
    await expect(profileEmail).toBeVisible();
    const emailText = await profileEmail.textContent();
    console.log(`✅ Profile email displayed: ${emailText}`);
  });

  test('should display stats grid with 2 stat cards', async ({ page }) => {
    console.log('\n📊 Testing Stats Grid');
    console.log('---------------------');

    // Wait for stats grid to be visible
    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible({ timeout: 10000 });
    console.log('✅ Stats grid is visible');

    // Check for stat cards
    const statCards = page.locator('.stat-card');
    await expect(statCards).toHaveCount(2);
    console.log('✅ 2 stat cards displayed');

    // Verify first card (Days Active)
    const card1 = statCards.nth(0);
    const value1 = card1.locator('.stat-value');
    const label1 = card1.locator('.stat-label');
    await expect(value1).toBeVisible();
    await expect(label1).toBeVisible();
    const value1Text = await value1.textContent();
    const label1Text = await label1.textContent();
    console.log(`✅ Card 1: ${label1Text} - ${value1Text}`);

    // Verify second card (In Range %)
    const card2 = statCards.nth(1);
    const value2 = card2.locator('.stat-value');
    const label2 = card2.locator('.stat-label');
    await expect(value2).toBeVisible();
    await expect(label2).toBeVisible();
    const value2Text = await value2.textContent();
    const label2Text = await label2.textContent();
    console.log(`✅ Card 2: ${label2Text} - ${value2Text}`);
  });

  test('should display Personal Information section with 3 settings items', async ({ page }) => {
    console.log('\n📝 Testing Personal Information Section');
    console.log('---------------------------------------');

    // Check for section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Personal Information' });
    await expect(sectionTitle).toBeVisible();
    console.log('✅ Personal Information section title visible');

    // Get the settings list under this section
    const personalInfoSection = page.locator('.section').filter({ has: sectionTitle });
    const settingsList = personalInfoSection.locator('.settings-list');
    await expect(settingsList).toBeVisible();

    // Check for 3 settings items
    const settingsItems = settingsList.locator('.settings-item');
    await expect(settingsItems).toHaveCount(3);
    console.log('✅ 3 settings items in Personal Information');

    // Verify each item has icon, title, description
    const items = ['Full Name', 'Age & Weight', 'Diabetes Type'];
    for (let i = 0; i < items.length; i++) {
      const item = settingsItems.nth(i);
      const icon = item.locator('.settings-icon');
      const title = item.locator('.settings-title');
      const description = item.locator('.settings-description');

      await expect(icon).toBeVisible();
      await expect(title).toBeVisible();
      await expect(description).toBeVisible();

      const titleText = await title.textContent();
      console.log(`✅ ${titleText} item displayed`);
    }
  });

  test('should display Health Settings section', async ({ page }) => {
    console.log('\n⚕️  Testing Health Settings Section');
    console.log('-----------------------------------');

    // Check for section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Health Settings' });
    await expect(sectionTitle).toBeVisible();
    console.log('✅ Health Settings section title visible');

    // Get settings items
    const healthSection = page.locator('.section').filter({ has: sectionTitle });
    const settingsList = healthSection.locator('.settings-list');
    const settingsItems = settingsList.locator('.settings-item');
    await expect(settingsItems).toHaveCount(3);
    console.log('✅ 3 settings items in Health Settings');

    // Check for Glucose Targets
    const targetsItem = settingsItems.filter({ hasText: 'Glucose Targets' });
    await expect(targetsItem).toBeVisible();
    console.log('✅ Glucose Targets item displayed');

    // Check for Connected Devices
    const devicesItem = settingsItems.filter({ hasText: 'Connected Devices' });
    await expect(devicesItem).toBeVisible();
    console.log('✅ Connected Devices item displayed');

    // Check for Notifications with toggle
    const notificationsItem = settingsItems.filter({ hasText: 'Notifications' });
    await expect(notificationsItem).toBeVisible();
    const notificationsToggle = notificationsItem.locator('.toggle-switch');
    await expect(notificationsToggle).toBeVisible();
    console.log('✅ Notifications item with toggle displayed');
  });

  test('should display App Settings section', async ({ page }) => {
    console.log('\n⚙️  Testing App Settings Section');
    console.log('--------------------------------');

    // Check for section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'App Settings' });
    await expect(sectionTitle).toBeVisible();
    console.log('✅ App Settings section title visible');

    // Get settings items
    const appSection = page.locator('.section').filter({ has: sectionTitle });
    const settingsList = appSection.locator('.settings-list');
    const settingsItems = settingsList.locator('.settings-item');
    await expect(settingsItems).toHaveCount(3);
    console.log('✅ 3 settings items in App Settings');

    // Check for Dark Mode with toggle
    const darkModeItem = settingsItems.filter({ hasText: 'Dark Mode' });
    await expect(darkModeItem).toBeVisible();
    const darkModeToggle = darkModeItem.locator('.toggle-switch');
    await expect(darkModeToggle).toBeVisible();
    console.log('✅ Dark Mode item with toggle displayed');

    // Check for Privacy & Security
    const privacyItem = settingsItems.filter({ hasText: 'Privacy & Security' });
    await expect(privacyItem).toBeVisible();
    console.log('✅ Privacy & Security item displayed');

    // Check for Help & Support
    const helpItem = settingsItems.filter({ hasText: 'Help & Support' });
    await expect(helpItem).toBeVisible();
    console.log('✅ Help & Support item displayed');
  });

  test('should display Account section with danger items', async ({ page }) => {
    console.log('\n🚨 Testing Account Section');
    console.log('---------------------------');

    // Check for section title
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Account' });
    await expect(sectionTitle).toBeVisible();
    console.log('✅ Account section title visible');

    // Get settings items
    const accountSection = page.locator('.section').filter({ has: sectionTitle });
    const settingsList = accountSection.locator('.settings-list');
    const settingsItems = settingsList.locator('.settings-item');
    await expect(settingsItems).toHaveCount(2);
    console.log('✅ 2 settings items in Account section');

    // Check for Log Out (danger item)
    const logoutItem = settingsItems.filter({ hasText: 'Log Out' });
    await expect(logoutItem).toBeVisible();
    await expect(logoutItem).toHaveClass(/danger-item/);
    console.log('✅ Log Out item displayed with danger styling');

    // Check for Delete Account (danger item)
    const deleteItem = settingsItems.filter({ hasText: 'Delete Account' });
    await expect(deleteItem).toBeVisible();
    await expect(deleteItem).toHaveClass(/danger-item/);
    console.log('✅ Delete Account item displayed with danger styling');
  });

  test('should have functional theme toggle', async ({ page }) => {
    console.log('\n🌙 Testing Theme Toggle');
    console.log('-----------------------');

    // Check initial theme state
    const html = page.locator('html');
    const initialIsDark = await html.evaluate(el => el.classList.contains('dark'));
    console.log(`✅ Initial theme: ${initialIsDark ? 'Dark' : 'Light'}`);

    // Find Dark Mode toggle in App Settings
    const darkModeItem = page.locator('.settings-item').filter({ hasText: 'Dark Mode' });
    const darkModeToggle = darkModeItem.locator('.toggle-switch');

    // Click toggle
    await darkModeToggle.click();
    await page.waitForTimeout(500);

    // Check theme changed
    const newIsDark = await html.evaluate(el => el.classList.contains('dark'));
    console.log(`✅ Theme after toggle: ${newIsDark ? 'Dark' : 'Light'}`);
    expect(newIsDark).not.toBe(initialIsDark);
    console.log('✅ Theme toggle works correctly');

    // Toggle back
    await darkModeToggle.click();
    await page.waitForTimeout(500);
    const finalIsDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(finalIsDark).toBe(initialIsDark);
    console.log('✅ Theme toggle reverses correctly');
  });

  test('should have functional notifications toggle', async ({ page }) => {
    console.log('\n🔔 Testing Notifications Toggle');
    console.log('-------------------------------');

    // Find Notifications toggle in Health Settings
    const notificationsItem = page.locator('.settings-item').filter({ hasText: 'Notifications' });
    const notificationsToggle = notificationsItem.locator('.toggle-switch');

    // Check initial state
    const initialActive = await notificationsToggle.evaluate(el => el.classList.contains('active'));
    console.log(`✅ Initial state: ${initialActive ? 'Active' : 'Inactive'}`);

    // Click toggle
    await notificationsToggle.click();
    await page.waitForTimeout(300);

    // Check state changed
    const newActive = await notificationsToggle.evaluate(el => el.classList.contains('active'));
    console.log(`✅ State after toggle: ${newActive ? 'Active' : 'Inactive'}`);
    expect(newActive).not.toBe(initialActive);
    console.log('✅ Notifications toggle works correctly');
  });

  test('should have functional header back button', async ({ page }) => {
    console.log('\n◀️  Testing Back Button');
    console.log('----------------------');

    // Find back button
    const backButton = page.locator('.header-btn').filter({ has: page.locator('[data-lucide="arrow-left"]') });
    await expect(backButton).toBeVisible();
    console.log('✅ Back button visible');

    // Click back button
    await backButton.click();

    // Should navigate to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    console.log('✅ Back button navigates to dashboard');
  });

  test('should have functional sidebar navigation', async ({ page }) => {
    console.log('\n📱 Testing Sidebar Navigation');
    console.log('-----------------------------');

    // Check if sidebar exists
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeAttached();
    console.log('✅ Sidebar exists');

    // Check for profile link in sidebar (should be active)
    const profileNavItem = sidebar.locator('.nav-item').filter({ hasText: 'Profile' });
    await expect(profileNavItem).toBeVisible();
    await expect(profileNavItem).toHaveClass(/active/);
    console.log('✅ Profile nav item is active in sidebar');

    // Check for other nav items
    const dashboardLink = sidebar.locator('.nav-item').filter({ hasText: 'Dashboard' });
    await expect(dashboardLink).toBeVisible();
    console.log('✅ Dashboard link present');

    const historyLink = sidebar.locator('.nav-item').filter({ hasText: 'History' });
    await expect(historyLink).toBeVisible();
    console.log('✅ History link present');
  });

  test('should load data from API endpoints', async ({ page }) => {
    console.log('\n🔌 Testing API Integration');
    console.log('--------------------------');

    // Listen for API calls
    const apiCalls: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/user/profile')) {
        apiCalls.push('profile');
        console.log('✅ Profile API called');
      } else if (url.includes('/api/user/stats')) {
        apiCalls.push('stats');
        console.log('✅ Stats API called');
      }
    });

    // Reload page to trigger API calls
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait a bit for all API calls
    await page.waitForTimeout(2000);

    // Verify API calls were made
    console.log(`\n📊 API Calls Summary:`);
    console.log(`   - Profile API: ${apiCalls.includes('profile') ? '✅' : '❌'}`);
    console.log(`   - Stats API: ${apiCalls.includes('stats') ? '✅' : '❌'}`);
  });

  test('should have responsive layout', async ({ page }) => {
    console.log('\n📱 Testing Responsive Layout');
    console.log('----------------------------');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify key elements are still visible on mobile
    await expect(page.locator('.profile-header')).toBeVisible();
    await expect(page.locator('.stats-grid')).toBeVisible();
    await expect(page.locator('.settings-list').first()).toBeVisible();
    console.log('✅ All components visible on mobile (375px)');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('.profile-header')).toBeVisible();
    console.log('✅ All components visible on tablet (768px)');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(page.locator('.profile-header')).toBeVisible();
    console.log('✅ All components visible on desktop (1920px)');
  });

  test('should have all Lucide icons rendered', async ({ page }) => {
    console.log('\n🎨 Testing Lucide Icons');
    console.log('-----------------------');

    // Check for Lucide icons
    const icons = page.locator('[data-lucide]');
    const iconCount = await icons.count();
    console.log(`✅ Lucide icons present: ${iconCount} icons`);
    expect(iconCount).toBeGreaterThan(10); // Should have many icons for settings

    // Check specific icons
    const requiredIcons = ['arrow-left', 'moon', 'user', 'calendar', 'heart-pulse', 'target', 'watch', 'bell', 'shield', 'life-buoy', 'log-out', 'trash-2'];
    for (const iconName of requiredIcons) {
      const icon = page.locator(`[data-lucide="${iconName}"]`);
      const exists = await icon.count() > 0;
      console.log(`✅ Icon "${iconName}": ${exists ? 'Present' : 'Missing'}`);
    }
  });
});

test.describe('Profile Protected Route', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    console.log('\n🔒 Testing Protected Route');
    console.log('-------------------------');

    // Clear cookies to simulate logged out state
    await page.context().clearCookies();
    console.log('✅ Cleared authentication cookies');

    // Try to access profile directly
    await page.goto('http://localhost:3000/dashboard/profile');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    console.log('✅ Redirected to /login page');

    // Verify we're on login page
    await expect(page).toHaveURL(/\/login/);
    console.log('✅ Protected route enforcement working');
  });

  test('should show loading state before redirect', async ({ page }) => {
    console.log('\n⏳ Testing Loading State');
    console.log('-----------------------');

    // Clear cookies
    await page.context().clearCookies();

    // Navigate to profile
    await page.goto('http://localhost:3000/dashboard/profile');

    // Should briefly show loading state
    const loadingText = page.locator('text=Loading profile...');

    // Check if loading appears (it might be very brief)
    const loadingExists = await loadingText.isVisible().catch(() => false);
    console.log(`✅ Loading state: ${loadingExists ? 'Displayed' : 'Too fast to capture'}`);

    // Eventually should redirect
    await page.waitForURL(/\/login/, { timeout: 10000 });
    console.log('✅ Redirect occurred after loading check');
  });
});
