import { test, expect } from '@playwright/test';

test.use({
  headless: false,
  slowMo: 1000,
});

test('Signup page visual check', async ({ page }) => {
  await page.goto('/signup');

  console.log('✓ Navigated to /signup');
  await page.waitForTimeout(2000);

  // Check header
  const header = page.locator('.auth-header');
  await expect(header).toBeVisible();
  console.log('✓ Header visible');

  const backBtn = page.locator('.back-btn');
  await expect(backBtn).toBeVisible();
  console.log('✓ Back button visible');

  const title = page.locator('.auth-title');
  await expect(title).toHaveText('Sign Up');
  console.log('✓ Title "Sign Up" visible');

  // Check welcome text
  const welcomeHeading = page.locator('.welcome-text h1');
  await expect(welcomeHeading).toHaveText('Create Account');
  console.log('✓ Welcome heading "Create Account" visible');

  // Check form icons
  const formInputIcons = page.locator('.form-input-icon');
  const iconCount = await formInputIcons.count();
  expect(iconCount).toBe(3); // User, Mail, Lock icons
  console.log(`✓ ${iconCount} form input icons visible (User, Mail, Lock)`);

  const userIcon = page.locator('.form-input-icon').first();
  await expect(userIcon).toBeVisible();
  console.log('✓ User icon visible in name input');

  const mailIcon = page.locator('.form-input-icon').nth(1);
  await expect(mailIcon).toBeVisible();
  console.log('✓ Mail icon visible in email input');

  const lockIcon = page.locator('.form-input-icon').nth(2);
  await expect(lockIcon).toBeVisible();
  console.log('✓ Lock icon visible in password input');

  const eyeIcon = page.locator('.password-toggle');
  await expect(eyeIcon).toBeVisible();
  console.log('✓ Eye icon visible for password toggle');

  // Check terms checkbox
  const termsCheckbox = page.locator('#terms');
  await expect(termsCheckbox).toBeVisible();
  console.log('✓ Terms checkbox visible');

  const termsLabel = page.locator('.checkbox-label');
  await expect(termsLabel).toBeVisible();
  await expect(termsLabel).toContainText('Terms of Service');
  await expect(termsLabel).toContainText('Privacy Policy');
  console.log('✓ Terms label with links visible');

  // Check submit button
  const submitBtn = page.locator('.submit-btn');
  await expect(submitBtn).toContainText('Create Account');
  console.log('✓ Submit button has "Create Account" text');

  // Check for arrow icon in submit button
  const arrowIcon = submitBtn.locator('svg');
  await expect(arrowIcon).toBeVisible();
  console.log('✓ Arrow icon visible in submit button');

  // Check divider
  const divider = page.locator('.divider');
  await expect(divider).toBeVisible();
  const dividerText = page.locator('.divider-text');
  await expect(dividerText).toHaveText('or continue with');
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
  await expect(footer).toContainText('Already have an account?');
  await expect(footer).toContainText('Log in');
  console.log('✓ Footer visible with login link');

  console.log('');
  console.log('✅ ALL VISUAL CHECKS PASSED');

  await page.waitForTimeout(3000);
});

test('Signup page password toggle functionality', async ({ page }) => {
  await page.goto('/signup');

  console.log('Testing password toggle...');

  // Initially password should be hidden
  const passwordInput = page.locator('#password');
  await expect(passwordInput).toHaveAttribute('type', 'password');
  console.log('✓ Password initially hidden');

  // Click toggle button
  const toggleBtn = page.locator('.password-toggle');
  await toggleBtn.click();

  // Password should now be visible
  await expect(passwordInput).toHaveAttribute('type', 'text');
  console.log('✓ Password toggle shows password');

  // Click again to hide
  await toggleBtn.click();
  await expect(passwordInput).toHaveAttribute('type', 'password');
  console.log('✓ Password toggle hides password');

  console.log('');
  console.log('✅ PASSWORD TOGGLE FUNCTIONALITY WORKS');

  await page.waitForTimeout(2000);
});

test('Signup page form validation', async ({ page }) => {
  await page.goto('/signup');

  console.log('Testing form validation...');

  // Try to submit empty form
  await page.locator('.submit-btn').click();
  await page.waitForTimeout(500);

  // Check for HTML5 validation (browser built-in)
  // The form should not submit due to required fields
  const nameInput = page.locator('#name');
  const isRequired = await nameInput.getAttribute('required');
  expect(isRequired).not.toBeNull();
  console.log('✓ Name input has required attribute');

  const emailInput = page.locator('#email');
  const emailRequired = await emailInput.getAttribute('required');
  expect(emailRequired).not.toBeNull();
  console.log('✓ Email input has required attribute');

  const passwordInput = page.locator('#password');
  const passwordRequired = await passwordInput.getAttribute('required');
  expect(passwordRequired).not.toBeNull();
  console.log('✓ Password input has required attribute');

  const termsCheckbox = page.locator('#terms');
  const termsRequired = await termsCheckbox.getAttribute('required');
  expect(termsRequired).not.toBeNull();
  console.log('✓ Terms checkbox has required attribute');

  // Fill in the form to test that it can be submitted
  await nameInput.fill('John Doe');
  await emailInput.fill('john@example.com');
  await passwordInput.fill('password123');
  await termsCheckbox.check();

  console.log('✓ Form can be filled out completely');

  console.log('');
  console.log('✅ FORM VALIDATION WORKS');

  await page.waitForTimeout(2000);
});

test('Signup page terms checkbox functionality', async ({ page }) => {
  await page.goto('/signup');

  console.log('Testing terms checkbox...');

  const termsCheckbox = page.locator('#terms');

  // Initially unchecked
  await expect(termsCheckbox).not.toBeChecked();
  console.log('✓ Terms checkbox initially unchecked');

  // Check the checkbox
  await termsCheckbox.check();
  await expect(termsCheckbox).toBeChecked();
  console.log('✓ Terms checkbox can be checked');

  // Uncheck the checkbox
  await termsCheckbox.uncheck();
  await expect(termsCheckbox).not.toBeChecked();
  console.log('✓ Terms checkbox can be unchecked');

  console.log('');
  console.log('✅ TERMS CHECKBOX FUNCTIONALITY WORKS');

  await page.waitForTimeout(2000);
});

test('Signup page input placeholders', async ({ page }) => {
  await page.goto('/signup');

  console.log('Checking input placeholders...');

  const nameInput = page.locator('#name');
  await expect(nameInput).toHaveAttribute('placeholder', 'John Doe');
  console.log('✓ Name input has correct placeholder');

  const emailInput = page.locator('#email');
  await expect(emailInput).toHaveAttribute('placeholder', 'john@example.com');
  console.log('✓ Email input has correct placeholder');

  const passwordInput = page.locator('#password');
  await expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  console.log('✓ Password input has correct placeholder');

  console.log('');
  console.log('✅ INPUT PLACEHOLDERS CORRECT');

  await page.waitForTimeout(2000);
});
