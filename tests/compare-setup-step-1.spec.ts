import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.use({
  headless: false,
  viewport: { width: 480, height: 900 },
});

test.setTimeout(120000);

async function navigateToSetup(page: any) {
  await page.goto('http://localhost:3000/signup');
  const testEmail = `compare${Date.now()}@example.com`;

  await page.getByLabel(/full name/i).fill('Compare Test');
  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByLabel(/terms/i).check();
  await page.getByRole('button', { name: /sign up|create account/i }).click();

  try {
    await page.waitForURL('**/setup/step-1', { timeout: 10000 });
  } catch (e) {
    await page.goto('http://localhost:3000/setup/step-1');
  }

  await page.waitForTimeout(1000);
}

test('Compare Setup Step 1 implementation vs mockup', async ({ browser }) => {
  // Open mockup HTML in one context
  const mockupContext = await browser.newContext({ viewport: { width: 480, height: 900 } });
  const mockupPage = await mockupContext.newPage();

  const mockupPath = path.join('/home/jake/ws/sugar/.superdesign/design_iterations/setup_wizard_step_1.html');
  await mockupPage.goto(`file://${mockupPath}`);
  await mockupPage.waitForTimeout(1000);

  // Open implementation in another context
  const implContext = await browser.newContext({ viewport: { width: 480, height: 900 } });
  const implPage = await implContext.newPage();
  await navigateToSetup(implPage);

  console.log('\n📸 Taking screenshots for comparison...\n');

  // Take full page screenshots
  await mockupPage.screenshot({ path: '/tmp/mockup-step-1-full.png', fullPage: true });
  console.log('✓ Mockup screenshot saved: /tmp/mockup-step-1-full.png');

  await implPage.screenshot({ path: '/tmp/implementation-step-1-full.png', fullPage: true });
  console.log('✓ Implementation screenshot saved: /tmp/implementation-step-1-full.png');

  // Take component screenshots
  await mockupPage.locator('.wizard-header').screenshot({ path: '/tmp/mockup-header.png' });
  await implPage.locator('.wizard-header').screenshot({ path: '/tmp/impl-header.png' });
  console.log('✓ Header screenshots saved');

  await mockupPage.locator('.progress-steps').screenshot({ path: '/tmp/mockup-progress.png' });
  await implPage.locator('.progress-steps').screenshot({ path: '/tmp/impl-progress.png' });
  console.log('✓ Progress steps screenshots saved');

  await mockupPage.locator('.wizard-icon').screenshot({ path: '/tmp/mockup-icon.png' });
  await implPage.locator('.wizard-icon').screenshot({ path: '/tmp/impl-icon.png' });
  console.log('✓ Icon screenshots saved');

  await mockupPage.locator('.wizard-title').screenshot({ path: '/tmp/mockup-title.png' });
  await implPage.locator('.wizard-title').screenshot({ path: '/tmp/impl-title.png' });
  console.log('✓ Title screenshots saved');

  await mockupPage.locator('.wizard-form').screenshot({ path: '/tmp/mockup-form.png' });
  await implPage.locator('.wizard-form').screenshot({ path: '/tmp/impl-form.png' });
  console.log('✓ Form screenshots saved');

  await mockupPage.locator('.wizard-footer').screenshot({ path: '/tmp/mockup-footer.png' });
  await implPage.locator('.wizard-footer').screenshot({ path: '/tmp/impl-footer.png' });
  console.log('✓ Footer screenshots saved');

  console.log('\n✅ All screenshots saved to /tmp/');
  console.log('\nCompare files:');
  console.log('  Full page: /tmp/mockup-step-1-full.png vs /tmp/implementation-step-1-full.png');
  console.log('  Components: /tmp/mockup-*.png vs /tmp/impl-*.png');

  // Keep browser open for manual inspection
  await mockupPage.waitForTimeout(5000);
  await implPage.waitForTimeout(5000);

  await mockupContext.close();
  await implContext.close();
});
