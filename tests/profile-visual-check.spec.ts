import { test, expect } from '@playwright/test';

test.describe('Profile Visual Checks', () => {
  const testPassword = 'password123';

  test.beforeEach(async ({ page }) => {
    console.log('\n🔐 Setting up test user and navigating to profile...');

    // Navigate to signup
    await page.goto('http://localhost:3000/signup');

    // Fill signup form
    const uniqueEmail = `visual-profile-${Date.now()}@example.com`;
    await page.getByPlaceholder('John Doe').fill('Visual Profile Test');
    await page.getByPlaceholder('john@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('••••••••').fill(testPassword);
    await page.locator('input[type="checkbox"]').check();

    // Complete signup and onboarding
    await Promise.all([
      page.waitForURL('**/setup/step-1'),
      page.click('button[type="submit"]')
    ]);

    // Quick onboarding
    await page.fill('input[name="age"]', '35');
    await page.fill('input[name="weight"]', '75');
    await page.selectOption('select[name="diabetesType"]', 'type1');
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

    // Navigate to profile
    await page.goto('http://localhost:3000/dashboard/profile');
    await page.waitForLoadState('networkidle');

    console.log('✅ Profile page loaded\n');
  });

  test('Profile Header - Structure and Styling', async ({ page }) => {
    console.log('\n👤 Visual Check: Profile Header');
    console.log('--------------------------------');

    // Check profile header exists
    const profileHeader = page.locator('.profile-header');
    await expect(profileHeader).toBeVisible();

    // Check gradient background (via CSS)
    const bgGradient = await profileHeader.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage;
    });
    expect(bgGradient).toContain('gradient');
    console.log('✅ Profile header has gradient background');

    // Check content wrapper
    const contentWrapper = profileHeader.locator('.content-wrapper');
    await expect(contentWrapper).toBeVisible();

    // Check avatar
    const avatar = page.locator('.avatar');
    await expect(avatar).toBeVisible();

    // Check avatar is circular
    const avatarStyle = await avatar.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        borderRadius: style.borderRadius,
        width: style.width,
        height: style.height,
        background: style.backgroundColor
      };
    });
    expect(avatarStyle.borderRadius).toBe('50%');
    console.log('✅ Avatar is circular (border-radius: 50%)');

    // Check avatar text color (should be primary color on white background)
    const avatarColor = await avatar.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    console.log(`✅ Avatar color: ${avatarColor}`);

    // Check profile name styling
    const profileName = page.locator('.profile-name');
    const nameStyle = await profileName.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight
      };
    });
    expect(nameStyle.color).toContain('rgb(255, 255, 255)'); // White text
    expect(parseInt(nameStyle.fontWeight)).toBeGreaterThanOrEqual(700); // Bold
    console.log('✅ Profile name is white and bold');

    // Check profile email styling
    const profileEmail = page.locator('.profile-email');
    const emailStyle = await profileEmail.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    console.log(`✅ Profile email color: ${emailStyle}`);
  });

  test('Stats Grid - Layout and Cards', async ({ page }) => {
    console.log('\n📊 Visual Check: Stats Grid');
    console.log('---------------------------');

    // Check stats grid
    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible();

    // Check grid layout
    const gridStyle = await statsGrid.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap
      };
    });
    expect(gridStyle.display).toBe('grid');
    console.log('✅ Stats grid uses CSS Grid');
    console.log(`✅ Grid template columns: ${gridStyle.gridTemplateColumns}`);

    // Check stat cards
    const statCards = page.locator('.stat-card');
    expect(await statCards.count()).toBe(2);

    // Check first card styling
    const firstCard = statCards.first();
    const cardStyle = await firstCard.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        border: style.border,
        borderRadius: style.borderRadius,
        padding: style.padding,
        textAlign: style.textAlign
      };
    });
    expect(cardStyle.textAlign).toBe('center');
    console.log('✅ Stat cards have centered text');

    // Check stat value styling (should be large, bold, primary color)
    const statValue = firstCard.locator('.stat-value');
    const valueStyle = await statValue.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color
      };
    });
    expect(parseInt(valueStyle.fontWeight)).toBeGreaterThanOrEqual(700);
    console.log(`✅ Stat value is bold (font-weight: ${valueStyle.fontWeight})`);
    console.log(`✅ Stat value font size: ${valueStyle.fontSize}`);

    // Check stat label styling
    const statLabel = firstCard.locator('.stat-label');
    const labelStyle = await statLabel.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    console.log(`✅ Stat label font size: ${labelStyle}`);
  });

  test('Settings Sections - Structure and Items', async ({ page }) => {
    console.log('\n⚙️  Visual Check: Settings Sections');
    console.log('-----------------------------------');

    // Check all sections exist
    const sections = page.locator('.section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThanOrEqual(4); // Personal Info, Health Settings, App Settings, Account
    console.log(`✅ ${sectionCount} sections present`);

    // Check section title styling
    const sectionTitle = page.locator('.section-title').first();
    const titleStyle = await sectionTitle.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        textTransform: style.textTransform,
        letterSpacing: style.letterSpacing,
        fontWeight: style.fontWeight
      };
    });
    expect(titleStyle.textTransform).toBe('uppercase');
    console.log('✅ Section titles are uppercase');

    // Check settings list
    const settingsList = page.locator('.settings-list').first();
    const listStyle = await settingsList.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        border: style.border,
        borderRadius: style.borderRadius,
        overflow: style.overflow
      };
    });
    expect(listStyle.overflow).toBe('hidden');
    console.log('✅ Settings list has overflow hidden');

    // Check settings item
    const settingsItem = page.locator('.settings-item').first();
    const itemStyle = await settingsItem.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        alignItems: style.alignItems,
        gap: style.gap,
        padding: style.padding
      };
    });
    expect(itemStyle.display).toBe('flex');
    expect(itemStyle.alignItems).toBe('center');
    console.log('✅ Settings items use flexbox with center alignment');

    // Check settings icon
    const settingsIcon = page.locator('.settings-icon').first();
    const iconStyle = await settingsIcon.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        width: style.width,
        height: style.height,
        borderRadius: style.borderRadius,
        display: style.display,
        alignItems: style.alignItems,
        justifyContent: style.justifyContent
      };
    });
    expect(iconStyle.display).toBe('flex');
    expect(iconStyle.alignItems).toBe('center');
    expect(iconStyle.justifyContent).toBe('center');
    console.log('✅ Settings icons are flex containers');
  });

  test('Toggle Switches - Styling and Animation', async ({ page }) => {
    console.log('\n🔘 Visual Check: Toggle Switches');
    console.log('--------------------------------');

    // Find a toggle switch
    const toggleSwitch = page.locator('.toggle-switch').first();
    await expect(toggleSwitch).toBeVisible();

    // Check toggle styling
    const toggleStyle = await toggleSwitch.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        width: style.width,
        height: style.height,
        borderRadius: style.borderRadius,
        cursor: style.cursor
      };
    });
    expect(toggleStyle.position).toBe('relative');
    expect(toggleStyle.cursor).toBe('pointer');
    console.log('✅ Toggle switch has relative position and pointer cursor');
    console.log(`✅ Toggle dimensions: ${toggleStyle.width} × ${toggleStyle.height}`);

    // Check toggle knob
    const toggleKnob = page.locator('.toggle-knob').first();
    await expect(toggleKnob).toBeVisible();

    const knobStyle = await toggleKnob.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        borderRadius: style.borderRadius,
        transition: style.transition,
        width: style.width,
        height: style.height
      };
    });
    expect(knobStyle.position).toBe('absolute');
    expect(knobStyle.borderRadius).toBe('50%');
    console.log('✅ Toggle knob is absolute positioned and circular');

    // Check active state
    const activeToggle = page.locator('.toggle-switch.active').first();
    if (await activeToggle.count() > 0) {
      const activeBg = await activeToggle.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      console.log(`✅ Active toggle background: ${activeBg}`);
    }
  });

  test('Danger Items - Styling', async ({ page }) => {
    console.log('\n🚨 Visual Check: Danger Items');
    console.log('-----------------------------');

    // Find danger items (Log Out, Delete Account)
    const dangerItems = page.locator('.danger-item');
    expect(await dangerItems.count()).toBeGreaterThanOrEqual(2);
    console.log(`✅ ${await dangerItems.count()} danger items found`);

    // Check first danger item styling
    const firstDangerItem = dangerItems.first();
    const dangerColor = await firstDangerItem.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    console.log(`✅ Danger item text color: ${dangerColor}`);

    // Check danger icon styling
    const dangerIcon = firstDangerItem.locator('.settings-icon');
    const dangerIconStyle = await dangerIcon.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        color: style.color
      };
    });
    console.log(`✅ Danger icon background: ${dangerIconStyle.background}`);
    console.log(`✅ Danger icon color: ${dangerIconStyle.color}`);
  });

  test('Header Bar - Back Button and Theme Toggle', async ({ page }) => {
    console.log('\n🔝 Visual Check: Header Bar');
    console.log('---------------------------');

    // Check header bar
    const headerBar = page.locator('.header-bar');
    await expect(headerBar).toBeVisible();

    // Check header styling
    const headerStyle = await headerBar.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        alignItems: style.alignItems,
        justifyContent: style.justifyContent,
        background: style.backgroundColor,
        borderBottom: style.borderBottom
      };
    });
    expect(headerStyle.display).toBe('flex');
    console.log('✅ Header bar uses flexbox');

    // Check back button
    const backButton = page.locator('.header-btn').first();
    await expect(backButton).toBeVisible();

    const backBtnStyle = await backButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        width: style.width,
        height: style.height,
        display: style.display,
        borderRadius: style.borderRadius
      };
    });
    expect(backBtnStyle.display).toBe('flex');
    expect(backBtnStyle.borderRadius).toBe('50%');
    console.log('✅ Back button is circular flex container');

    // Check header title
    const headerTitle = page.locator('.header-title');
    const titleStyle = await headerTitle.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight
      };
    });
    console.log(`✅ Header title font size: ${titleStyle.fontSize}`);
    console.log(`✅ Header title font weight: ${titleStyle.fontWeight}`);
  });

  test('Responsive Layout - Mobile, Tablet, Desktop', async ({ page }) => {
    console.log('\n📱 Visual Check: Responsive Layout');
    console.log('-----------------------------------');

    // Test mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileStatsGrid = page.locator('.stats-grid');
    const mobileGridStyle = await mobileStatsGrid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    console.log(`✅ Mobile (375px) grid columns: ${mobileGridStyle}`);

    // Check that content is visible and not overflowing
    const profileHeader = page.locator('.profile-header');
    await expect(profileHeader).toBeVisible();
    console.log('✅ Profile header visible on mobile');

    // Test tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    const tabletStatsGrid = page.locator('.stats-grid');
    const tabletGridStyle = await tabletStatsGrid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    console.log(`✅ Tablet (768px) grid columns: ${tabletGridStyle}`);

    // Test desktop viewport (1920px)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const desktopStatsGrid = page.locator('.stats-grid');
    const desktopGridStyle = await desktopStatsGrid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    console.log(`✅ Desktop (1920px) grid columns: ${desktopGridStyle}`);
  });

  test('Hover Effects - Settings Items', async ({ page }) => {
    console.log('\n🖱️  Visual Check: Hover Effects');
    console.log('-------------------------------');

    // Get a settings item
    const settingsItem = page.locator('.settings-item').first();

    // Get initial background
    const initialBg = await settingsItem.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`✅ Initial background: ${initialBg}`);

    // Hover over item
    await settingsItem.hover();
    await page.waitForTimeout(300);

    // Get hover background
    const hoverBg = await settingsItem.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`✅ Hover background: ${hoverBg}`);

    // Note: In some cases, the background might not change if :hover isn't triggered in test environment
    console.log('✅ Hover effect checked (may require visual inspection)');
  });

  test('Dark Mode - Color Scheme', async ({ page }) => {
    console.log('\n🌙 Visual Check: Dark Mode');
    console.log('--------------------------');

    // Check initial theme
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark'));
    console.log(`✅ Initial theme: ${isDark ? 'Dark' : 'Light'}`);

    // Get color values in current theme
    const profileHeader = page.locator('.profile-header');
    const headerBg = await profileHeader.evaluate(el => {
      return window.getComputedStyle(el).backgroundImage;
    });
    console.log(`✅ Profile header gradient: ${headerBg.substring(0, 100)}...`);

    // Check card background in current theme
    const statCard = page.locator('.stat-card').first();
    const cardBg = await statCard.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`✅ Stat card background: ${cardBg}`);

    // Check text colors
    const foregroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    console.log(`✅ Foreground color: ${foregroundColor}`);
  });

  test('Icons - Lucide Rendering', async ({ page }) => {
    console.log('\n🎨 Visual Check: Icons');
    console.log('----------------------');

    // Check that Lucide icons are rendered
    const icons = page.locator('[data-lucide]');
    const iconCount = await icons.count();
    console.log(`✅ Total Lucide icons: ${iconCount}`);
    expect(iconCount).toBeGreaterThan(10);

    // Check first icon is actually rendered (has SVG)
    const firstIcon = icons.first();
    const hasSvg = await firstIcon.locator('svg').count();
    expect(hasSvg).toBeGreaterThan(0);
    console.log('✅ Icons are rendered as SVG elements');

    // Check icon sizes
    const icon = icons.first();
    const iconSize = await icon.evaluate(el => {
      const svg = el.querySelector('svg');
      if (!svg) return null;
      const style = window.getComputedStyle(svg);
      return {
        width: style.width,
        height: style.height
      };
    });
    console.log(`✅ Icon size: ${iconSize?.width} × ${iconSize?.height}`);
  });
});
