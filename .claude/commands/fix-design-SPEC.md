# /fix-design Command Specification

**Version:** 1.0.0
**Created:** January 23, 2026
**Purpose:** Automated command to fix style, structure, and design issues between SuperDesign HTML mockups and Next.js JSX implementations

---

## Command Overview

```bash
/fix-design <screen-name> [options]
```

**Description:**
Analyzes differences between a SuperDesign HTML mockup and its JSX implementation, identifies all structural and styling issues, fixes them to achieve pixel-perfect match, and validates with comprehensive tests.

**Examples:**
```bash
/fix-design login
/fix-design signup --headless
/fix-design landing --preserve-components
/fix-design welcome --quick-analysis
/fix-design setup-step-1 --auto-fix
```

---

## Command Arguments

### Required
- `<screen-name>` - Name of the screen to fix (e.g., `login`, `signup`, `landing`, `welcome`, `setup-step-1`)

### Optional Flags
- `--headless` - Run Playwright tests in headless mode (default: headed with slowMo)
- `--preserve-components` - Keep existing component structure instead of consolidating
- `--quick-analysis` - Perform fast scan (5-10 key issues) instead of comprehensive analysis
- `--auto-fix` - Skip approval step and apply fixes automatically
- `--test-only` - Only run tests without making changes
- `--skip-tests` - Apply fixes without running tests
- `--mockup=<path>` - Custom path to HTML mockup (auto-detected by default)

---

## Command Flow

### Phase 1: Discovery & Setup
1. **Resolve screen name to file paths**
   - Mockup: `.superdesign/design_iterations/{screen-name}_1.html`
   - JSX Implementation: Auto-detect from common patterns
     - `src/app/(public)/{screen-name}/page.tsx`
     - `src/app/(protected)/{screen-name}/page.tsx`
     - `src/components/{category}/{ScreenName}.tsx`

2. **Validate files exist**
   - If mockup missing: Error with suggestions
   - If JSX missing: Error with path list
   - If both exist: Proceed

3. **Create progress tracking file**
   - File: `progress-{screen-name}-fix.md`
   - Initialize with metadata (date, status, files involved)

### Phase 2: Comprehensive Analysis
**Tool:** Spawn sub-agent with `general-purpose` type

**Sub-agent receives:**
```typescript
{
  task: "analyze-design-differences",
  mockupPath: ".superdesign/design_iterations/login_1.html",
  jsxPath: "src/app/(public)/login/page.tsx",
  analysisDepth: "comprehensive", // or "quick" if --quick-analysis
  outputFile: "progress-login-fix-analysis.md"
}
```

**Sub-agent performs:**
1. **Read HTML Mockup** (complete file)
   - Parse HTML structure (tag hierarchy)
   - Extract all class names
   - Identify all text content
   - Note all icons/images
   - Document interactive elements
   - Map CSS structure

2. **Read JSX Implementation** (complete file + related components)
   - Parse JSX structure
   - Extract className usage
   - Identify components used
   - Note state management
   - Document props flow

3. **Structural Comparison**
   - Compare DOM hierarchy level-by-level
   - Identify missing/extra elements
   - Check nesting correctness
   - Validate semantic HTML

4. **Class Name Comparison**
   - List all classes in mockup
   - List all classes in JSX
   - Identify missing classes
   - Identify extra classes (not in mockup)
   - Check class name spelling/consistency

5. **Content Comparison**
   - Compare text content
   - Check placeholder text
   - Verify labels match
   - Check button text

6. **Icon/Asset Comparison**
   - List all icons in mockup (data-lucide attributes)
   - List all icons in JSX (Lucide React imports)
   - Identify missing icons
   - Check icon positioning (left/right of inputs, etc.)

7. **Interactive Element Comparison**
   - Forms: fields, validation, submission
   - Buttons: types, actions, styling
   - Links: hrefs, navigation
   - Toggles: password visibility, theme switching

8. **Generate Analysis Report**
   - Critical issues (breaks functionality)
   - Major issues (wrong structure)
   - Minor issues (styling tweaks)
   - Enhancement opportunities

**Sub-agent outputs:**
```markdown
# Design Analysis: {Screen Name}

## Critical Differences (Must Fix)
1. ❌ Missing header section with back button
2. ❌ Form inputs missing left icons (Mail, Lock)
3. ❌ Submit button missing arrow icon

## Major Differences (Structure)
1. ⚠️ Using AuthLayout wrapper instead of auth-container
2. ⚠️ Footer not in dedicated container

## Minor Differences (Styling)
1. 🔹 Button text "Sign In" vs "Log In"
2. 🔹 Different social button order

## CSS Classes Status
- Missing: auth-header, back-btn, form-input-icon (15 total)
- Extra: Some from AuthLayout (5 total)
- Correct: btn, form-input, submit-btn (20 total)

## Recommendations
1. Rewrite page to match mockup structure exactly
2. Add missing icons from Lucide React
3. Remove AuthLayout wrapper
4. Add missing CSS classes to globals.css
```

