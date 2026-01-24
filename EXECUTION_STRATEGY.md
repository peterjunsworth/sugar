# Execution Strategy - Screen Implementation

**Date:** January 23, 2026
**Approach:** Sub-agent delegation with QA iteration loops

---

## Execution Requirements

### Mandatory Rules

1. **Sub-agent Delegation:** Use Task tool for each major step, referencing relevant design files
2. **Global Components:** Identify and create reusable layout components first
3. **Progress Tracking:** Create `progress-{screen-name}.md` for each screen
4. **Non-Destructive:** Do NOT modify existing JSX pages, create new routes
5. **QA Loop:** After each screen implementation:
   - Write Playwright test plan
   - Execute tests using Playwright MCP
   - Fix issues
   - Re-test until all pass

---

## Global Component Architecture

### Layout Components (Phase 0 - Foundation)

```
src/components/layout/
├── MainLayout.tsx          # Authenticated app layout (sidebar + content)
├── LandingLayout.tsx       # Public pages layout (centered, full-width)
├── AuthLayout.tsx          # Auth pages layout (centered card)
├── Navbar.tsx              # Top navigation bar (mobile menu, theme toggle)
├── Sidebar.tsx             # Side navigation menu (dashboard, history, profile)
├── Footer.tsx              # Footer component (links, copyright)
└── WizardLayout.tsx        # Wizard pages layout (progress bar, steps)
```

### Provider Components

```
src/components/providers/
├── ThemeProvider.tsx       # Dark/light mode management
└── LayoutProvider.tsx      # Layout state (sidebar open/close)
```

### Shared UI Components

```
src/components/ui/
├── Button.tsx              # Button variants
├── Card.tsx                # Card container
├── Badge.tsx               # Status badges
├── Input.tsx               # Form input
├── Select.tsx              # Dropdown
├── Toggle.tsx              # Switch
├── Modal.tsx               # Dialog
├── Tabs.tsx                # Tab navigation
└── Icon.tsx                # Icon wrapper
```

---

## Execution Flow with Sub-Agents

### Phase 0: Foundation Setup

**Sub-Agent Tasks:**

1. **Task 0.1: Theme Integration**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/default_ui_theme.css`, `src/app/globals.css`, `tailwind.config.ts`
   - Action: Merge theme CSS, configure Tailwind
   - Report: `context/progress-foundation.md`

2. **Task 0.2: Global Layout Components**
   - Agent: general-purpose
   - Files: Design iterations (all HTML files for layout patterns)
   - Action: Create MainLayout, LandingLayout, AuthLayout, WizardLayout
   - Report: `context/progress-foundation.md`

3. **Task 0.3: Navigation Components**
   - Agent: general-purpose
   - Files: `chat_interface_1.html` (sidebar pattern), `landing_1.html` (navbar pattern)
   - Action: Create Navbar, Sidebar, Footer components
   - Report: `context/progress-foundation.md`

4. **Task 0.4: Theme Provider**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/THEME_TOGGLE_GUIDE.md`
   - Action: Implement ThemeProvider with localStorage persistence
   - Report: `context/progress-foundation.md`

5. **Task 0.5: Route Protection Middleware**
   - Agent: general-purpose
   - Files: `src/lib/auth/jwt.ts`
   - Action: Create middleware.ts for route protection
   - Report: `context/progress-foundation.md`

6. **Task 0.6: QA - Foundation Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Action: Test theme toggle, layouts render, middleware redirects
   - Report: `context/progress-foundation.md`
   - Loop until all tests pass

---

### Phase 1: Authentication Flow

#### Screen 1: Landing Page

**Sub-Agent Tasks:**

1. **Task 1.1.1: Component Extraction**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/landing_1.html`
   - Action: Extract HeroSection, FeaturesSection, HowItWorksSection, PricingSection components
   - Report: `context/progress-landing.md`

2. **Task 1.1.2: Page Route Creation**
   - Agent: general-purpose
   - Files: `landing_1.html`
   - Action: Create `src/app/(public)/landing/page.tsx` (NOT modifying existing page.tsx)
   - Report: `context/progress-landing.md`

3. **Task 1.1.3: Styling & Responsiveness**
   - Agent: general-purpose
   - Action: Apply Tailwind classes, test breakpoints
   - Report: `context/progress-landing.md`

4. **Task 1.1.4: QA - Landing Page Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Test Plan:
     - Hero section renders with CTA button
     - Features grid displays 3 columns (1 on mobile)
     - "Get Started" button navigates to /signup
     - "Sign In" link navigates to /login
     - Theme toggle works
     - Responsive design (mobile, tablet, desktop)
   - Report: `context/progress-landing.md`
   - Loop: Fix issues → Re-test → Pass

---

#### Screen 2: Signup Page

**Sub-Agent Tasks:**

1. **Task 1.2.1: Component Extraction**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/signup_1.html`
   - Action: Extract SignupForm, SocialLoginButtons components
   - Report: `context/progress-signup.md`

2. **Task 1.2.2: Page Route Creation**
   - Agent: general-purpose
   - Action: Create `src/app/(public)/signup/page.tsx`
   - Report: `context/progress-signup.md`

