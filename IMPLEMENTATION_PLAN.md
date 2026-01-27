# Sugar App - Screen Implementation Plan

**Version:** 1.0
**Date:** January 23, 2026
**Project:** Transform design iteration HTML screens into Next.js 15 application

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Context](#project-context)
3. [Implementation Strategy](#implementation-strategy)
4. [Phase Breakdown](#phase-breakdown)
5. [Screen Implementation Details](#screen-implementation-details)
6. [Component Architecture](#component-architecture)
7. [API Services Plan](#api-services-plan)
8. [Styling Integration](#styling-integration)
9. [Progress Tracking](#progress-tracking)

---

## Executive Summary

This plan outlines the transformation of 10 HTML design iteration screens into a fully functional Next.js 15 application. The work builds upon the existing foundation (JWT auth, chat interface) and follows Next.js App Router patterns.

### Key Decisions

- **Authentication:** Continue using existing JWT pattern with lib/auth/jwt
- **Routing:** Next.js App Router with separate routes (/landing, /signup, etc.)
- **Styling:** Merge default_ui_theme.css into globals.css, use Tailwind utilities
- **Data:** Mock data for all endpoints during initial implementation
- **CGM Integration:** Mock device connections (UI only)
- **Component Strategy:** Incremental extraction per screen

### Design Files to Transform

Located in `.superdesign/design_iterations/`:

1. `landing_1.html` (404 lines) - Marketing landing page
2. `signup_1.html` (438 lines) - User registration
3. `login_1.html` (430 lines) - User login
4. `setup_wizard_step_1.html` (382 lines) - Onboarding step 1
5. `setup_wizard_step_1_2.html` (443 lines) - Onboarding step 2
6. `setup_wizard_step_1_2_3.html` (365 lines) - Onboarding step 3
7. `welcome_1.html` (436 lines) - Welcome screen
8. `chat_interface_1.html` (1027 lines) - Main dashboard ✅ Foundation exists
9. `history_1.html` (588 lines) - History timeline
10. `profile_1.html` (550 lines) - Profile & settings

**Total:** ~5,063 lines of HTML to transform

---

## Project Context

### Current State

**Existing Implementation:**
- ✅ Basic auth (JWT) - `src/app/api/auth/*`
- ✅ Chat interface foundation - `src/components/chat/N8nChatInterface.tsx`
- ✅ Simple dashboard - `src/app/page.tsx`
- ✅ MongoDB collections defined - `src/lib/db/mongodb.ts`
- ✅ CGM API routes (Dexcom, Libre, Eversense) - `src/app/api/cgm/*`

**File Structure:**
```
src/
├── app/
│   ├── api/          # API routes (auth, cgm, chat)
│   ├── layout.tsx
│   └── page.tsx      # Current simple dashboard
├── components/
│   ├── auth/         # AuthContext, AuthForm
│   ├── chat/         # Chat interfaces
│   └── dashboard/    # Dashboard component
├── lib/
│   ├── auth/         # JWT utilities
│   ├── cgm/          # CGM client libraries
│   ├── db/           # MongoDB connection
│   └── utils/        # Utility functions
└── types/
    └── index.ts      # TypeScript types
```

### Design System (default_ui_theme.css)

**Color Palette:**
- Primary: Teal/Green (`--p-primary-*`) for health
- Accent: Coral/Orange (`--accent-coral-*`) for food
- AI Personality: Purple (`--accent-purple-*`)
- Status: Success green, Warning amber, Danger red

**Dark/Light Mode:**
- Toggle via `html.dark` class
- CSS variables for adaptive colors
- Default: Dark mode

**Components:**
- Cards, buttons, forms, badges, timeline entries
- Lucide icons
- Responsive breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)

---

## Implementation Strategy

### Overall Approach

1. **Setup Phase:** Merge styling, create shared layout components
2. **Authentication Flow:** Public pages (landing, signup, login, welcome)
3. **Onboarding Wizard:** 3-step setup wizard
4. **Main Application:** Enhanced dashboard, history, profile
5. **Polish & Integration:** Dark mode toggle, routing logic, mock APIs

### Routing Structure

```
/                       → Landing page (public)
/signup                 → Registration (public)
/login                  → Login (public)
/welcome                → Welcome screen (post-auth/setup)
/dashboard              → Main chat interface (protected)
/dashboard/history      → History timeline (protected)
/dashboard/profile      → User profile (protected)
/setup/step-1           → Onboarding wizard step 1 (protected)
/setup/step-2           → Onboarding wizard step 2 (protected)
/setup/step-3           → Onboarding wizard step 3 (protected)
```

### Component Extraction Pattern

For each HTML file:
1. **Identify sections** using HTML comments
2. **Extract reusable components** (buttons, cards, forms)
3. **Create shared components** (Sidebar, Header, Layout)
4. **Build page-specific components** inline
5. **Add interactivity** (state, handlers)
6. **Style with Tailwind** (convert from theme CSS classes)

---

## Phase Breakdown

### Phase 0: Foundation Setup (Pre-Implementation)

**Goal:** Prepare codebase for screen transformations

**Tasks:**
1. Merge `default_ui_theme.css` into `src/app/globals.css`
   - Extract CSS variables (colors, spacing, typography)
   - Keep component utility classes (.btn, .card, .badge, etc.)
   - Preserve dark mode support

2. Create shared layout structure
   - `src/components/layout/RootLayout.tsx` - App wrapper with theme provider
   - `src/components/layout/AppShell.tsx` - Sidebar + main content for authenticated pages
   - `src/components/layout/Sidebar.tsx` - Navigation sidebar
   - `src/components/layout/Header.tsx` - Top header with theme toggle

3. Create theme provider
   - `src/components/providers/ThemeProvider.tsx` - Dark/light mode management
   - localStorage persistence
   - Initial detection (system preference)

4. Setup routing middleware
   - `src/middleware.ts` - Protect authenticated routes
   - Redirect logic (user logged in → /dashboard, not logged in → /landing)

**Deliverables:**
- ✅ Merged globals.css with theme variables
- ✅ Shared layout components
- ✅ Theme provider with toggle
- ✅ Route protection middleware

---

### Phase 1: Authentication Flow (Public Pages)

**Goal:** Implement landing, signup, login, and welcome screens

#### Screen 1.1: Landing Page (`landing_1.html` → `/`)

**Components to Extract:**
- `LandingHeader` - Logo, login link, theme toggle
- `HeroSection` - Main value prop with CTA
- `FeaturesSection` - 3-column feature grid with icons
- `HowItWorksSection` - Step-by-step process
- `PricingSection` - Pricing cards
- `CTASection` - Final call-to-action
- `LandingFooter` - Links, copyright

**HTML Structure:**
```html
<!-- Gradient background with animated blobs -->
<!-- Header: Logo + "Sign In" link -->
<!-- Hero: Title + subtitle + "Get Started" CTA -->
<!-- Features: 3 cards (AI Assistant, Smart Tracking, CGM Integration) -->
<!-- How It Works: 4 steps with icons -->
<!-- Pricing: 2 cards (Free vs Premium) -->
<!-- CTA: "Start Your Journey" -->
<!-- Footer: Links + copyright -->
```

**Key Interactions:**
- "Get Started" → `/signup`
- "Sign In" → `/login`
- Theme toggle (sun/moon icon)

**Implementation Notes:**
- Use Next.js Image for optimization
- Animate gradient blobs with CSS keyframes
- Responsive: Stack columns on mobile
- Use Lucide icons: `droplet`, `bot`, `activity`, `zap`, `check`

**File:** `src/app/(public)/page.tsx`

---

#### Screen 1.2: Signup Page (`signup_1.html` → `/signup`)

**Components to Extract:**
- `SignupForm` - Email/password registration form
- `SocialLoginButtons` - Google, Apple buttons
- `AuthPageLayout` - Centered card layout for auth pages

**HTML Structure:**
```html
<!-- Centered card with gradient background -->
<!-- Logo + "Create Account" title -->
<!-- Form: Name, Email, Password, Confirm Password -->
<!-- Social login buttons (Google, Apple) -->
<!-- Terms checkbox -->
<!-- "Sign Up" button -->
<!-- "Already have an account? Sign in" link -->
```

**Form Fields:**
- Full Name (text, required)
- Email (email, required)
- Password (password, required, min 8 chars)
- Confirm Password (password, must match)
- Terms & Conditions (checkbox, required)

**API Endpoint:**
- `POST /api/auth/register` (existing)
- Returns: JWT token + user object

**On Success:**
- Save JWT to localStorage
- Update AuthContext
- Redirect to `/setup/step-1`

**File:** `src/app/(public)/signup/page.tsx`

---

#### Screen 1.3: Login Page (`login_1.html` → `/login`)

**Components to Extract:**
- `LoginForm` - Email/password login form
- Reuse `SocialLoginButtons`, `AuthPageLayout`

**HTML Structure:**
```html
<!-- Centered card with gradient background -->
<!-- Logo + "Welcome Back" title -->
<!-- Form: Email, Password -->
<!-- "Remember me" checkbox + "Forgot password?" link -->
<!-- Social login buttons (Google, Apple) -->
<!-- "Sign In" button -->
<!-- "Don't have an account? Sign up" link -->
```

**Form Fields:**
- Email (email, required)
- Password (password, required)
- Remember Me (checkbox)

**API Endpoint:**
- `POST /api/auth/login` (existing)
- Returns: JWT token + user object

**On Success:**
- Save JWT to localStorage
- Update AuthContext
- Check if user has completed onboarding:
  - If `user.onboardingCompleted === false` → `/setup/step-1`
  - If `user.onboardingCompleted === true` → `/welcome`

**File:** `src/app/(public)/login/page.tsx`

---

#### Screen 1.4: Welcome Screen (`welcome_1.html` → `/welcome`)

**Components to Extract:**
- `WelcomeHero` - Personalized greeting with illustration
- `QuickStatsCard` - User stats summary
- `QuickActionsButtons` - CTA buttons

**HTML Structure:**
```html
<!-- Gradient background with centered content -->
<!-- Personalized greeting: "Welcome back, {Name}!" or "Welcome, {Name}!" -->
<!-- Subtitle with current glucose status (if available) -->
<!-- Quick stats cards: Days active, Entries logged, Average glucose -->
<!-- "Continue to Dashboard" button -->
<!-- "Review Profile" link -->
```

**Display Logic:**
- First login after signup: "Welcome, {Name}! Let's get started."
- Returning user: "Welcome back, {Name}! Here's your quick summary."
- Show glucose trend if recent data available

**Mock Data:**
- Days Active: Calculate from user.createdAt
- Entries Logged: Random 5-20 for demo
- Average Glucose: Random 110-140 mg/dL

**On "Continue":**
- Redirect to `/dashboard`

**File:** `src/app/(protected)/welcome/page.tsx`

---

### Phase 2: Onboarding Wizard

**Goal:** 3-step setup wizard for first-time users

**Shared Components:**
- `WizardLayout` - Progress indicator, back/next buttons
- `WizardProgressBar` - Shows current step (1/3, 2/3, 3/3)

#### Screen 2.1: Setup Step 1 (`setup_wizard_step_1.html` → `/setup/step-1`)

**Purpose:** Collect personal health information

**Form Sections:**
1. **Personal Info**
   - Age (number input, required)
   - Weight (number + unit selector: lbs/kg)

2. **Diabetes Type** (radio buttons, required)
   - Type 1 Diabetes
   - Type 2 Diabetes
   - Prediabetes
   - Gestational Diabetes

3. **Glucose Targets** (number inputs with units)
   - Target Range Low (mg/dL or mmol/L)
   - Target Range High
   - Unit preference (mg/dL or mmol/L)

**HTML Structure:**
```html
<!-- Wizard layout: Progress (1/3) + Back button -->
<!-- Title: "Let's personalize your experience" -->
<!-- Form: Age, Weight (with unit toggle) -->
<!-- Diabetes type radio cards (large, icon-based) -->
<!-- Glucose target inputs (low/high with unit selector) -->
<!-- "Next" button (validates before proceeding) -->
```

**Validation:**
- Age: 1-120
- Weight: > 0
- Diabetes type: Required
- Glucose targets: Low < High

**On Next:**
- Save to temporary state (React Context or localStorage)
- Navigate to `/setup/step-2`

**File:** `src/app/(protected)/setup/step-1/page.tsx`

---

#### Screen 2.2: Setup Step 2 (`setup_wizard_step_1_2.html` → `/setup/step-2`)

**Purpose:** Select glucose monitoring device

**Options:**
1. **Dexcom G6/G7** (OAuth required)
2. **Freestyle Libre** (LibreView login)
3. **Eversense** (OAuth required)
4. **Manual Entry** (no connection)

**HTML Structure:**
```html
<!-- Wizard layout: Progress (2/3) + Back button -->
<!-- Title: "How do you track glucose?" -->
<!-- Device selection cards (large, icon-based) -->
<!-- Each card: Device logo/icon + name + "Connect" or "Select" button -->
<!-- "Skip for now" link -->
<!-- "Next" button (active if device selected) -->
```

**Interaction:**
- Click device card → Highlight selected
- "Connect" button → Show info modal (mock connection for now)
- "Skip" → Select "Manual Entry" automatically

**Mock Connection:**
- Show modal: "Connection successful! We'll sync your data shortly."
- In real implementation: Trigger OAuth flow

**On Next:**
- Save device preference to state
- Navigate to `/setup/step-3`

**File:** `src/app/(protected)/setup/step-2/page.tsx`

---

#### Screen 2.3: Setup Step 3 (`setup_wizard_step_1_2_3.html` → `/setup/step-3`)

**Purpose:** Permissions and final setup

**Permissions:**
1. **Notifications** (toggle) - Glucose alerts
2. **Health Data Access** (toggle) - For Apple Health/Google Fit
3. **Location** (toggle) - For activity tracking

**HTML Structure:**
```html
<!-- Wizard layout: Progress (3/3) + Back button -->
<!-- Title: "Set up permissions" -->
<!-- Permission cards with toggle switches -->
<!-- Each: Icon + title + description + toggle -->
<!-- "Optional" badges for non-required permissions -->
<!-- "Finish Setup" button -->
```

**Default State:**
- Notifications: ON (recommended for alerts)
- Health Data: OFF (optional)
- Location: OFF (optional)

**On Finish:**
- Collect all wizard data (steps 1, 2, 3)
- Call API: `POST /api/user/setup` (create this endpoint)
- Mark user as onboarded: `user.onboardingCompleted = true`
- Redirect to `/welcome`

**File:** `src/app/(protected)/setup/step-3/page.tsx`

---

### Phase 3: Main Application Screens

**Goal:** Build core dashboard, history, and profile pages

#### Screen 3.1: Dashboard/Chat Interface (`chat_interface_1.html` → `/dashboard`)

**Status:** ✅ Foundation exists (`src/app/page.tsx` + `N8nChatInterface.tsx`)

**Enhancement Plan:**

1. **Update Layout**
   - Use `AppShell` with sidebar
   - Add glucose hero card above chat
   - Add quick metrics cards

2. **Components to Add:**
   - `GlucoseHeroCard` - Large current glucose display with trend
   - `QuickMetricsGrid` - 3 cards (Last Meal, Last Insulin, Activity)
   - `ChatMessages` - Scrollable message area
   - `ChatInput` - Fixed bottom input with send button

**HTML Structure:**
```html
<!-- App Shell: Sidebar + Main Content -->
<!-- Header: "Dashboard" title + theme toggle + menu icon (mobile) -->

<!-- Glucose Hero Card -->
<!-- Large: 145 mg/dL with trend arrow (up/down/stable) -->
<!-- Color: Green (in-range), Yellow (warning), Red (critical) -->
<!-- "Last reading: 5 minutes ago" -->

<!-- Quick Metrics Grid (3 columns) -->
<!-- 1. Last Meal: "Pizza - 2 hours ago" -->
<!-- 2. Last Insulin: "5 units Humalog - 2.5 hours ago" -->
<!-- 3. Activity: "No recent exercise" -->

<!-- Chat Messages Area (scrollable) -->
<!-- AI messages (left, purple avatar) -->
<!-- User messages (right, no avatar) -->

<!-- Chat Input (fixed bottom) -->
<!-- Text input + Send button -->
<!-- "Ask me anything or log your data..." placeholder -->
```

**New Mock Endpoints:**
- `GET /api/glucose/latest` - Latest glucose reading
- `GET /api/meals/latest` - Last meal entry
- `GET /api/insulin/latest` - Last insulin dose
- `GET /api/exercise/latest` - Recent exercise

**Enhancements:**
- Real-time glucose updates (every 5 min if CGM connected)
- Trend indicator (up/down/stable arrow)
- Color-coded status (green: 70-180 mg/dL, yellow: outside range, red: critical)

**Files:**
- `src/app/(protected)/dashboard/page.tsx`
- `src/components/dashboard/GlucoseHeroCard.tsx`
- `src/components/dashboard/QuickMetricsGrid.tsx`
- `src/components/chat/ChatMessage.tsx`

---

#### Screen 3.2: History Page (`history_1.html` → `/dashboard/history`)

**Purpose:** View timeline of logged entries (meals, glucose, exercise)

**Components to Extract:**
- `HistoryTabs` - Tab navigation (All, Meals, Glucose, Exercise)
- `TimelineView` - Chronological list of entries
- `TimelineEntry` - Individual entry card
- `DateSeparator` - "Today", "Yesterday", date headers

**HTML Structure:**
```html
<!-- App Shell: Sidebar + Main Content -->
<!-- Header: "History" title -->

<!-- Tab Navigation -->
<!-- Tabs: All | Meals | Glucose | Exercise -->

<!-- Timeline View (scrollable) -->
<!-- Date Separator: "Today" -->
<!-- Entry: 2:30 PM - Meal - Pizza (60g carbs) -->
<!-- Entry: 2:00 PM - Insulin - 5 units Humalog -->
<!-- Entry: 12:15 PM - Glucose - 145 mg/dL ↑ -->
<!-- Date Separator: "Yesterday" -->
<!-- Entry: 7:45 PM - Exercise - 30 min walk -->
<!-- ... -->

<!-- Empty State (if no entries) -->
<!-- "No entries yet. Start by chatting with your assistant!" -->
```

**Timeline Entry Types:**

1. **Meal Entry**
   - Icon: 🍽️ (utensils)
   - Badge: "Meal" (coral)
   - Content: Food name + carbs
   - Example: "Pizza - 60g carbs"

2. **Glucose Reading**
   - Icon: 💧 (droplet)
   - Badge: "Glucose" (primary)
   - Content: Value + trend + source
   - Example: "145 mg/dL ↑ (Dexcom)"

3. **Insulin Dose**
   - Icon: 💉 (syringe, use lucide "droplet" styled)
   - Badge: "Insulin" (purple)
   - Content: Amount + type + delivery
   - Example: "5 units Humalog (bolus)"

4. **Exercise**
   - Icon: 🏃 (activity)
   - Badge: "Exercise" (green)
   - Content: Activity + duration
   - Example: "Running - 30 minutes"

**Mock Endpoint:**
- `GET /api/history?type=all&limit=50&offset=0`
- Query params: `type` (all, meals, glucose, insulin, exercise), `limit`, `offset`
- Returns: Array of entries with `{ type, timestamp, data }`

**Filtering:**
- "All" - Show all entry types mixed
- "Meals" - Only meal entries
- "Glucose" - Only glucose readings
- "Exercise" - Only exercise activities

**Files:**
- `src/app/(protected)/dashboard/history/page.tsx`
- `src/components/history/TimelineView.tsx`
- `src/components/history/TimelineEntry.tsx`

---

#### Screen 3.3: Profile Page (`profile_1.html` → `/dashboard/profile`)

**Purpose:** User profile, stats, settings, logout

**Sections:**

1. **Profile Header**
   - Avatar (initials)
   - Name + email
   - "Edit Profile" button

2. **Quick Stats** (4 cards)
   - Time in Range (% of readings 70-180 mg/dL)
   - Average Glucose
   - Total Entries
   - Days Active

3. **Personal Information** (collapsible section)
   - Age, Weight, Diabetes Type
   - "Edit" button

4. **Health Settings** (collapsible section)
   - Glucose Targets (low/high)
   - Unit Preference (mg/dL or mmol/L)
   - CGM Device
   - "Edit" button

5. **App Preferences** (collapsible section)
   - Theme (Light/Dark toggle)
   - Notifications (toggle)
   - Language (dropdown)

6. **Account Actions**
   - "Change Password" button
   - "Log Out" button (red, destructive)

**HTML Structure:**
```html
<!-- App Shell: Sidebar + Main Content -->
<!-- Header: "Profile" title -->

<!-- Profile Header -->
<!-- Avatar circle with initials -->
<!-- Name + email + "Edit" button -->

<!-- Stats Grid (2x2 on desktop, 1 col on mobile) -->
<!-- Card: Time in Range - "78%" -->
<!-- Card: Avg Glucose - "142 mg/dL" -->
<!-- Card: Total Entries - "247" -->
<!-- Card: Days Active - "18 days" -->

<!-- Collapsible Sections -->
<!-- Personal Info: Age, Weight, Type + Edit -->
<!-- Health Settings: Targets, Units, Device + Edit -->
<!-- App Preferences: Theme toggle, Notifications, Language -->

<!-- Account Actions -->
<!-- "Change Password" button -->
<!-- "Log Out" button -->
```

**Mock Endpoints:**
- `GET /api/user/profile` - User profile data
- `GET /api/user/stats` - Calculated stats (TIR, avg glucose, etc.)
- `PATCH /api/user/profile` - Update profile
- `PATCH /api/user/settings` - Update settings

**Interactions:**
- "Edit Profile" → Modal or inline edit mode
- Collapsible sections → Expand/collapse on click
- Theme toggle → Update HTML class + localStorage
- "Log Out" → Clear auth token, redirect to `/landing`

**Files:**
- `src/app/(protected)/dashboard/profile/page.tsx`
- `src/components/profile/StatsGrid.tsx`
- `src/components/profile/SettingsSection.tsx`

---

## Component Architecture

### Shared Components Library

**Layout Components:**
```
src/components/layout/
├── AppShell.tsx          # Sidebar + main content wrapper
├── Sidebar.tsx           # Navigation sidebar
├── Header.tsx            # Page header with title, actions
├── AuthLayout.tsx        # Centered card for auth pages
└── WizardLayout.tsx      # Wizard with progress bar
```

**UI Components:**
```
src/components/ui/
├── Button.tsx            # Primary, outline, ghost variants
├── Card.tsx              # Base card component
├── Badge.tsx             # Status badges (meal, glucose, etc.)
├── Input.tsx             # Form input with label
├── Select.tsx            # Dropdown select
├── Toggle.tsx            # Switch/toggle input
├── Modal.tsx             # Modal dialog
├── Tabs.tsx              # Tab navigation
├── Icon.tsx              # Lucide icon wrapper
└── ThemeToggle.tsx       # Dark/light mode toggle button
```

**Feature Components:**
```
src/components/
├── dashboard/
│   ├── GlucoseHeroCard.tsx
│   ├── QuickMetricsGrid.tsx
│   └── MetricCard.tsx
├── history/
│   ├── TimelineView.tsx
│   ├── TimelineEntry.tsx
│   └── DateSeparator.tsx
├── profile/
│   ├── StatsGrid.tsx
│   ├── ProfileHeader.tsx
│   └── SettingsSection.tsx
├── onboarding/
│   ├── WizardProgress.tsx
│   ├── DeviceCard.tsx
│   └── PermissionCard.tsx
└── landing/
    ├── HeroSection.tsx
    ├── FeaturesGrid.tsx
    └── PricingCard.tsx
```

### Component Patterns

**Button Component Example:**
```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  className
}: ButtonProps) {
  const baseClasses = 'rounded-lg font-medium transition';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-border hover:bg-surface-hover',
    ghost: 'hover:bg-surface-hover',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**Card Component Example:**
```tsx
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`bg-card rounded-xl border border-border ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
```

---

## API Services Plan

### New Endpoints to Create

All endpoints return mock data for now. Follow existing patterns in `src/app/api/`.

#### User Setup Endpoint

**File:** `src/app/api/user/setup/route.ts`

```typescript
POST /api/user/setup
Body: {
  personalInfo: { age: number, weight: number, weightUnit: 'lbs' | 'kg' },
  diabetesType: 'type1' | 'type2' | 'prediabetes' | 'gestational',
  glucoseTargets: { low: number, high: number, unit: 'mg/dL' | 'mmol/L' },
  device: 'dexcom' | 'libre' | 'eversense' | 'manual',
  permissions: { notifications: boolean, healthData: boolean, location: boolean }
}
Response: { success: true, user: { ...userWithOnboardingComplete } }
```

**Implementation:**
- Validate inputs
- Update user document in MongoDB
- Set `onboardingCompleted: true`
- Return updated user object

---

#### User Profile Endpoints

**File:** `src/app/api/user/profile/route.ts`

```typescript
GET /api/user/profile
Response: {
  id, name, email, avatar,
  age, weight, weightUnit,
  diabetesType, glucoseTargets,
  device, permissions,
  createdAt, onboardingCompleted
}

PATCH /api/user/profile
Body: { age?, weight?, weightUnit?, name?, email? }
Response: { success: true, user: {...} }
```

---

#### User Stats Endpoint

**File:** `src/app/api/user/stats/route.ts`

```typescript
GET /api/user/stats
Query: ?days=7 (default: last 7 days)
Response: {
  timeInRange: number,      // % of readings 70-180 mg/dL
  averageGlucose: number,   // mg/dL
  totalEntries: number,     // All logged entries
  daysActive: number,       // Days since signup
  glucoseReadings: number,  // Count
  meals: number,            // Count
  insulinDoses: number,     // Count
  exercises: number         // Count
}
```

**Mock Implementation:**
- Return realistic random values
- `timeInRange`: 70-85%
- `averageGlucose`: 110-150 mg/dL
- `daysActive`: Calculate from user.createdAt

---

#### Latest Data Endpoints

**Files:**
- `src/app/api/glucose/latest/route.ts`
- `src/app/api/meals/latest/route.ts`
- `src/app/api/insulin/latest/route.ts`
- `src/app/api/exercise/latest/route.ts`

```typescript
GET /api/glucose/latest
Response: {
  value: number,        // mg/dL
  trend: 'up' | 'down' | 'stable',
  timestamp: Date,
  source: 'dexcom' | 'manual'
}

GET /api/meals/latest
Response: {
  name: string,
  carbs: number,
  timestamp: Date
}

GET /api/insulin/latest
Response: {
  amount: number,
  type: 'humalog' | 'novolog' | 'lantus',
  delivery: 'bolus' | 'basal',
  timestamp: Date
}

GET /api/exercise/latest
Response: {
  activity: string,
  duration: number,     // minutes
  timestamp: Date
}
```

---

#### History Timeline Endpoint

**File:** `src/app/api/history/route.ts`

```typescript
GET /api/history?type=all&limit=50&offset=0
Query:
  - type: 'all' | 'meals' | 'glucose' | 'insulin' | 'exercise'
  - limit: number (default: 50)
  - offset: number (default: 0)
Response: {
  entries: Array<{
    id: string,
    type: 'meal' | 'glucose' | 'insulin' | 'exercise',
    timestamp: Date,
    data: any  // Type-specific data
  }>,
  total: number,
  hasMore: boolean
}
```

**Mock Data Generation:**
- Create 100-200 mock entries
- Mix of meals, glucose, insulin, exercise
- Timestamps over last 7-14 days
- Sort by timestamp DESC

---

## Styling Integration

### Step 1: Merge default_ui_theme.css into globals.css

**Goal:** Combine existing theme with Tailwind setup

**File:** `src/app/globals.css`

```css
@import "tailwindcss";

/* ========================================
   Sugar App Theme - Glucose Harmony
   ======================================== */

/* CSS Variables from default_ui_theme.css */
:root {
  /* Primary Teal/Green Palette */
  --p-primary-50: #f0fdfa;
  --p-primary-100: #ccfbf1;
  /* ... full palette ... */

  /* Accent Colors */
  --accent-coral-500: #f97316;
  --accent-purple-500: #a855f7;
  --success-green: #10b981;
  --warning-amber: #f59e0b;
  --danger-red: #ef4444;

  /* Spacing, Typography, Radius */
  --spacing-xs: 0.25rem;
  /* ... */

  /* Light Mode */
  --background: #f0fdf4;
  --foreground: #0f172a;
  --card: #ffffff;
  --border: #d1fae5;
  /* ... */
}

/* Dark Mode */
html.dark {
  --background: #0a0f0e;
  --foreground: #ffffff;
  --card: #1a2623;
  --border: #2d3f3b;
  /* ... */
}

/* Theme-aware Tailwind Utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-primary: var(--p-primary-500);
  --color-primary-foreground: #ffffff;
  /* ... map all CSS vars to Tailwind ... */
}

/* Component Utility Classes (from default_ui_theme.css) */
.btn { /* base button styles */ }
.btn-primary { /* primary button */ }
.btn-outline { /* outline button */ }
.card { /* card styles */ }
.badge { /* badge styles */ }
/* ... preserve all utility classes ... */

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-family);
}
```

**Migration Steps:**
1. Copy all CSS variables from `default_ui_theme.css`
2. Map variables to Tailwind theme (use `@theme inline`)
3. Keep utility classes (.btn, .card, etc.) for gradual migration
4. Test dark mode toggle still works

---

### Step 2: Tailwind Config Extension

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        success: 'var(--success-green)',
        warning: 'var(--warning-amber)',
        danger: 'var(--danger-red)',
      },
      fontFamily: {
        sans: ['var(--font-family)'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

### Step 3: Using Styles in Components

**Approach:** Use Tailwind utilities that reference CSS variables

```tsx
// ✅ Good: Uses Tailwind utilities
<div className="bg-card text-foreground border border-border rounded-xl p-6">
  <h2 className="text-2xl font-bold text-primary">Title</h2>
  <p className="text-muted">Description</p>
</div>

// ✅ Also good: Mix Tailwind with utility classes during transition
<button className="btn btn-primary">Click me</button>

// ❌ Avoid: Inline styles or hard-coded colors
<div style={{ backgroundColor: '#ffffff' }}>...</div>
```

---

## Progress Tracking

### Implementation Tracking Document

**File:** `SCREEN_IMPLEMENTATION_PROGRESS.md`

```markdown
# Screen Implementation Progress

## Phase 0: Foundation Setup
- [ ] Merge default_ui_theme.css into globals.css
- [ ] Create AppShell layout component
- [ ] Create Sidebar component
- [ ] Create Header component
- [ ] Create ThemeProvider
- [ ] Setup route protection middleware

## Phase 1: Authentication Flow
- [ ] 1.1 Landing Page (/)
  - [ ] LandingHeader component
  - [ ] HeroSection component
  - [ ] FeaturesSection component
  - [ ] HowItWorksSection component
  - [ ] PricingSection component
  - [ ] CTASection component
  - [ ] LandingFooter component
  - [ ] Page route setup
  - [ ] Responsive design testing
  - [ ] Dark mode testing

- [ ] 1.2 Signup Page (/signup)
  - [ ] SignupForm component
  - [ ] SocialLoginButtons component
  - [ ] Form validation
  - [ ] API integration (POST /api/auth/register)
  - [ ] Success redirect logic
  - [ ] Error handling

- [ ] 1.3 Login Page (/login)
  - [ ] LoginForm component
  - [ ] Reuse SocialLoginButtons
  - [ ] Form validation
  - [ ] API integration (POST /api/auth/login)
  - [ ] Onboarding check logic
  - [ ] Success redirect logic

- [ ] 1.4 Welcome Screen (/welcome)
  - [ ] WelcomeHero component
  - [ ] QuickStatsCard component
  - [ ] Mock stats data
  - [ ] Personalization logic
  - [ ] Continue button action

## Phase 2: Onboarding Wizard
- [ ] 2.1 Setup Step 1 (/setup/step-1)
  - [ ] WizardLayout component
  - [ ] Personal info form section
  - [ ] Diabetes type selector
  - [ ] Glucose targets inputs
  - [ ] Form validation
  - [ ] State management (Context/localStorage)
  - [ ] Next button navigation

- [ ] 2.2 Setup Step 2 (/setup/step-2)
  - [ ] Device selection cards
  - [ ] DeviceCard component
  - [ ] Mock connection modal
  - [ ] Selection state
  - [ ] Back/Next navigation

- [ ] 2.3 Setup Step 3 (/setup/step-3)
  - [ ] Permission cards with toggles
  - [ ] PermissionCard component
  - [ ] Final data collection
  - [ ] API endpoint: POST /api/user/setup
  - [ ] Completion redirect

## Phase 3: Main Application
- [ ] 3.1 Dashboard (/dashboard)
  - [ ] GlucoseHeroCard component
  - [ ] QuickMetricsGrid component
  - [ ] Enhance chat interface
  - [ ] API: GET /api/glucose/latest
  - [ ] API: GET /api/meals/latest
  - [ ] API: GET /api/insulin/latest
  - [ ] Mock data integration
  - [ ] Trend indicator logic
  - [ ] Color-coded status

- [ ] 3.2 History (/dashboard/history)
  - [ ] HistoryTabs component
  - [ ] TimelineView component
  - [ ] TimelineEntry component (4 types)
  - [ ] DateSeparator component
  - [ ] API: GET /api/history
  - [ ] Mock timeline data (100+ entries)
  - [ ] Filtering logic
  - [ ] Empty state
  - [ ] Pagination

- [ ] 3.3 Profile (/dashboard/profile)
  - [ ] ProfileHeader component
  - [ ] StatsGrid component (4 cards)
  - [ ] SettingsSection component (collapsible)
  - [ ] API: GET /api/user/profile
  - [ ] API: GET /api/user/stats
  - [ ] API: PATCH /api/user/profile
  - [ ] Edit mode functionality
  - [ ] Theme toggle integration
  - [ ] Logout functionality

## API Endpoints Progress
- [ ] POST /api/user/setup
- [ ] GET /api/user/profile
- [ ] PATCH /api/user/profile
- [ ] GET /api/user/stats
- [ ] GET /api/glucose/latest
- [ ] GET /api/meals/latest
- [ ] GET /api/insulin/latest
- [ ] GET /api/exercise/latest
- [ ] GET /api/history

## Testing & Polish
- [ ] Dark mode works on all screens
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Route protection working
- [ ] Auth flow complete (signup → wizard → welcome → dashboard)
- [ ] Navigation between screens smooth
- [ ] Mock data realistic
- [ ] Loading states for API calls
- [ ] Error handling for failed requests
- [ ] Form validation working
- [ ] Accessibility (keyboard navigation, ARIA labels)
```

---

## Implementation Guidelines

### Code Quality Standards

1. **TypeScript Types:**
   - Define interfaces for all props
   - Type API responses
   - Use strict mode

2. **Component Structure:**
   - Single responsibility principle
   - Extract reusable logic to hooks
   - Keep components under 200 lines

3. **File Naming:**
   - Components: PascalCase (`Button.tsx`)
   - Routes: lowercase with hyphens (`/setup/step-1`)
   - Types: interfaces.ts or types.ts

4. **Error Handling:**
   - Try-catch in API routes
   - User-friendly error messages
   - Toast notifications for errors

5. **Performance:**
   - Use Next.js Image component
   - Lazy load heavy components
   - Memoize expensive calculations

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `superdesign-v1` - Current feature branch (already created)
- Feature branches: `screen/landing`, `screen/signup`, etc.

**Commit Messages:**
```
feat(landing): implement hero section with CTA
feat(signup): add signup form with validation
fix(dashboard): glucose card color coding
style(profile): improve stats grid layout
refactor(ui): extract Button component
docs: update implementation plan progress
```

**PR Structure:**
- One screen per PR (easier to review)
- Include screenshots/video
- Test dark mode and responsive design
- Update SCREEN_IMPLEMENTATION_PROGRESS.md

---

## Next Steps

### Immediate Actions (After Plan Approval)

1. **Review this plan** - Confirm approach, suggest changes
2. **Create SCREEN_IMPLEMENTATION_PROGRESS.md** - Start tracking
3. **Begin Phase 0** - Setup foundation (layouts, theme)
4. **Implement Phase 1** - Authentication flow (4 screens)
5. **Implement Phase 2** - Onboarding wizard (3 screens)
6. **Implement Phase 3** - Main app (3 screens)
7. **Test & Polish** - Dark mode, responsive, edge cases
8. **Final Review** - User acceptance testing

### Estimated Timeline

**Phase 0 (Foundation):** 4-6 hours
- Theme merge: 1 hour
- Layout components: 2 hours
- Theme provider: 1 hour
- Middleware: 1 hour

**Phase 1 (Auth Flow):** 8-10 hours
- Landing: 3 hours
- Signup: 2 hours
- Login: 2 hours
- Welcome: 2 hours

**Phase 2 (Onboarding):** 6-8 hours
- Step 1: 2.5 hours
- Step 2: 2.5 hours
- Step 3: 2 hours

**Phase 3 (Main App):** 12-15 hours
- Dashboard: 5 hours
- History: 4 hours
- Profile: 4 hours

**Testing & Polish:** 4-6 hours

**Total:** 34-45 hours (approximately 4-6 working days)

---

## Questions & Clarifications

**Before starting implementation, please confirm:**

1. ✅ Routing approach approved (separate routes for each screen)
2. ✅ Auth strategy confirmed (JWT with existing pattern)
3. ✅ Mock data acceptable for initial implementation
4. ✅ CGM connections will be mocked (UI only)
5. ✅ Styling approach approved (merge theme CSS to globals, use Tailwind)
6. Do you want to implement all screens, or prioritize certain phases?
7. Any specific components you want extracted first?
8. Should we implement real database operations or keep mocks throughout?

---

## Appendix

### Reference Files

**Design Files:**
- `.superdesign/design_iterations/*.html` - All HTML screens
- `.superdesign/design_iterations/default_ui_theme.css` - Theme CSS
- `.superdesign/UX_UI_SUMMARY.md` - UX documentation
- `.superdesign/DESIGN_GUIDELINES.md` - Design system spec

**Current Implementation:**
- `src/app/page.tsx` - Current simple dashboard
- `src/components/chat/N8nChatInterface.tsx` - Chat foundation
- `src/components/auth/AuthContext.tsx` - Auth context
- `src/lib/auth/jwt.ts` - JWT utilities
- `src/app/api/auth/*.ts` - Auth endpoints

**TypeScript Types:**
- `src/types/index.ts` - Existing type definitions

---

**End of Implementation Plan**

*This plan is a living document. Update as implementation progresses.*
