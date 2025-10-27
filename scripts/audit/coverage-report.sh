#!/bin/bash

# 📊 Test Coverage Report Generator
# Generates detailed test coverage report with recommendations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 ClubNath VIP - Coverage Report${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Run tests with coverage
echo -e "${BLUE}🧪 Running tests with coverage...${NC}"
npm run test:coverage > /dev/null 2>&1 || true

if [ ! -f coverage/coverage-summary.json ]; then
  echo -e "${RED}❌ Coverage report not generated${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Coverage report generated${NC}"
echo ""

# Parse coverage data
echo -e "${BLUE}📈 Coverage Statistics:${NC}"
echo ""

# Overall coverage
LINES_PCT=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
STATEMENTS_PCT=$(cat coverage/coverage-summary.json | jq '.total.statements.pct')
FUNCTIONS_PCT=$(cat coverage/coverage-summary.json | jq '.total.functions.pct')
BRANCHES_PCT=$(cat coverage/coverage-summary.json | jq '.total.branches.pct')

echo "Overall Coverage:"
echo "  Lines:      ${LINES_PCT}%"
echo "  Statements: ${STATEMENTS_PCT}%"
echo "  Functions:  ${FUNCTIONS_PCT}%"
echo "  Branches:   ${BRANCHES_PCT}%"
echo ""

# Determine status color
get_status_color() {
  PCT=$1
  if (( $(echo "$PCT >= 80" | bc -l) )); then
    echo "$GREEN"
  elif (( $(echo "$PCT >= 60" | bc -l) )); then
    echo "$YELLOW"
  else
    echo "$RED"
  fi
}

LINES_COLOR=$(get_status_color $LINES_PCT)
echo -e "${LINES_COLOR}█████████████████████████████████████████${NC} Lines: ${LINES_PCT}%"
echo ""

# Files with low coverage
echo -e "${BLUE}🔍 Files with Low Coverage (< 50%):${NC}"
echo ""