### Phase 3: User Review & Approval
**Display to user:**
```
📊 Analysis Complete for: {screen-name}

Found Issues:
  ❌ Critical: 3 (structure, missing elements)
  ⚠️  Major: 2 (wrong layout, wrong components)
  🔹 Minor: 2 (text, styling tweaks)

📄 Detailed report: progress-{screen-name}-fix-analysis.md

Would you like to proceed with fixes? [Y/n]
```

**If --auto-fix flag:** Skip approval, proceed directly

**If user says No:** Exit gracefully, save analysis

**If user says Yes:** Proceed to Phase 4

### Phase 4: Apply Fixes
**Tool:** Continue with same sub-agent (maintains context)

**Sub-agent receives:**
```typescript
{
  task: "apply-design-fixes",
  analysisFile: "progress-{screen-name}-fix-analysis.md",
  strategy: "rewrite", // or "incremental" if --preserve-components
  mockupPath: ".superdesign/design_iterations/login_1.html",
  jsxPath: "src/app/(public)/login/page.tsx",
  cssPath: "src/app/globals.css"
}
```

**Sub-agent performs:**

#### Step 4.1: CSS Preparation
1. Check if required CSS classes exist in `globals.css`
2. If missing:
   - Extract CSS from mockup `<style>` tag
   - Add to globals.css under comment `/* {Screen Name} Styles */`
   - Notify user of additions
3. Verify all CSS variables referenced exist

#### Step 4.2: Page Rewrite (Default Strategy)
1. **Read mockup HTML completely** (all lines)
2. **Create new JSX file structure:**
   ```tsx
   'use client';
   import { useState, FormEvent } from 'react';
   import { Icon1, Icon2, Icon3 } from 'lucide-react';
   import Link from 'next/link';

   export default function ScreenNamePage() {
     // State management

     // Event handlers

     // Render
     return (
       <div className="exact-class-from-mockup">
         {/* Exact structure from mockup */}
       </div>
     );
   }
   ```

3. **Convert HTML to JSX:**
   - Replace `class=` with `className=`
   - Replace `for=` with `htmlFor=`
   - Self-close void elements (`<input />`)
   - Replace `data-lucide` icons with Lucide React components
   - Add proper event handlers
   - Convert inline onclick to onClick with functions

4. **Add functionality:**
   - Form state management
   - Validation logic
   - API integration
   - Error handling
   - Loading states
   - Navigation (useRouter)

5. **Preserve working code:**
   - Keep API endpoints
   - Keep validation logic (update if needed)
   - Keep auth token handling

#### Step 4.3: Component Preservation (If --preserve-components)
1. Update each component file individually
2. Match component structure to mockup sections
3. Ensure props match new structure
4. Update parent page to compose correctly

#### Step 4.4: Icon Integration
1. Identify all icons needed from mockup
2. Add imports: `import { Icon1, Icon2 } from 'lucide-react'`
3. Place icons in correct positions:
   - Left icons: Inside `form-input-wrapper`, before input
   - Right icons: Inside `form-input-wrapper`, after input
   - Button icons: Inside button, after text
4. Use correct icon classes: `icon`, `icon-sm`, `icon-lg`

#### Step 4.5: Verification
1. **Build check:** Run `npm run build` to ensure no syntax errors
2. **File backup:** Save original file as `{filename}.backup.tsx`
3. **Update progress:** Document all changes in progress file

**Sub-agent outputs:**
```markdown
## Changes Applied

### Files Modified
1. src/app/(public)/login/page.tsx - Complete rewrite
2. src/app/globals.css - Added 250 lines of auth styles

### Structure Changes
- ✅ Removed AuthLayout wrapper
- ✅ Added auth-container structure
- ✅ Added auth-header with back button
- ✅ Added auth-footer container

### Icons Added
- ✅ ArrowLeft (back button)
- ✅ Mail (email input, left)
- ✅ Lock (password input, left)
- ✅ Eye/EyeOff (password toggle, right)
- ✅ ArrowRight (submit button, right)

### Functionality Preserved
- ✅ Form validation
- ✅ API integration
- ✅ Error handling
- ✅ Password toggle
- ✅ Remember me

### Build Status
✅ Build successful - no errors
```