3. **Task 1.2.3: Form Validation**
   - Agent: general-purpose
   - Action: Implement validation (required fields, password match, email format)
   - Report: `context/progress-signup.md`

4. **Task 1.2.4: API Integration**
   - Agent: general-purpose
   - Files: `src/app/api/auth/register/route.ts`
   - Action: Connect form to existing API, handle success/error
   - Report: `context/progress-signup.md`

5. **Task 1.2.5: QA - Signup Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Test Plan:
     - Form renders with all fields
     - Validation shows errors for invalid inputs
     - Password match validation works
     - API call succeeds with valid data
     - Redirects to /setup/step-1 on success
     - Error messages display on API failure
   - Report: `context/progress-signup.md`
   - Loop: Fix → Re-test → Pass

---

#### Screen 3: Login Page

**Sub-Agent Tasks:**

1. **Task 1.3.1: Component Extraction**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/login_1.html`
   - Action: Extract LoginForm component, reuse SocialLoginButtons
   - Report: `context/progress-login.md`

2. **Task 1.3.2: Page Route Creation**
   - Agent: general-purpose
   - Action: Create `src/app/(public)/login/page.tsx`
   - Report: `context/progress-login.md`

3. **Task 1.3.3: API Integration + Conditional Redirect**
   - Agent: general-purpose
   - Files: `src/app/api/auth/login/route.ts`
   - Action: Login API, check onboardingCompleted, redirect accordingly
   - Report: `context/progress-login.md`

4. **Task 1.3.4: QA - Login Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Test Plan:
     - Form renders correctly
     - Validation works
     - API call succeeds with valid credentials
     - Redirects to /setup/step-1 if onboarding incomplete
     - Redirects to /welcome if onboarding complete
     - Remember me checkbox persists state
     - Error handling for wrong credentials
   - Report: `context/progress-login.md`
   - Loop: Fix → Re-test → Pass

---

#### Screen 4: Welcome Page

**Sub-Agent Tasks:**

1. **Task 1.4.1: Component Extraction**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/welcome_1.html`
   - Action: Extract WelcomeHero, QuickStatsCard components
   - Report: `context/progress-welcome.md`

2. **Task 1.4.2: Page Route Creation**
   - Agent: general-purpose
   - Action: Create `src/app/(protected)/welcome/page.tsx`
   - Report: `context/progress-welcome.md`

3. **Task 1.4.3: Mock Data Integration**
   - Agent: general-purpose
   - Action: Generate mock stats, personalization logic
   - Report: `context/progress-welcome.md`

4. **Task 1.4.4: QA - Welcome Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Test Plan:
     - Personalized greeting displays user name
     - Stats cards show realistic data
     - "Continue to Dashboard" button navigates to /dashboard
     - Protected route (redirects if not authenticated)
   - Report: `context/progress-welcome.md`
   - Loop: Fix → Re-test → Pass

---

### Phase 2: Onboarding Wizard

#### Screen 5-7: Setup Steps 1, 2, 3

**Pattern for each step:**

1. **Component Extraction** (sub-agent)
2. **Page Route Creation** (sub-agent)
3. **State Management** (wizard context)
4. **Validation & Navigation** (back/next buttons)
5. **QA Testing Loop** (Playwright MCP)

**Reports:
- `context/progress-**
- `context/progress-setup-step-1.md`
- `context/progress-setup-step-2.md`
- `context/progress-setup-step-3.md`

---

### Phase 3: Main Application

#### Screen 8: Dashboard

**Sub-Agent Tasks:**

1. **Task 3.1.1: Component Extraction**
   - Agent: general-purpose
   - Files: `.superdesign/design_iterations/chat_interface_1.html`, existing `src/components/chat/N8nChatInterface.tsx`
   - Action: Extract GlucoseHeroCard, QuickMetricsGrid components
   - Report: `context/progress-dashboard.md`

2. **Task 3.1.2: API Endpoints (Mock)**
   - Agent: general-purpose
   - Action: Create GET /api/glucose/latest, /api/meals/latest, /api/insulin/latest
   - Report: `context/progress-dashboard.md`

3. **Task 3.1.3: Page Route Creation**
   - Agent: general-purpose
   - Action: Create `src/app/(protected)/dashboard/page.tsx` (DO NOT modify existing page.tsx)
   - Report: `context/progress-dashboard.md`

4. **Task 3.1.4: QA - Dashboard Testing**
   - Agent: general-purpose (with Playwright MCP)
   - Test Plan:
     - Glucose hero card displays value with trend
     - Quick metrics show latest data
     - Chat interface functional
     - Sidebar navigation works
     - Protected route enforcement
     - Real-time updates (mock)
   - Report: `context/progress-dashboard.md`
   - Loop: Fix → Re-test → Pass

--- 

#### Screen 9: History

**Similar sub-agent pattern:**
- Extract TimelineView, TimelineEntry components
- Create GET /api/history endpoint (mock 100+ entries)
- Create `src/app/(protected)/dashboard/history/page.tsx`
- QA with Playwright (filtering, scrolling, entry types)
- Report: `context/progress-history.md`

---

#### Screen 10: Profile

**Similar sub-agent pattern:**
- Extract ProfileHeader, StatsGrid, SettingsSection components
- Create GET /api/user/profile, GET /api/user/stats endpoints
- Create `src/app/(protected)/dashboard/profile/page.tsx`
- QA with Playwright (edit mode, toggles, logout)
- Report: `context/progress-profile.md`

---

## QA Testing Strategy

### Playwright Test Structure

For each screen:

```typescript
// tests/{screen-name}.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should render hero section', async ({ page }) => {
    await page.goto('/landing');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to signup on CTA click', async ({ page }) => {
    await page.goto('/landing');
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/signup');
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/landing');
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).not.toHaveClass(/dark/);
  });

  // ... more tests
});
```

### QA Loop Process

1. **Write Test Plan** - Define all test cases
2. **Implement Tests** - Create Playwright specs
3. **Run Tests** - Execute via Playwright MCP
4. **Analyze Failures** - Review test results
5. **Fix Issues** - Correct implementation
6. **Re-run Tests** - Validate fixes
7. **Repeat** until 100% pass rate
8. **Report** in progress-{screen}.md

---

## Progress Reporting Template

### Format: `progress-{screen-name}.md`

```markdown
# Progress Report: {Screen Name}