LOW_COVERAGE=$(cat coverage/coverage-summary.json | jq -r '
  to_entries[] | 
  select(.key != "total") |
  select(.value.lines.pct < 50) | 
  "\(.key)|\(.value.lines.pct)"
' | head -20)

if [ -z "$LOW_COVERAGE" ]; then
  echo -e "${GREEN}✓ No files with coverage < 50%${NC}"
else
  echo "File                                    | Coverage"
  echo "----------------------------------------|----------"
  echo "$LOW_COVERAGE" | while IFS='|' read -r file pct; do
    COLOR=$(get_status_color $pct)
    printf "%-40s| ${COLOR}%5.1f%%${NC}\n" "$(basename $file)" "$pct"
  done
fi
echo ""

# Files with NO coverage
echo -e "${BLUE}❌ Files with NO Tests:${NC}"
echo ""

NO_COVERAGE=$(cat coverage/coverage-summary.json | jq -r '
  to_entries[] | 
  select(.key != "total") |
  select(.value.lines.pct == 0) | 
  .key
' | head -10)

if [ -z "$NO_COVERAGE" ]; then
  echo -e "${GREEN}✓ All files have some test coverage${NC}"
else
  echo "$NO_COVERAGE" | while read -r file; do
    echo -e "${RED}  • $(basename $file)${NC}"
  done
fi
echo ""

# Files with EXCELLENT coverage
echo -e "${BLUE}🌟 Files with Excellent Coverage (> 80%):${NC}"
echo ""

EXCELLENT_COVERAGE=$(cat coverage/coverage-summary.json | jq -r '
  to_entries[] | 
  select(.key != "total") |
  select(.value.lines.pct >= 80) | 
  "\(.key)|\(.value.lines.pct)"
' | wc -l)

TOTAL_FILES=$(cat coverage/coverage-summary.json | jq 'to_entries | length - 1')

echo -e "${GREEN}$EXCELLENT_COVERAGE / $TOTAL_FILES files${NC} with excellent coverage"
echo ""

# Recommendations
echo -e "${BLUE}💡 Recommendations:${NC}"
echo ""

if (( $(echo "$LINES_PCT < 40" | bc -l) )); then
  echo -e "${RED}🔴 CRITICAL: Coverage is below 40%${NC}"
  echo "   Priority: Add tests for core services and utilities"
  echo ""
elif (( $(echo "$LINES_PCT < 60" | bc -l) )); then
  echo -e "${YELLOW}🟡 HIGH: Coverage is below 60%${NC}"
  echo "   Priority: Increase test coverage for critical paths"
  echo ""
elif (( $(echo "$LINES_PCT < 80" | bc -l) )); then
  echo -e "${YELLOW}🟡 MEDIUM: Coverage is below 80%${NC}"
  echo "   Priority: Add tests for remaining components"
  echo ""
else
  echo -e "${GREEN}🟢 GOOD: Coverage is above 80%${NC}"
  echo "   Keep maintaining high coverage standards"
  echo ""
fi

# Next steps
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo ""

# Identify top priority files to test
TOP_PRIORITY=$(cat coverage/coverage-summary.json | jq -r '
  to_entries[] | 
  select(.key != "total") |
  select(.value.lines.pct < 50) |
  select(.key | contains("service") or contains("lib")) |
  "\(.key)|\(.value.lines.pct)|\(.value.lines.total)"
' | sort -t'|' -k3 -rn | head -5)

if [ -n "$TOP_PRIORITY" ]; then
  echo "Top Priority Files to Test (by importance):"
  echo ""
  COUNTER=1
  echo "$TOP_PRIORITY" | while IFS='|' read -r file pct total; do
    echo "  $COUNTER. $(basename $file)"
    echo "     Current coverage: ${pct}%"
    echo "     Lines to cover: $(echo "$total * (100 - $pct) / 100" | bc) lines"
    echo ""
    COUNTER=$((COUNTER + 1))
  done
fi

# Generate test file suggestions
echo -e "${BLUE}📝 Suggested Test Files to Create:${NC}"
echo ""

# Find files without tests
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.test.*" ! -name "*.spec.*" 2>/dev/null | while read -r file; do
  TEST_FILE="${file%.ts*}.test.ts"
  if [ ! -f "$TEST_FILE" ]; then
    # Check if file is in coverage report with low/no coverage
    BASENAME=$(basename "$file")
    if echo "$NO_COVERAGE" | grep -q "$BASENAME"; then
      echo -e "${RED}  • $TEST_FILE${NC} (CRITICAL - No coverage)"
    fi
  fi
done | head -10

echo ""

# Coverage trends (if we have historical data)
if [ -f .coverage-history.json ]; then
  echo -e "${BLUE}📈 Coverage Trend:${NC}"
  PREV_COVERAGE=$(cat .coverage-history.json | jq -r '.[-2].lines')
  if [ -n "$PREV_COVERAGE" ]; then
    DIFF=$(echo "$LINES_PCT - $PREV_COVERAGE" | bc)
    if (( $(echo "$DIFF > 0" | bc -l) )); then
      echo -e "  ${GREEN}↗ Improved by ${DIFF}%${NC}"
    elif (( $(echo "$DIFF < 0" | bc -l) )); then
      echo -e "  ${RED}↘ Decreased by ${DIFF#-}%${NC}"
    else
      echo -e "  ${YELLOW}→ No change${NC}"
    fi
  fi
  echo ""
fi

# Save current coverage to history
mkdir -p .coverage-history
echo "{\"date\": \"$(date -I)\", \"lines\": $LINES_PCT}" >> .coverage-history.json

# Open HTML report
echo -e "${BLUE}📄 Opening detailed HTML report...${NC}"
if command -v xdg-open > /dev/null; then
  xdg-open coverage/index.html 2>/dev/null &
elif command -v open > /dev/null; then
  open coverage/index.html 2>/dev/null &
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ Report Complete${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "HTML Report: coverage/index.html"
echo "JSON Report: coverage/coverage-summary.json"
echo ""

# Exit with appropriate code based on coverage
if (( $(echo "$LINES_PCT >= 80" | bc -l) )); then
  exit 0
elif (( $(echo "$LINES_PCT >= 60" | bc -l) )); then
  exit 0
else
  exit 1
fi