### Phase 5: Create Visual Tests
**Tool:** Continue with same sub-agent

**Sub-agent receives:**
```typescript
{
  task: "create-visual-tests",
  screenName: "login",
  route: "/login",
  testFile: "tests/login-visual-check.spec.ts",
  headless: false, // or true if --headless
  slowMo: 1000
}
```

**Sub-agent creates:**
```typescript
// tests/{screen-name}-visual-check.spec.ts
import { test, expect } from '@playwright/test';

test.use({
  headless: false, // or from flag
  slowMo: 1000,
});

test.describe('{Screen Name} Visual Check', () => {
  test('should match mockup structure', async ({ page }) => {
    await page.goto('/{route}');
    console.log('✓ Navigated to /{route}');
    await page.waitForTimeout(2000);

    // Check all critical elements
    // ... (pattern from login-visual-check.spec.ts)
  });

  test('should have all icons visible', async ({ page }) => {
    // ... check each icon
  });

  test('should handle interactions correctly', async ({ page }) => {
    // ... test toggles, navigation, etc.
  });
});
```

**Test types created:**
1. **Structural test** - All elements present, correct hierarchy
2. **Visual test** - All icons, text, styling correct
3. **Interaction test** - Buttons work, navigation works, toggles work
4. **Responsive test** - Works on mobile/tablet/desktop
5. **Theme test** - Dark mode works correctly

### Phase 6: Execute Tests
**Tool:** Continue with same sub-agent

**Sub-agent performs:**
1. Start dev server if not running
2. Run Playwright tests:
   ```bash
   npx playwright test tests/{screen-name}-visual-check.spec.ts \
     --headed \
     --project=chromium \
     --reporter=list
   ```
3. Capture test output
4. If tests fail:
   - Analyze failure reasons
   - Document issues
   - If --auto-fix: attempt fixes and re-run
   - Otherwise: Report to user

**Test iteration loop (if failures):**
```
Run Tests → Analyze Failures → Apply Fixes → Run Tests Again
                                    ↑                |
                                    |←←←←←←←←←←←←←←←←|
                                    (until pass or max 3 iterations)
```

### Phase 7: Final Report
**Tool:** Sub-agent generates final report

**Creates:** `progress-{screen-name}-fix.md` (complete version)

```markdown
# {Screen Name} Fix - Complete Report

**Date:** {date}
**Status:** ✅ Complete | ⚠️ Partial | ❌ Failed
**Time:** {duration}

---

## Summary

Fixed {screen-name} page to match SuperDesign mockup exactly.

**Changes:**
- {X} files modified
- {Y} lines of CSS added
- {Z} icons added
- Structure: {X}% match
- Visual: {X}% match

---

## Before/After Comparison

### Structure
**Before:**
- Used AuthLayout wrapper
- Missing header section
- No input icons

**After:**
- Direct auth-container structure
- Header with back button + title
- All icons in correct positions

### Visual Elements
**Before:**
- Plain inputs without icons
- Generic button
- No back navigation

**After:**
- Inputs with Mail, Lock, Eye icons
- Button with arrow icon
- Back button navigates to /landing

---

## Test Results

### Initial Run
- ❌ 0/5 tests passing

### After Iteration 1
- ⚠️ 3/5 tests passing
- Fixed: Structure issues
- Remaining: Icon positioning

### After Iteration 2
- ✅ 5/5 tests passing

### Final Status
✅ All tests passing

**Test Suite:**
1. ✅ Structure matches mockup
2. ✅ All icons visible
3. ✅ Interactions work correctly
4. ✅ Responsive design
5. ✅ Theme toggle functional

---

## Files Modified

1. **src/app/(public)/{screen-name}/page.tsx**
   - Lines changed: {X}
   - Approach: Complete rewrite
   - Backup: {filename}.backup.tsx

2. **src/app/globals.css**
   - Lines added: {Y}
   - Section: {Screen Name} Styles (lines {A}-{B})

3. **tests/{screen-name}-visual-check.spec.ts**
   - New file: {X} lines
   - Test suites: {Y}

---

## Verification Checklist

### Structure ✅
- [x] Container matches mockup
- [x] Header section present
- [x] Content section structured correctly
- [x] Footer section present

### Icons ✅
- [x] All required icons imported
- [x] Icons positioned correctly (left/right)
- [x] Icon sizes correct (icon, icon-sm, icon-lg)

### Styling ✅
- [x] All CSS classes exist
- [x] Classes applied correctly
- [x] Dark mode works
- [x] Hover effects work

### Functionality ✅
- [x] Form submission works
- [x] Validation works
- [x] API integration works
- [x] Navigation works
- [x] Error handling works

### Responsive ✅
- [x] Mobile (375px): Looks correct
- [x] Tablet (768px): Looks correct
- [x] Desktop (1920px): Looks correct

---

## Known Issues

{List any remaining issues or intentional differences}

---

## Next Steps

1. Manual testing recommended
2. Test on real devices
3. Apply same pattern to: {next-screen}

---

## Pattern Applied

This fix followed the proven pattern from:
- Login page fix
- Signup page fix
- Landing page fix

**Success factors:**
1. Read mockup completely
2. Identify ALL differences
3. Rewrite to match exactly
4. Add all missing elements
5. Test comprehensively
6. Iterate until perfect

---

**Status:** Ready for production ✅
```

