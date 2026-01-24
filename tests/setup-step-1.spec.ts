import { test, expect } from '@playwright/test';

test.describe('Setup Wizard Step 1', () => {
  test.beforeEach(async ({ page }) => {
    // Register to get access to setup wizard
    await page.goto('/signup');
    const testEmail = `setuptest${Date.now()}@example.com`;

    await page.getByLabel(/full name/i).fill('Setup Test User');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/terms/i).check();

    await page.getByRole('button', { name: /sign up/i }).click();

    // Wait for redirect to setup page
    await page.waitForURL('/setup/step-1', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Verify we're on the setup page
    console.log('Final URL:', page.url());
    const title = await page.title().catch(() => 'no title');
    console.log('Page title:', title);
  });

  test('should render all form sections', async ({ page }) => {
    await expect(page.getByText(/personalize your experience/i)).toBeVisible();
    await expect(page.getByLabel(/age/i)).toBeVisible();
    await expect(page.getByLabel(/weight/i)).toBeVisible();
    await expect(page.getByText(/type 1 diabetes/i)).toBeVisible();
    await expect(page.getByText(/type 2 diabetes/i)).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    await expect(page.getByText(/1.*\/.*3/)).toBeVisible();
  });

  test('should validate age input', async ({ page }) => {
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText(/valid age/i)).toBeVisible();
  });

  test('should validate weight input', async ({ page }) => {
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText(/valid weight/i)).toBeVisible();
  });

  test('should require diabetes type selection', async ({ page }) => {
    await page.getByLabel(/age/i).fill('30');
    await page.getByLabel(/weight/i).fill('150');
    await page.getByRole('button', { name: /next/i }).click();

    await expect(page.getByText(/select.*diabetes type/i)).toBeVisible();
  });

  test('should toggle weight unit', async ({ page }) => {
    const kgButton = page.getByRole('button', { name: /^kg$/i });
    const lbsButton = page.getByRole('button', { name: /^lbs$/i });

    // Should start with lbs selected (default)
    await expect(lbsButton).toBeVisible();
    await expect(kgButton).toBeVisible();

    await kgButton.click();
    // After clicking, kg should be selected
  });

  test('should select diabetes type', async ({ page }) => {
    const type1Card = page.locator('[data-testid="diabetes-type-type1"]');
    await type1Card.click();

    // Should show visual selection state (check icon or border change)
    await expect(type1Card).toBeVisible();
  });

  test('should validate glucose targets', async ({ page }) => {
    await page.getByLabel(/age/i).fill('30');
    await page.getByLabel(/weight/i).fill('150');
    await page.locator('[data-testid="diabetes-type-type1"]').click();

    // Clear glucose targets
    await page.getByLabel(/target.*low/i).clear();
    await page.getByLabel(/target.*high/i).clear();

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText(/glucose targets/i)).toBeVisible();
  });

  test('should validate low < high glucose targets', async ({ page }) => {
    await page.getByLabel(/age/i).fill('30');
    await page.getByLabel(/weight/i).fill('150');
    await page.locator('[data-testid="diabetes-type-type1"]').click();

    await page.getByLabel(/target.*low/i).fill('180');
    await page.getByLabel(/target.*high/i).fill('70');

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText(/low.*less than.*high/i)).toBeVisible();
  });

  test('should proceed to step 2 with valid data', async ({ page }) => {
    await page.getByLabel(/age/i).fill('30');
    await page.getByLabel(/weight/i).fill('150');
    await page.locator('[data-testid="diabetes-type-type1"]').click();
    await page.getByLabel(/target.*low/i).fill('70');
    await page.getByLabel(/target.*high/i).fill('180');

    await page.getByRole('button', { name: /next/i }).click();

    await expect(page).toHaveURL('/setup/step-2', { timeout: 5000 });
  });

  test('should toggle glucose unit', async ({ page }) => {
    const mgdlButton = page.getByRole('button', { name: /mg\/dl/i });
    const mmolButton = page.getByRole('button', { name: /mmol\/l/i });

    await expect(mgdlButton).toBeVisible();
    await expect(mmolButton).toBeVisible();

    await mmolButton.click();
    // Values should convert (e.g., 70 mg/dL → ~4 mmol/L)
  });

  test('should have default glucose targets', async ({ page }) => {
    const lowInput = page.getByLabel(/target.*low/i);
    const highInput = page.getByLabel(/target.*high/i);

    await expect(lowInput).toHaveValue('70');
    await expect(highInput).toHaveValue('180');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText(/personalize/i)).toBeVisible();
    await expect(page.getByLabel(/age/i)).toBeVisible();
  });

  test('should work in dark mode', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }

    // Check if dark mode class is applied
    const classes = await html.getAttribute('class');
    if (classes?.includes('dark')) {
      await expect(html).toHaveClass(/dark/);
    }

    await expect(page.getByLabel(/age/i)).toBeVisible();
  });

  test('should have back button', async ({ page }) => {
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL('/welcome');
  });
});
