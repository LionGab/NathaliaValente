#!/bin/bash

# 🏥 Project Health Check
# Quick health assessment of ClubNath VIP project

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏥 ClubNath VIP - Health Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# 1. Dependencies
echo -e "${BLUE}📦 1. Checking dependencies...${NC}"
if [ -f package-lock.json ]; then
  if npm audit --audit-level=high > /dev/null 2>&1; then
    echo -e "${GREEN}✓ No high/critical vulnerabilities${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ Vulnerabilities found${NC}"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "${YELLOW}⚠ package-lock.json not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 2. Type Checking
echo -e "${BLUE}📝 2. Running type check...${NC}"
if npm run typecheck > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Type check passed${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ Type errors found${NC}"
  FAILED=$((FAILED + 1))
  npm run typecheck 2>&1 | head -10
fi
echo ""

# 3. Linting
echo -e "${BLUE}🔍 3. Running linter...${NC}"
if npm run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Linting passed${NC}"
  PASSED=$((PASSED + 1))
else
  LINT_WARNINGS=$(npm run lint 2>&1 | grep -c "warning" || echo "0")
  LINT_ERRORS=$(npm run lint 2>&1 | grep -c "error" || echo "0")
  
  if [ "$LINT_ERRORS" -gt 0 ]; then
    echo -e "${RED}✗ $LINT_ERRORS lint errors${NC}"
    FAILED=$((FAILED + 1))
  else
    echo -e "${YELLOW}⚠ $LINT_WARNINGS lint warnings${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# 4. Tests
echo -e "${BLUE}🧪 4. Running tests...${NC}"
if npm run test:run > /dev/null 2>&1; then
  TEST_COUNT=$(npm run test:run 2>&1 | grep -oP '\d+ passed' | head -1 | grep -oP '\d+')
  echo -e "${GREEN}✓ All tests passed ($TEST_COUNT tests)${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ Tests failed${NC}"
  FAILED=$((FAILED + 1))
  npm run test:run 2>&1 | tail -20
fi
echo ""

# 5. Build
echo -e "${BLUE}🏗️  5. Building project...${NC}"
if npm run build > /dev/null 2>&1; then
  BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
  echo -e "${GREEN}✓ Build successful (Size: $BUILD_SIZE)${NC}"
  PASSED=$((PASSED + 1))
  
  # Check build size
  BUILD_SIZE_MB=$(du -sm dist 2>/dev/null | cut -f1)
  if [ "$BUILD_SIZE_MB" -gt 10 ]; then
    echo -e "${YELLOW}⚠ Build size is large (${BUILD_SIZE_MB}MB)${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}✗ Build failed${NC}"
  FAILED=$((FAILED + 1))
fi
echo ""

# 6. Code Quality Metrics
echo -e "${BLUE}📊 6. Code quality metrics...${NC}"

# Count files
TS_FILES=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
TEST_FILES=$(find src tests -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" 2>/dev/null | wc -l)
echo "   TypeScript files: $TS_FILES"
echo "   Test files: $TEST_FILES"

# Test coverage ratio
if [ "$TS_FILES" -gt 0 ]; then
  COVERAGE_RATIO=$((TEST_FILES * 100 / TS_FILES))
  if [ "$COVERAGE_RATIO" -lt 20 ]; then
    echo -e "${RED}   ✗ Low test coverage (~${COVERAGE_RATIO}%)${NC}"
    FAILED=$((FAILED + 1))
  elif [ "$COVERAGE_RATIO" -lt 50 ]; then
    echo -e "${YELLOW}   ⚠ Moderate test coverage (~${COVERAGE_RATIO}%)${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}   ✓ Good test coverage (~${COVERAGE_RATIO}%)${NC}"
    PASSED=$((PASSED + 1))
  fi
fi

# Large files
LARGE_FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + 2>/dev/null | awk '$1 > 500 {count++} END {print count+0}')
if [ "$LARGE_FILES" -gt 0 ]; then
  echo -e "${YELLOW}   ⚠ $LARGE_FILES files > 500 lines${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}   ✓ No excessively large files${NC}"
fi
echo ""

# 7. Git Status
echo -e "${BLUE}📁 7. Checking git status...${NC}"
if [ -d .git ]; then
  UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
  if [ "$UNCOMMITTED" -gt 0 ]; then
    echo -e "${YELLOW}⚠ $UNCOMMITTED uncommitted changes${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}✓ Working directory clean${NC}"
    PASSED=$((PASSED + 1))
  fi
else
  echo -e "${YELLOW}⚠ Not a git repository${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 8. Environment Variables
echo -e "${BLUE}🔑 8. Checking environment configuration...${NC}"
if [ -f .env.example ]; then
  echo -e "${GREEN}✓ .env.example exists${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${YELLOW}⚠ .env.example not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

if [ -f .env ]; then
  echo -e "${YELLOW}⚠ .env file exists (ensure it's in .gitignore)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 9. Documentation
echo -e "${BLUE}📖 9. Checking documentation...${NC}"
REQUIRED_DOCS=("README.md" "CLAUDE.md")
MISSING_DOCS=0

for doc in "${REQUIRED_DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    MISSING_DOCS=$((MISSING_DOCS + 1))
  fi
done

if [ "$MISSING_DOCS" -eq 0 ]; then
  echo -e "${GREEN}✓ All required documentation present${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${YELLOW}⚠ $MISSING_DOCS documentation files missing${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 10. Performance
echo -e "${BLUE}⚡ 10. Performance indicators...${NC}"
if [ -f vite.config.ts ]; then
  if grep -q "minify.*terser" vite.config.ts; then
    echo -e "${GREEN}✓ Minification configured${NC}"
  else
    echo -e "${YELLOW}⚠ Minification not optimally configured${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  if grep -q "viteCompression" vite.config.ts; then
    echo -e "${GREEN}✓ Compression enabled${NC}"
  else
    echo -e "${YELLOW}⚠ Compression not configured${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Health Check Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

TOTAL_CHECKS=$((PASSED + FAILED + WARNINGS))
SUCCESS_RATE=$((PASSED * 100 / TOTAL_CHECKS))

echo -e "Success Rate: ${SUCCESS_RATE}%"
echo ""

# Overall health score
if [ "$SUCCESS_RATE" -ge 90 ]; then
  echo -e "${GREEN}🎉 Project health: EXCELLENT${NC}"
  exit 0
elif [ "$SUCCESS_RATE" -ge 75 ]; then
  echo -e "${GREEN}👍 Project health: GOOD${NC}"
  exit 0
elif [ "$SUCCESS_RATE" -ge 50 ]; then
  echo -e "${YELLOW}⚠️  Project health: FAIR${NC}"
  exit 1
else
  echo -e "${RED}❌ Project health: POOR${NC}"
  exit 1
fi
