import { test, expect } from '@playwright/test';

test.use({
  launchOptions: { slowMo: 500 },
  headless: false,
});

test('Login page visual check', async ({ page }) => {
  await page.goto('/login');

  console.log('✓ Navigated to /login');
  await page.waitForTimeout(2000);

  // Check header
  const header = page.locator('.auth-header');
  await expect(header).toBeVisible();
  console.log('✓ Header visible');

  const backBtn = page.locator('.back-btn');
  await expect(backBtn).toBeVisible();
  console.log('✓ Back button visible');

  const title = page.locator('.auth-title');
  await expect(title).toHaveText('Log In');
  console.log('✓ Title "Log In" visible');

  // Check welcome text
  const welcomeHeading = page.locator('.welcome-text h1');
  await expect(welcomeHeading).toHaveText('Welcome Back');
  console.log('✓ Welcome heading visible');

  // Check form icons
  const mailIcon = page.locator('.form-input-icon').first();
  await expect(mailIcon).toBeVisible();
  console.log('✓ Mail icon visible in email input');

  const lockIcon = page.locator('.form-input-icon').nth(1);
  await expect(lockIcon).toBeVisible();
  console.log('✓ Lock icon visible in password input');

  const eyeIcon = page.locator('.password-toggle');
  await expect(eyeIcon).toBeVisible();
  console.log('✓ Eye icon visible for password toggle');

  // Check form extras
  const checkboxGroup = page.locator('.checkbox-group');
  await expect(checkboxGroup).toBeVisible();
  console.log('✓ Remember me checkbox visible');

  const forgotLink = page.locator('.forgot-link');
  await expect(forgotLink).toContainText('Forgot password?');
  console.log('✓ Forgot password link visible');

  // Check submit button
  const submitBtn = page.locator('.submit-btn');
  await expect(submitBtn).toContainText('Log In');
  console.log('✓ Submit button has "Log In" text');

  // Check for arrow icon in submit button
  const arrowIcon = submitBtn.locator('svg');
  await expect(arrowIcon).toBeVisible();
  console.log('✓ Arrow icon visible in submit button');

  // Check divider
  const divider = page.locator('.divider');
  await expect(divider).toBeVisible();
  const dividerText = page.locator('.divider-text');
  await expect(dividerText).toContainText('or continue with');
  console.log('✓ Divider with "or continue with" text visible');

  // Check social buttons
  const socialButtons = page.locator('.social-btn');
  await expect(socialButtons).toHaveCount(2);
  console.log('✓ Two social buttons visible');

  const googleBtn = socialButtons.first();
  await expect(googleBtn).toContainText('Google');
  console.log('✓ Google button visible');

  const githubBtn = socialButtons.nth(1);
  await expect(githubBtn).toContainText('GitHub');
  console.log('✓ GitHub button visible');

  // Check footer
  const footer = page.locator('.auth-footer');
  await expect(footer).toBeVisible();
  await expect(footer).toContainText("Don't have an account?");
  console.log('✓ Footer visible with signup link');

  console.log('');
  console.log('✅ ALL VISUAL CHECKS PASSED');

  await page.waitForTimeout(3000);
});

test('Login page password toggle functionality', async ({ page }) => {
  await page.goto('/login');

  const passwordInput = page.locator('input[name="password"]');
  const passwordToggle = page.locator('.password-toggle');

  // Initially should be password type
  await expect(passwordInput).toHaveAttribute('type', 'password');
  console.log('✓ Password input initially hidden');

  // Click toggle to show password
  await passwordToggle.click();
  await expect(passwordInput).toHaveAttribute('type', 'text');
  console.log('✓ Password toggle shows password');

  // Click toggle to hide password
  await passwordToggle.click();
  await expect(passwordInput).toHaveAttribute('type', 'password');
  console.log('✓ Password toggle hides password');

  console.log('');
  console.log('✅ PASSWORD TOGGLE FUNCTIONALITY WORKS');

  await page.waitForTimeout(2000);
});

test('Login page remember me functionality', async ({ page }) => {
  await page.goto('/login');

  const rememberCheckbox = page.locator('#remember');

  // Initially unchecked
  await expect(rememberCheckbox).not.toBeChecked();
  console.log('✓ Remember me initially unchecked');

  // Click to check
  await rememberCheckbox.click();
  await expect(rememberCheckbox).toBeChecked();
  console.log('✓ Remember me can be checked');

  // Click to uncheck
  await rememberCheckbox.click();
  await expect(rememberCheckbox).not.toBeChecked();
  console.log('✓ Remember me can be unchecked');

  console.log('');
  console.log('✅ REMEMBER ME FUNCTIONALITY WORKS');

  await page.waitForTimeout(2000);
});