**Screen:** {Name}
**Route:** {Path}
**Source:** {HTML file}
**Status:** {Not Started | In Progress | Testing | Complete}
**Started:** {Date}
**Completed:** {Date or N/A}

---

## Implementation Tasks

### Task 1: Component Extraction
- [ ] Component A extracted
- [ ] Component B extracted
- Status: {Done/In Progress/Blocked}
- Notes: ...

### Task 2: Page Route Creation
- [ ] Route file created at {path}
- [ ] Imports configured
- Status: {Done/In Progress/Blocked}
- Notes: ...

### Task 3: API Integration
- [ ] Endpoint A created/integrated
- [ ] Mock data implemented
- Status: {Done/In Progress/Blocked}
- Notes: ...

---

## QA Testing

### Test Plan
1. Test case 1: Description
2. Test case 2: Description
...

### Test Execution - Iteration 1
- Date: {Date}
- Status: {Pass/Fail}
- Passed: X/Y tests
- Failed Tests:
  - Test name: Error description
  - Test name: Error description

### Fixes Applied - Iteration 1
- Fix 1: Description
- Fix 2: Description

### Test Execution - Iteration 2
- Date: {Date}
- Status: {Pass/Fail}
- Passed: X/Y tests
- Failed Tests: ...

### Final Status
- ✅ All tests passed
- Date: {Date}
- Total iterations: X

---

## Issues & Resolutions

### Issue 1: {Title}
- Description: ...
- Resolution: ...
- Status: Resolved

---

## Screenshots

### Desktop
![Desktop view](path/to/screenshot)

### Mobile
![Mobile view](path/to/screenshot)

### Dark Mode
![Dark mode](path/to/screenshot)

---

## Notes
- Additional observations
- Performance considerations
- Accessibility notes
```

---

## File Organization

```
sugar/
├── src/
│   ├── app/
│   │   ├── (public)/              # New: Public routes
│   │   │   ├── landing/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (protected)/           # New: Protected routes
│   │   │   ├── welcome/
│   │   │   │   └── page.tsx
│   │   │   ├── setup/
│   │   │   │   ├── step-1/
│   │   │   │   ├── step-2/
│   │   │   │   └── step-3/
│   │   │   └── dashboard/
│   │   │       ├── page.tsx       # New dashboard
│   │   │       ├── history/
│   │   │       └── profile/
│   │   ├── api/                   # Keep existing, add new endpoints
│   │   ├── layout.tsx             # Keep existing
│   │   └── page.tsx               # Keep existing (don't modify)
│   ├── components/
│   │   ├── layout/                # New: Global layouts
│   │   ├── providers/             # New: Context providers
│   │   ├── ui/                    # New: Shared UI components
│   │   └── {existing}/            # Keep existing
│   └── middleware.ts              # New: Route protection
├── tests/                         # New: Playwright tests
│   ├── landing.spec.ts
│   ├── signup.spec.ts
│   ├── login.spec.ts
│   └── ...
├── context/                       # Progress tracking documents
│   │   ├── progress-foundation.md         # New: Progress reports
├── context/                       # Progress tracking documents
│   │   ├── progress-landing.md
├── context/                       # Progress tracking documents
│   │   ├── progress-signup.md
├── ...
├── IMPLEMENTATION_PLAN.md         # Created
├── SCREEN_IMPLEMENTATION_PROGRESS.md  # Created
├── EXECUTION_STRATEGY.md          # This file
└── playwright.config.ts           # New: Playwright config
```

---

## Next Steps

1. **Confirm Strategy** - User approval of execution approach
2. **Start Phase 0** - Foundation setup with sub-agents
3. **Proceed Sequentially** - Phase 0 → 1 → 2 → 3
4. **QA After Each Screen** - Test loop until pass
5. **Report Progress** - Update tracking files continuously

---

**Ready to begin execution!**
