# BlackWoods Creative - Critical Fixes Action Plan
*Emergency Remediation Plan - December 2024*

## 🚨 **PHASE 1: EMERGENCY FIXES (24 Hours)**

### **1.1 Fix ESLint Errors (2-3 hours)**

**File: `src/app/__tests__/layout.test.tsx`**
```typescript
// Line 7: Fix any types
- return function mockDynamic(importFunc: any, options?: any) {
+ return function mockDynamic(importFunc: () => Promise<any>, options?: { loading?: () => JSX.Element }) {

// Line 26: Fix any type
- StructuredData: ({ metadata }: { metadata: any }) => (
+ StructuredData: ({ metadata }: { metadata: Record<string, unknown> }) => (
```

**File: `src/lib/utils/__tests__/performance-functions.test.ts`**
```typescript
// Line 463 & 646: Fix any types
- global.performance.memory = mockPerformance.memory as any;
+ global.performance.memory = mockPerformance.memory as Performance['memory'];
```

**File: `src/__tests__/middleware.test.ts`**
```typescript
// Line 36: Remove unused import
- import { Ratelimit } from '@upstash/ratelimit';

// Line 53: Fix any type
- } as any;
+ } as NextRequest;

// Line 71: Fix require statement
- const { config } = require('../middleware');
+ import { config } from '../middleware';
```

### **1.2 Fix Accessibility Issues (30 minutes)**

**File: `src/__tests__/accessibility.test.tsx`**
```typescript
// Line 109: Add alt text
- <img src="/test2.jpg" />
+ <img src="/test2.jpg" alt="" />
```

---

## 🔧 **PHASE 2: CRITICAL TEST FIXES (3-5 Days)**

### **2.1 Fix HomePage Tests - Remove Fake Implementations**

**Problem**: Tests expect content that doesn't exist in components.

**Current Issue**:
```typescript
// Test expects this:
expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();

// But component renders this:
<section data-testid="hero-section">Hero Section</section>
```

**Solution**: Update tests to match actual component behavior OR update components to match test expectations.

**Recommended Approach**: Update components to render expected content.

### **2.2 Fix Performance Tests - Add Browser API Mocks**

**File: `src/lib/utils/__tests__/performance-functions.test.ts`**

**Add Missing Mocks**:
```typescript
// Add to jest.setup.js
global.performance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
  },
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();
```

---

## 🎯 **PHASE 3: COMPONENT-TEST ALIGNMENT (2-3 Days)**

### **3.1 Update Hero Section Component**

**Current**: Renders "Hero Section" placeholder  
**Expected**: Should render "BlackWoods Creative" text

**File: `src/components/sections/HeroSection.tsx`**
```typescript
// Update to include expected text content
export function HeroSection() {
  return (
    <section data-testid="hero-section">
      <h1>BlackWoods Creative</h1>
      {/* Add other expected content */}
    </section>
  );
}
```

### **3.2 Update Vision Section Component**

**Current**: Renders "Vision Section" placeholder  
**Expected**: Should render "Experience the Difference" text

### **3.3 Update Portfolio Section Component**

**Current**: Renders "Portfolio Section" placeholder  
**Expected**: Should render "Our Portfolio" text

---

## 🔍 **PHASE 4: COMPREHENSIVE AUDIT (1-2 Days)**

### **4.1 Identify All Fake Tests**

**Search Pattern**:
```bash
# Find tests that might be testing mocks instead of real components
grep -r "mock" src/**/*.test.tsx
grep -r "jest.mock" src/**/*.test.tsx
```

### **4.2 Verify Component Implementations**

**For each component**:
1. Run the test
2. Check what content the test expects
3. Verify the actual component renders that content
4. Fix mismatches

---

## 📋 **VERIFICATION CHECKLIST**

### **Build Verification**
- [ ] `npm run build` completes without errors
- [ ] No ESLint errors in output
- [ ] TypeScript compilation successful

### **Test Verification**  
- [ ] All tests pass: `npm test`
- [ ] No fake test implementations remain
- [ ] Components render expected content
- [ ] Performance tests have proper mocks

### **Component Verification**
- [ ] HomePage renders "BlackWoods Creative"
- [ ] VisionSection renders "Experience the Difference"  
- [ ] PortfolioSection renders "Our Portfolio"
- [ ] All sections have proper content, not placeholders

---

## ⏱️ **TIMELINE SUMMARY**

| Phase | Duration | Priority | Status |
|-------|----------|----------|---------|
| ESLint Fixes | 2-3 hours | CRITICAL | ⏳ Pending |
| Accessibility | 30 minutes | HIGH | ⏳ Pending |
| Test Infrastructure | 1-2 days | CRITICAL | ⏳ Pending |
| Component Alignment | 2-3 days | HIGH | ⏳ Pending |
| Comprehensive Audit | 1-2 days | MEDIUM | ⏳ Pending |

**Total Estimated Time**: 5-8 days for complete remediation

---

## 🚫 **DEPLOYMENT BLOCKERS**

**DO NOT DEPLOY until ALL of the following are resolved:**

1. ✅ All 9 ESLint errors fixed
2. ✅ All 19 failing tests pass
3. ✅ Components render expected content (not placeholders)
4. ✅ Performance monitoring system functional
5. ✅ Build process stable and consistent
6. ✅ No fake test implementations remain

**Only after ALL blockers are resolved should production deployment be considered.**
