import { test, expect } from '@playwright/test';

test.describe('Setup Wizard Step 1', () => {
  test.beforeEach(async ({ page }) => {
    // Register to get access to setup wizard
    await page.goto('/signup');
    const testEmail = `setuptest${Date.now()}@example.com`;

    // Fill signup form - actual signup page has: name, email, password (no confirm), terms
    await page.getByLabel(/full name/i).fill('Setup Test User');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.locator('#terms').check();

    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for redirect to setup page - the signup page uses window.location.href so we wait for URL
    await page.waitForURL('/setup/step-1', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  test('should render all form sections', async ({ page }) => {
    // Title says "Tell Us About You"
    await expect(page.getByRole('heading', { name: /tell us about you/i })).toBeVisible();

    // Has Age, Weight fields
    await expect(page.getByText('Age')).toBeVisible();
    await expect(page.getByText(/Weight/i)).toBeVisible();

    // Has Diabetes Type dropdown with options
    await expect(page.getByText('Diabetes Type')).toBeVisible();
    const diabetesSelect = page.locator('select[name="diabetesType"]');
    await expect(diabetesSelect).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    // Progress is shown as 3 dots with the first one active
    const progressSteps = page.locator('.progress-steps');
    await expect(progressSteps).toBeVisible();

    // First step dot should be active
    const activeDot = page.locator('.step-dot.active');
    await expect(activeDot).toBeVisible();
  });

  test('should validate required fields on submit', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /continue/i }).click();

    // HTML5 validation should prevent submission - check that we're still on step-1
    await expect(page).toHaveURL(/step-1/);
  });

  test('should fill age input', async ({ page }) => {
    const ageInput = page.locator('input[name="age"]');
    await ageInput.fill('30');
    await expect(ageInput).toHaveValue('30');
  });

  test('should fill weight input', async ({ page }) => {
    const weightInput = page.locator('input[name="weight"]');
    await weightInput.fill('70');
    await expect(weightInput).toHaveValue('70');
  });

  test('should select diabetes type from dropdown', async ({ page }) => {
    const diabetesSelect = page.locator('select[name="diabetesType"]');

    // Select Type 1 Diabetes
    await diabetesSelect.selectOption('type1');
    await expect(diabetesSelect).toHaveValue('type1');

    // Select Type 2 Diabetes
    await diabetesSelect.selectOption('type2');
    await expect(diabetesSelect).toHaveValue('type2');
  });

  test('should have default glucose targets', async ({ page }) => {
    const minInput = page.locator('input[name="targetMin"]');
    const maxInput = page.locator('input[name="targetMax"]');

    await expect(minInput).toHaveValue('70');
    await expect(maxInput).toHaveValue('180');
  });

  test('should allow editing glucose targets', async ({ page }) => {
    const minInput = page.locator('input[name="targetMin"]');
    const maxInput = page.locator('input[name="targetMax"]');

    await minInput.fill('80');
    await maxInput.fill('160');

    await expect(minInput).toHaveValue('80');
    await expect(maxInput).toHaveValue('160');
  });

  test('should proceed to step 2 with valid data', async ({ page }) => {
    // Fill all required fields
    await page.locator('input[name="age"]').fill('30');
    await page.locator('input[name="weight"]').fill('70');
    await page.locator('select[name="diabetesType"]').selectOption('type1');

    // Targets already have default values (70, 180)

    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page).toHaveURL('/setup/step-2', { timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Title and form should still be visible
    await expect(page.getByRole('heading', { name: /tell us about you/i })).toBeVisible();
    await expect(page.locator('input[name="age"]')).toBeVisible();
  });

  test('should have back button that goes to welcome', async ({ page }) => {
    // There are two back buttons - one in header (arrow icon) and one in footer (with text)
    const footerBackButton = page.locator('.btn-secondary').filter({ hasText: /back/i });
    await expect(footerBackButton).toBeVisible();

    await footerBackButton.click();
    await expect(page).toHaveURL('/welcome');
  });

  test('should have skip link', async ({ page }) => {
    const skipLink = page.locator('.skip-btn');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveText('Skip');
  });

  test('should show diabetes type options in dropdown', async ({ page }) => {
    const diabetesSelect = page.locator('select[name="diabetesType"]');

    // Check that the dropdown has the expected options
    const options = diabetesSelect.locator('option');
    await expect(options).toHaveCount(6); // "Select type" + 5 diabetes types

    // Verify option values
    await expect(diabetesSelect.locator('option[value="type1"]')).toHaveText('Type 1 Diabetes');
    await expect(diabetesSelect.locator('option[value="type2"]')).toHaveText('Type 2 Diabetes');
    await expect(diabetesSelect.locator('option[value="prediabetes"]')).toHaveText('Prediabetes');
    await expect(diabetesSelect.locator('option[value="gestational"]')).toHaveText('Gestational Diabetes');
    await expect(diabetesSelect.locator('option[value="other"]')).toHaveText('Other / Not Sure');
  });

  test('should save form data to localStorage on submit', async ({ page }) => {
    // Fill all required fields
    await page.locator('input[name="age"]').fill('35');
    await page.locator('input[name="weight"]').fill('75');
    await page.locator('select[name="diabetesType"]').selectOption('type2');
    await page.locator('input[name="targetMin"]').fill('80');
    await page.locator('input[name="targetMax"]').fill('170');

    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for navigation
    await page.waitForURL('/setup/step-2', { timeout: 5000 });

    // Check localStorage was updated
    const storedData = await page.evaluate(() => localStorage.getItem('setupStep1Data'));
    expect(storedData).not.toBeNull();

    const parsedData = JSON.parse(storedData as string);
    expect(parsedData.age).toBe('35');
    expect(parsedData.weight).toBe('75');
    expect(parsedData.diabetesType).toBe('type2');
    expect(parsedData.targetMin).toBe('80');
    expect(parsedData.targetMax).toBe('170');
  });
});
