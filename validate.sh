#!/bin/bash

# SUPER-CODER MODE: Full Automation Validation
# Runs all checks and only continues if everything passes

set -e  # Exit on any error

echo "🚀 SUPER-CODER MODE: Running Full Validation"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to check if command succeeded
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# 1. BUILD VALIDATION
echo "1️⃣  BUILD VALIDATION"
echo "-------------------"
npm run build > build.log 2>&1
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    
    # Check for warnings that break build
    if grep -i "error\|failed\|cannot" build.log > /dev/null 2>&1; then
        echo -e "${RED}❌ Build log contains errors${NC}"
        cat build.log | grep -i "error\|failed\|cannot" | head -10
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ No build errors found${NC}"
    fi
else
    echo -e "${RED}❌ Build failed${NC}"
    cat build.log | tail -20
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. ENVIRONMENT VARIABLE VERIFICATION
echo "2️⃣  ENVIRONMENT VARIABLE VERIFICATION"
echo "--------------------------------------"

# Load .env.local if it exists
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

REQUIRED_VARS=(
    "GOOGLE_GEMINI_API_KEY"
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
)

MISSING_VARS=0
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Missing: $var${NC}"
        MISSING_VARS=$((MISSING_VARS + 1))
        ERRORS=$((ERRORS + 1))
    elif [[ "${!var}" == *"your_"* ]] || [[ "${!var}" == *"placeholder"* ]] || [[ "${!var}" == *"here"* ]]; then
        echo -e "${RED}❌ $var contains placeholder value${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ $var is set${NC}"
        
        # Validate format
        if [[ "$var" == *"API_KEY"* ]] && [[ ! "${!var}" =~ ^AIza ]]; then
            echo -e "${YELLOW}⚠️  $var format may be invalid (should start with AIza)${NC}"
        fi
    fi
done

if [ $MISSING_VARS -eq 0 ]; then
    echo -e "${GREEN}✅ All required environment variables exist${NC}"
else
    echo -e "${RED}❌ Missing $MISSING_VARS required environment variables${NC}"
fi
echo ""

# 3. SMOKE TEST VALIDATION
echo "3️⃣  SMOKE TEST VALIDATION"
echo "------------------------"
if npm run smoke > smoke.log 2>&1; then
    echo -e "${GREEN}✅ Smoke tests passed${NC}"
else
    echo -e "${RED}❌ Smoke tests failed${NC}"
    cat smoke.log | tail -20
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. INTEGRATION TEST EXECUTION
echo "4️⃣  INTEGRATION TEST EXECUTION"
echo "-------------------------------"
if npm run test:integration > integration.log 2>&1; then
    echo -e "${GREEN}✅ Integration tests passed${NC}"
else
    echo -e "${RED}❌ Integration tests failed${NC}"
    cat integration.log | tail -20
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. ERROR LOG CHECK
echo "5️⃣  ERROR LOG CHECK"
echo "-------------------"

# Check for actual errors (not test output messages)
CRITICAL_ERRORS=0

# Check build.log for actual build errors
if grep -i "error\|failed\|cannot" build.log 2>/dev/null | grep -v "node_modules" | grep -v ".next" | grep -v "warning" | grep -v "⚠" > /dev/null 2>&1; then
    echo -e "${RED}❌ Found actual errors in build log${NC}"
    grep -i "error\|failed\|cannot" build.log 2>/dev/null | grep -v "node_modules" | grep -v ".next" | grep -v "warning" | grep -v "⚠" | head -5
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# Check for undefined/null reference errors (actual code errors)
if grep -i "undefined\|cannot read\|null reference" build.log 2>/dev/null | grep -v "node_modules" | grep -v ".next" > /dev/null 2>&1; then
    echo -e "${RED}❌ Found undefined/null reference errors${NC}"
    grep -i "undefined\|cannot read\|null reference" build.log 2>/dev/null | grep -v "node_modules" | grep -v ".next" | head -3
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
fi

# Check smoke/integration logs for actual test failures (not test output)
if grep -i "Failed:" smoke.log integration.log 2>/dev/null | grep -v "node_modules" | grep -v "Results:" > /dev/null 2>&1; then
    # Only count if it's an actual failure, not just test output
    FAILED_COUNT=$(grep -i "Failed:" smoke.log integration.log 2>/dev/null | grep "Failed: [1-9]" | wc -l | tr -d ' ')
    if [ "$FAILED_COUNT" -gt 0 ]; then
        echo -e "${RED}❌ Found actual test failures${NC}"
        CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
    fi
fi

if [ $CRITICAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ No critical errors found in logs${NC}"
else
    echo -e "${RED}❌ Found $CRITICAL_ERRORS critical error(s) in logs${NC}"
    ERRORS=$((ERRORS + CRITICAL_ERRORS))
fi
echo ""

# 6. CODE QUALITY CHECKS
echo "6️⃣  CODE QUALITY CHECKS"
echo "-----------------------"

# Check for common issues
ISSUES=0

# Check for console.logs (should use console.error for errors)
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | head -5 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Found console.log statements (consider removing for production)${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Check for TODO/FIXME
if grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | head -5 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Found TODO/FIXME comments${NC}"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Code quality checks passed${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ISSUES code quality issues (non-blocking)${NC}"
fi
echo ""

# FINAL RESULTS
echo "=============================================="
echo "📊 VALIDATION RESULTS"
echo "=============================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    echo "✅ Build: Successful"
    echo "✅ Environment: All variables set"
    echo "✅ Smoke Tests: Passed"
    echo "✅ Integration Tests: Passed"
    echo "✅ Error Logs: Clean"
    echo ""
    echo -e "${GREEN}🚀 READY FOR DEPLOYMENT${NC}"
    exit 0
else
    echo -e "${RED}❌ VALIDATION FAILED${NC}"
    echo ""
    echo "❌ Found $ERRORS error(s)"
    echo ""
    echo "Please fix the errors above before continuing."
    echo ""
    exit 1
fi

