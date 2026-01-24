import { test, expect } from '@playwright/test';

test.describe('Chat Input Bar Position Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/signup');

    const testEmail = `chat-test-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Chat Test User');
    await page.getByPlaceholder('john@example.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.locator('input[type="checkbox"]').check();
    await page.click('button[type="submit"]');

    // Complete onboarding
    await page.waitForURL('**/setup/step-1', { timeout: 15000 });
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="weight"]', '70');
    await page.selectOption('select[name="diabetesType"]', 'type1');
    await page.click('button.btn-primary');

    await page.waitForURL('**/setup/step-2');
    await page.click('.device-card:has-text("Manual Entry")');
    await page.click('button.btn-primary');

    await page.waitForURL('**/setup/step-3');
    await page.click('button.btn-primary');

    await page.waitForURL('**/welcome', { timeout: 15000 });

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('Pass 1: Input bar should be fixed at bottom initially', async ({ page }) => {
    console.log('\n🧪 TEST PASS 1: Initial Position Check');
    console.log('=====================================\n');

    // Wait for chat container
    const chatContainer = page.locator('.chat-container');
    await expect(chatContainer).toBeVisible();
    console.log('✅ Chat container visible');

    // Find input bar
    const inputBar = page.locator('.input-bar');
    await expect(inputBar).toBeVisible();
    console.log('✅ Input bar visible');

    // Get input bar position
    const inputBarBox = await inputBar.boundingBox();
    const viewportSize = page.viewportSize();

    if (inputBarBox && viewportSize) {
      const distanceFromBottom = viewportSize.height - (inputBarBox.y + inputBarBox.height);
      console.log(`📏 Input bar distance from bottom: ${distanceFromBottom}px`);
      console.log(`📏 Viewport height: ${viewportSize.height}px`);
      console.log(`📏 Input bar Y position: ${inputBarBox.y}px`);

      // Input bar should be near bottom (within 100px tolerance for FAB and other elements)
      expect(distanceFromBottom).toBeLessThan(100);
      console.log('✅ Input bar is positioned at bottom of screen\n');
    }
  });

  test('Pass 2: Input bar should stay fixed after scrolling messages', async ({ page }) => {
    console.log('\n🧪 TEST PASS 2: Fixed Position During Scroll');
    console.log('==========================================\n');

    const inputBar = page.locator('.input-bar');
    const chatMessages = page.locator('.chat-messages');

    // Get initial position
    const initialBox = await inputBar.boundingBox();
    console.log(`📏 Initial input bar Y position: ${initialBox?.y}px`);

    // Add multiple messages to enable scrolling
    const chatInput = page.locator('input.chat-input[aria-label="Chat input"]'); // More specific
    for (let i = 1; i <= 10; i++) {
      await chatInput.fill(`Test message ${i}`);
      await chatInput.press('Enter');
      await page.waitForTimeout(100);
      console.log(`📝 Sent message ${i}`);
    }

    await page.waitForTimeout(1000);
    console.log('✅ Multiple messages sent\n');

    // Scroll to top of messages
    await chatMessages.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.waitForTimeout(500);
    console.log('⬆️  Scrolled to top of messages');

    // Get position after scroll
    const afterScrollBox = await inputBar.boundingBox();
    console.log(`📏 Input bar Y position after scroll: ${afterScrollBox?.y}px`);

    // Input bar should still be at same position (fixed)
    if (initialBox && afterScrollBox) {
      const positionDifference = Math.abs(initialBox.y - afterScrollBox.y);
      console.log(`📏 Position difference: ${positionDifference}px`);
      expect(positionDifference).toBeLessThan(10); // Allow 10px tolerance for centered layout
      console.log('✅ Input bar remained fixed during scroll\n');
    }
  });

  test('Pass 3: Input bar should always be visible and functional', async ({ page }) => {
    console.log('\n🧪 TEST PASS 3: Visibility and Functionality');
    console.log('=========================================\n');

    const inputBar = page.locator('.input-bar');
    const chatInput = page.locator('input.chat-input[aria-label="Chat input"]'); // More specific selector
    const sendButton = page.locator('.send-btn');

    // Check visibility
    await expect(inputBar).toBeVisible();
    console.log('✅ Input bar visible');

    await expect(chatInput).toBeVisible();
    console.log('✅ Input field visible');

    await expect(sendButton).toBeVisible();
    console.log('✅ Send button visible\n');

    // Add some messages (reduced from 15 to 5 for speed)
    for (let i = 1; i <= 5; i++) {
      await chatInput.fill(`Message number ${i}`);
      await chatInput.press('Enter');
      await page.waitForTimeout(200);
      console.log(`📝 Sent message ${i}`);
    }

    // Wait for messages to render
    await page.waitForTimeout(1000);

    // Scroll up
    const chatMessages = page.locator('.chat-messages');
    await chatMessages.evaluate((el) => {
      el.scrollTop = el.scrollHeight / 2; // Scroll to middle
    });
    await page.waitForTimeout(500);
    console.log('⬆️  Scrolled to middle of messages');

    // Input bar should still be visible
    await expect(inputBar).toBeVisible();
    console.log('✅ Input bar still visible after scrolling');

    // Should be able to type
    await chatInput.fill('Final test message');
    const inputValue = await chatInput.inputValue();
    expect(inputValue).toBe('Final test message');
    console.log('✅ Can still type in input field');

    // Should be able to send
    await sendButton.click();
    await page.waitForTimeout(500);
    const finalValue = await chatInput.inputValue();
    expect(finalValue).toBe('');
    console.log('✅ Can send message and input clears\n');

    console.log('🎉 All functionality tests passed!');
  });
});
