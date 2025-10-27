#!/bin/bash

# 🔒 Security Check Script
# Comprehensive security audit for ClubNath VIP

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔒 ClubNath VIP - Security Audit${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0

# 1. NPM Audit
echo -e "${BLUE}📦 1. Checking dependencies for vulnerabilities...${NC}"
if npm audit --audit-level=moderate > /dev/null 2>&1; then
  echo -e "${GREEN}✓ No vulnerabilities found${NC}"
else
  VULNS=$(npm audit --json | jq '.metadata.vulnerabilities | .critical + .high')
  if [ "$VULNS" -gt 0 ]; then
    echo -e "${RED}✗ $VULNS critical/high vulnerabilities found${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + VULNS))
    npm audit --audit-level=high
  else
    echo -e "${YELLOW}⚠ Moderate vulnerabilities found (non-blocking)${NC}"
  fi
fi
echo ""

# 2. Check for .env files
echo -e "${BLUE}🔑 2. Checking for exposed environment files...${NC}"
if [ -f .env ]; then
  echo -e "${RED}✗ .env file found in repository!${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
else
  echo -e "${GREEN}✓ No .env file in repository${NC}"
fi

if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
  echo -e "${YELLOW}⚠ .env not in .gitignore${NC}"
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
else
  echo -e "${GREEN}✓ .env properly ignored${NC}"
fi
echo ""

# 3. Check for console.log statements
echo -e "${BLUE}🚨 3. Checking for console.log statements...${NC}"
CONSOLE_COUNT=$(grep -r "console\.log" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠ $CONSOLE_COUNT console.log statements found${NC}"
  HIGH_ISSUES=$((HIGH_ISSUES + CONSOLE_COUNT))
  echo "Locations:"
  grep -rn "console\.log" src --include="*.ts" --include="*.tsx" 2>/dev/null | head -10
  if [ "$CONSOLE_COUNT" -gt 10 ]; then
    echo "... and $((CONSOLE_COUNT - 10)) more"
  fi
else
  echo -e "${GREEN}✓ No console.log statements found${NC}"
fi
echo ""

# 4. Check for hardcoded secrets
echo -e "${BLUE}🔐 4. Scanning for hardcoded secrets...${NC}"
SECRET_PATTERNS=(
  "password.*=.*['\"]"
  "api[_-]?key.*=.*['\"]"
  "secret.*=.*['\"]"
  "token.*=.*['\"]"
  "private[_-]?key.*=.*['\"]"
)

SECRETS_FOUND=0
for pattern in "${SECRET_PATTERNS[@]}"; do
  MATCHES=$(grep -riE "$pattern" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "VITE_" | wc -l)
  SECRETS_FOUND=$((SECRETS_FOUND + MATCHES))
done

if [ "$SECRETS_FOUND" -gt 0 ]; then
  echo -e "${RED}✗ $SECRETS_FOUND potential secrets found${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES + SECRETS_FOUND))
  grep -riE "password.*=.*['\"]|api[_-]?key.*=.*['\"]|secret.*=.*['\"]" src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "VITE_" | head -5
else
  echo -e "${GREEN}✓ No hardcoded secrets detected${NC}"
fi
echo ""

# 5. Check localStorage usage
echo -e "${BLUE}💾 5. Auditing storage usage...${NC}"
STORAGE_COUNT=$(grep -r "localStorage\|sessionStorage" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
if [ "$STORAGE_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠ $STORAGE_COUNT localStorage/sessionStorage usages found${NC}"
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
  echo "Review these for sensitive data:"
  grep -rn "localStorage\|sessionStorage" src --include="*.ts" --include="*.tsx" 2>/dev/null | head -5
else
  echo -e "${GREEN}✓ No storage usage found${NC}"
fi
echo ""

# 6. Check for security headers
echo -e "${BLUE}🛡️  6. Checking security headers configuration...${NC}"
if [ -f netlify.toml ]; then
  REQUIRED_HEADERS=(
    "X-Frame-Options"
    "X-XSS-Protection"
    "X-Content-Type-Options"
    "Referrer-Policy"
  )
  
  MISSING_HEADERS=0
  for header in "${REQUIRED_HEADERS[@]}"; do
    if ! grep -q "$header" netlify.toml; then
      echo -e "${YELLOW}⚠ Missing header: $header${NC}"
      MISSING_HEADERS=$((MISSING_HEADERS + 1))
    fi
  done
  
  if [ "$MISSING_HEADERS" -eq 0 ]; then
    echo -e "${GREEN}✓ All required security headers present${NC}"
  else
    HIGH_ISSUES=$((HIGH_ISSUES + MISSING_HEADERS))
  fi
  
  # Check for CSP
  if ! grep -q "Content-Security-Policy" netlify.toml; then
    echo -e "${YELLOW}⚠ Content-Security-Policy not configured${NC}"
    HIGH_ISSUES=$((HIGH_ISSUES + 1))
  fi
else
  echo -e "${YELLOW}⚠ netlify.toml not found${NC}"
fi
echo ""

# 7. Check TypeScript strict mode
echo -e "${BLUE}📝 7. Checking TypeScript configuration...${NC}"
if [ -f tsconfig.app.json ]; then
  if grep -q '"strict": true' tsconfig.app.json; then
    echo -e "${GREEN}✓ TypeScript strict mode enabled${NC}"
  else
    echo -e "${RED}✗ TypeScript strict mode not enabled${NC}"
    HIGH_ISSUES=$((HIGH_ISSUES + 1))
  fi
else
  echo -e "${YELLOW}⚠ tsconfig.app.json not found${NC}"
fi
echo ""

# 8. Check for large files
echo -e "${BLUE}📏 8. Checking for large files...${NC}"
LARGE_FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -size +500k 2>/dev/null)
if [ -n "$LARGE_FILES" ]; then
  echo -e "${YELLOW}⚠ Large files found (>500KB):${NC}"
  echo "$LARGE_FILES"
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
else
  echo -e "${GREEN}✓ No excessively large files${NC}"
fi
echo ""

# 9. Check for TODO/FIXME comments
echo -e "${BLUE}🔍 9. Scanning for TODO/FIXME comments...${NC}"
TODO_COUNT=$(grep -rE "TODO|FIXME" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠ $TODO_COUNT TODO/FIXME comments found${NC}"
  # Not counted as issues, just informational
else
  echo -e "${GREEN}✓ No pending TODOs${NC}"
fi
echo ""

# 10. Check build configuration
echo -e "${BLUE}🏗️  10. Checking build security...${NC}"
if [ -f vite.config.ts ]; then
  if grep -q "drop_console: true" vite.config.ts; then
    echo -e "${GREEN}✓ Console statements removed in production${NC}"
  else
    echo -e "${YELLOW}⚠ Console statements may be in production build${NC}"
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
  fi
  
  if grep -q "sourcemap: false" vite.config.ts; then
    echo -e "${GREEN}✓ Source maps disabled in production${NC}"
  else
    echo -e "${YELLOW}⚠ Source maps may be exposed${NC}"
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1))
  fi
else
  echo -e "${YELLOW}⚠ vite.config.ts not found${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Security Audit Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🔴 Critical Issues: ${RED}$CRITICAL_ISSUES${NC}"
echo -e "🟡 High Issues: ${YELLOW}$HIGH_ISSUES${NC}"
echo -e "🟢 Medium Issues: ${YELLOW}$MEDIUM_ISSUES${NC}"
echo ""

TOTAL_ISSUES=$((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES))

if [ "$TOTAL_ISSUES" -eq 0 ]; then
  echo -e "${GREEN}✅ All security checks passed!${NC}"
  exit 0
elif [ "$CRITICAL_ISSUES" -gt 0 ]; then
  echo -e "${RED}❌ Critical security issues found. Please fix immediately!${NC}"
  exit 1
elif [ "$HIGH_ISSUES" -gt 5 ]; then
  echo -e "${YELLOW}⚠️  High priority issues found. Please address soon.${NC}"
  exit 1
else
  echo -e "${YELLOW}⚠️  Some issues found. Review when possible.${NC}"
  exit 0
fi