---

## Command Implementation

### File Structure
```
.claude/
├── commands/
│   └── fix-design/
│       ├── command.json           # Command metadata
│       ├── agent-prompt.md        # Sub-agent instructions
│       ├── templates/
│       │   ├── analysis.md        # Analysis report template
│       │   ├── progress.md        # Progress report template
│       │   └── test.spec.ts       # Test template
│       └── utils/
│           ├── path-resolver.ts   # Resolve screen paths
│           └── diff-analyzer.ts   # HTML/JSX comparison
```

### Command Definition
**File:** `.claude/commands/fix-design/command.json`

```json
{
  "name": "fix-design",
  "version": "1.0.0",
  "description": "Fix style and structure issues between SuperDesign HTML mockup and JSX implementation",
  "usage": "/fix-design <screen-name> [options]",
  "arguments": {
    "screen-name": {
      "type": "string",
      "required": true,
      "description": "Name of the screen to fix (e.g., login, signup, landing)"
    }
  },
  "flags": {
    "--headless": {
      "type": "boolean",
      "default": false,
      "description": "Run tests in headless mode"
    },
    "--preserve-components": {
      "type": "boolean",
      "default": false,
      "description": "Keep existing component structure"
    },
    "--quick-analysis": {
      "type": "boolean",
      "default": false,
      "description": "Perform fast scan instead of comprehensive analysis"
    },
    "--auto-fix": {
      "type": "boolean",
      "default": false,
      "description": "Skip approval and apply fixes automatically"
    },
    "--test-only": {
      "type": "boolean",
      "default": false,
      "description": "Only run tests without making changes"
    },
    "--skip-tests": {
      "type": "boolean",
      "default": false,
      "description": "Apply fixes without running tests"
    },
    "--mockup": {
      "type": "string",
      "description": "Custom path to HTML mockup"
    }
  },
  "examples": [
    "/fix-design login",
    "/fix-design signup --headless",
    "/fix-design landing --preserve-components",
    "/fix-design welcome --auto-fix"
  ]
}
```

---

## Sub-Agent Prompt Template

**File:** `.claude/commands/fix-design/agent-prompt.md`

```markdown
You are fixing the {SCREEN_NAME} page to EXACTLY match the SuperDesign HTML mockup.

## Your Mission
Transform the JSX implementation to PERFECTLY replicate the HTML mockup structure, styling, and functionality.

## Context
- Mockup: {MOCKUP_PATH}
- Current JSX: {JSX_PATH}
- Analysis: {ANALYSIS_FILE} (if exists)
- Strategy: {STRATEGY} (rewrite | incremental)
- Test Mode: {TEST_MODE} (headed | headless)

## Your Tasks

### Phase 1: Analysis (if not done)
1. Read mockup HTML completely
2. Read current JSX implementation
3. Compare structure, classes, content, icons
4. Generate comprehensive analysis report
5. Output to: {ANALYSIS_OUTPUT_FILE}

### Phase 2: Fix Application
1. Check/add CSS classes to globals.css
2. Rewrite/update JSX to match mockup exactly
3. Add all missing icons
4. Preserve functionality (validation, API, etc.)
5. Test build succeeds
6. Output changes to: {PROGRESS_FILE}

### Phase 3: Test Creation & Execution
1. Create visual test suite
2. Run tests ({TEST_MODE} mode)
3. If failures: analyze, fix, re-run (max 3 iterations)
4. Document results in: {PROGRESS_FILE}

### Phase 4: Final Report
1. Generate complete progress report
2. Document all changes
3. Create before/after comparison
4. List verification checklist results

## Critical Requirements

1. **Exact Structure Match:**
   - Same HTML hierarchy (div → div → element)
   - Same class names (class → className)
   - Same nesting depth

2. **All Icons:**
   - Import from lucide-react
   - Place in correct positions
   - Use correct sizes

3. **CSS Classes:**
   - Use exact names from mockup
   - Add to globals.css if missing
   - Never invent new classes

4. **Functionality:**
   - Preserve working code
   - Add 'use client' if needed
   - Keep API integration
   - Keep validation

5. **Testing:**
   - Create comprehensive tests
   - Run in {TEST_MODE} with slowMo: 1000
   - Iterate until all pass

## Success Criteria
- [x] Structure: 100% match to mockup
- [x] Visual: 100% match (all icons, text, styling)
- [x] Functionality: 100% working
- [x] Tests: 100% passing
- [x] Build: Success with no errors

## Output Format

Progress file should follow template at:
{TEMPLATE_PATH}/progress.md

Include:
- Summary of changes
- Before/after comparison
- Test results
- Verification checklist
- Files modified

Start with Phase 1 (analysis) unless analysis file already exists.
```

