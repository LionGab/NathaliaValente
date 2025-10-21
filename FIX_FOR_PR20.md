# Fix for PR #20 Build Error

## Problem
The build is failing with this error:
```
"onFID" is not exported by "node_modules/web-vitals/dist/web-vitals.js"
```

## Root Cause
PR #20 uses `onFID` from the `web-vitals` package, but `onFID` (First Input Delay) was deprecated in web-vitals v4.0+ and replaced with `onINP` (Interaction to Next Paint).

## Solution
Replace `onFID` with `onINP` in `src/services/monitoring.service.ts`

### Change Required:

**Line 6 - Old:**
```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
```

**Line 6 - New:**
```typescript
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
```

**Line 55 - Old:**
```typescript
  onFID(sendToAnalytics);
```

**Line 55 - New:**
```typescript
  onINP(sendToAnalytics);
```

### Additional Notes:

1. **onINP vs onFID**: 
   - FID (First Input Delay) measured only the first user interaction
   - INP (Interaction to Next Paint) measures all user interactions and is more comprehensive
   - INP is the recommended Core Web Vital as of 2024

2. **Update Comments** (Line 9):
   Change from:
   ```
   Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
   ```
   To:
   ```
   Tracks Core Web Vitals: LCP, INP, CLS, FCP, TTFB
   ```

3. **Update Thresholds Function** (Line 83):
   Change from:
   ```typescript
   FID: { good: 100, poor: 300 }, // First Input Delay
   ```
   To:
   ```typescript
   INP: { good: 200, poor: 500 }, // Interaction to Next Paint
   ```

## Testing
After applying this fix:
```bash
npm install
npm run build
```

Build should complete successfully.

## References
- [Web Vitals v4 Migration Guide](https://github.com/GoogleChrome/web-vitals/releases/tag/v4.0.0)
- [INP Documentation](https://web.dev/inp/)
