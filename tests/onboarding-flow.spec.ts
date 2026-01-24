import { test, expect } from '@playwright/test';

test.describe('Complete Onboarding Wizard Flow', () => {
  test('should complete full onboarding: Signup → Step 1 → Step 2 → Step 3 → Welcome', async ({ page }) => {
    const testEmail = `onboarding-${Date.now()}@example.com`;
    const testName = 'Onboarding Test User';
    const testPassword = 'password123';

    // ======================================
    // STEP 1: SIGNUP
    // ======================================
    console.log('\n🚀 Starting Onboarding Flow Test');
    console.log('================================\n');

    await page.goto('http://localhost:3000/signup');
    console.log('✅ 1. Navigated to /signup');

    // Fill in signup form (using placeholders, no IDs)
    await page.getByPlaceholder('John Doe').fill(testName);
    await page.getByPlaceholder('john@example.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    await page.locator('input[type="checkbox"]').check();

    console.log(`✅ 2. Filled signup form (${testEmail})`);

    // Submit signup and wait for navigation
    await Promise.all([
      page.waitForURL('**/setup/step-1', { timeout: 15000 }),
      page.click('button[type="submit"]')
    ]);
    console.log('✅ 3. Clicked Sign Up button and navigated to Step 1\n');

    // ======================================
    // STEP 2: COMPLETE STEP 1 (PERSONAL INFO)
    // ======================================
    console.log('📝 STEP 1: Personal Information');
    console.log('--------------------------------');

    // Verify we're on step 1
    await expect(page.locator('h1')).toContainText('Tell Us About You');
    console.log('✅ 4. Step 1 page loaded');

    // Fill in personal info
    await page.fill('input[name="age"]', '35');
    await page.fill('input[name="weight"]', '75');
    await page.selectOption('select[name="diabetesType"]', 'type1');
    // Target range already has defaults
    console.log('✅ 5. Filled personal information');

    // Click Continue and wait for navigation
    await Promise.all([
      page.waitForURL('**/setup/step-2', { timeout: 5000 }),
      page.click('button.btn-primary')
    ]);
    console.log('✅ 6. Navigated to Step 2\n');

    // ======================================
    // STEP 3: COMPLETE STEP 2 (DEVICE SELECTION)
    // ======================================
    console.log('🔌 STEP 2: Device Selection');
    console.log('----------------------------');

    // Verify we're on step 2
    await expect(page.locator('h1')).toContainText('Choose Your Device');
    console.log('✅ 7. Step 2 page loaded');

    // Select a device (Manual Entry)
    await page.click('.device-card:has-text("Manual Entry")');
    console.log('✅ 8. Selected Manual Entry device');

    // Verify selection
    await expect(page.locator('.device-card.selected')).toHaveCount(1);
    console.log('✅ 9. Device selection confirmed');

    // Click Continue and wait for navigation
    await Promise.all([
      page.waitForURL('**/setup/step-3', { timeout: 5000 }),
      page.click('button.btn-primary')
    ]);
    console.log('✅ 10. Navigated to Step 3\n');

    // ======================================
    // STEP 4: COMPLETE STEP 3 (SUMMARY & FINISH)
    // ======================================
    console.log('✨ STEP 3: Summary & Completion');
    console.log('--------------------------------');

    // Verify we're on step 3
    await expect(page.locator('h1')).toContainText('All Set');
    console.log('✅ 11. Step 3 page loaded');

    // Verify summary shows correct data
    await expect(page.locator('.summary-value')).toContainText('35 years');
    await expect(page.locator('.summary-value')).toContainText('75 kg');
    console.log('✅ 12. Summary displays correct information');

    // Click Complete Setup and wait for navigation
    await Promise.all([
      page.waitForURL('**/welcome', { timeout: 15000 }),
      page.click('button.btn-primary')
    ]);
    console.log('✅ 13. Navigated to Welcome page\n');

    // ======================================
    // STEP 5: VERIFY WELCOME PAGE
    // ======================================
    console.log('🎉 FINAL: Welcome Page');
    console.log('----------------------');

    // Verify welcome page loaded
    await expect(page.locator('h1')).toContainText('Sugar');
    console.log('✅ 14. Welcome page loaded successfully');

    console.log('\n================================');
    console.log('🎊 ONBOARDING FLOW COMPLETED!');
    console.log('================================\n');

    // Wait to see the final state
    await page.waitForTimeout(2000);
  });

  test('should handle device selection and navigation', async ({ page }) => {
    const testEmail = `quick-test-${Date.now()}@example.com`;

    // Quick signup (using placeholders, no IDs)
    await page.goto('http://localhost:3000/signup');
    await page.getByPlaceholder('John Doe').fill('Quick Test');
    await page.getByPlaceholder('john@example.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.locator('input[type="checkbox"]').check();

    await Promise.all([
      page.waitForURL('**/setup/step-1'),
      page.click('button[type="submit"]')
    ]);

    // Fill Step 1
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="weight"]', '70');
    await page.selectOption('select[name="diabetesType"]', 'type2');

    await Promise.all([
      page.waitForURL('**/setup/step-2'),
      page.click('button.btn-primary')
    ]);

    // Test device selection
    await page.click('.device-card:has-text("Dexcom CGM")');
    await expect(page.locator('.device-card.selected')).toHaveCount(1);
    console.log('✅ Device selection works correctly');

    // Test Back button
    await Promise.all([
      page.waitForURL('**/setup/step-1'),
      page.click('button.btn-secondary')
    ]);
    console.log('✅ Back button works: Step 2 → Step 1');

    // Go forward again
    await Promise.all([
      page.waitForURL('**/setup/step-2'),
      page.click('button.btn-primary')
    ]);

    // Select and continue
    await page.click('.device-card:has-text("Manual Entry")');
    await Promise.all([
      page.waitForURL('**/setup/step-3'),
      page.click('button.btn-primary')
    ]);

    console.log('✅ Navigation test completed successfully');
  });
});