---

## Usage Examples

### Example 1: Basic Usage
```bash
/fix-design login
```

**Process:**
1. Finds mockup: `.superdesign/design_iterations/login_1.html`
2. Finds JSX: `src/app/(public)/login/page.tsx`
3. Analyzes differences
4. Shows user report
5. Asks for approval
6. Applies fixes
7. Runs tests in headed Chrome (slowMo: 1000)
8. Generates report: `progress-login-fix.md`

### Example 2: Auto-Fix Mode
```bash
/fix-design signup --auto-fix
```

**Process:**
1. Skips approval step
2. Applies fixes automatically
3. Runs tests
4. Reports results

### Example 3: Test Existing Implementation
```bash
/fix-design landing --test-only
```

**Process:**
1. Skips analysis and fixes
2. Creates tests if don't exist
3. Runs tests
4. Reports results (without changing code)

### Example 4: Quick Check
```bash
/fix-design welcome --quick-analysis
```

**Process:**
1. Does fast scan (5-10 key issues)
2. Shows summary
3. Exits (no fixes)

### Example 5: Custom Mockup Path
```bash
/fix-design custom-screen --mockup=./designs/custom.html
```

**Process:**
1. Uses specified mockup path
2. Auto-detects JSX
3. Proceeds normally

---

## Success Metrics

**Command succeeds when:**
1. ✅ All tests pass (100%)
2. ✅ Build succeeds with no errors
3. ✅ Visual comparison shows 100% match
4. ✅ All functionality preserved
5. ✅ Progress report generated

**Command reports partial success when:**
1. ⚠️ Most tests pass (80-99%)
2. ⚠️ Minor styling differences remain
3. ⚠️ Build succeeds with warnings

**Command fails when:**
1. ❌ Build fails
2. ❌ Critical tests fail
3. ❌ Cannot find mockup or JSX
4. ❌ Major structural issues remain

---

## Integration with Existing Workflow

### Before Command
1. Implement feature normally
2. Get basic functionality working

### Run Command
```bash
/fix-design <screen-name>
```

### After Command
1. Review generated report
2. Test manually
3. Commit changes
4. Move to next screen

### Batch Processing
```bash
/fix-design login --auto-fix
/fix-design signup --auto-fix
/fix-design landing --auto-fix --preserve-components
/fix-design welcome --auto-fix
/fix-design setup-step-1 --auto-fix
```

---

## Future Enhancements

### Version 1.1
- [ ] Screenshot comparison (visual diff)
- [ ] Accessibility testing (axe-core)
- [ ] Performance metrics (Lighthouse)
- [ ] Multi-browser testing (Firefox, WebKit)

### Version 1.2
- [ ] AI-powered suggestions for improvements
- [ ] Automatic screenshot capture
- [ ] Git integration (auto-commit, branches)
- [ ] Slack/Discord notifications

### Version 2.0
- [ ] Real-time preview mode
- [ ] Interactive fix selection
- [ ] Design token extraction
- [ ] Component library generation

---

## Troubleshooting

### Issue: "Mockup not found"
**Solution:** Specify custom path
```bash
/fix-design screen-name --mockup=path/to/file.html
```

### Issue: "Tests keep failing"
**Solution:** Check console errors
```bash
/fix-design screen-name --headless=false
# Watch browser for errors
```

### Issue: "Build fails after fix"
**Solution:** Revert and try incremental
```bash
git checkout src/app/path/to/page.tsx
/fix-design screen-name --preserve-components
```

### Issue: "Too many changes at once"
**Solution:** Use quick analysis first
```bash
/fix-design screen-name --quick-analysis
# Review, then:
/fix-design screen-name
```

---

**Status:** Ready for Implementation
**Next Step:** Create command handler and test on a new screen
