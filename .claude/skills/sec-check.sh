#!/usr/bin/env bash
# Security check skill for token-calculator project
# Usage: /sec-check

set -euo pipefail

# --- SECURITY VULNERABILITY CHECKS ---

echo "🔒 Running security checks for token-calculator project..."
echo ""

# Check 1: Scan for hardcoded secrets
echo "1. Checking for hardcoded secrets..."
if grep -r -i -E "(api[_-]?key|secret|password|token|auth[_-]?token|private[_-]?key)\s*=\s*['\"][^'\"]+['\"]" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude-dir=build \
    --exclude-dir=.next \
    --exclude-dir=taskier-env \
    --exclude="*.md" \
    --exclude="sec-check.sh" \
    . 2>/dev/null | head -20; then
    echo "⚠️  Found potential hardcoded secrets"
else
    echo "✅ No hardcoded secrets detected"
fi
echo ""

# Check 2: Check for .env files in version control
echo "2. Checking for .env files in git..."
if git ls-files 2>/dev/null | grep -E "\.env$|\.env\..*" | grep -v "\.env\.example" | grep -v "\.env\.template"; then
    echo "⚠️  Found .env files in version control"
else
    echo "✅ No .env files tracked in git"
fi
echo ""

# Check 3: Scan for SQL injection vulnerabilities
echo "3. Checking for potential SQL injection risks..."
if grep -r -E "(execute|query|raw)\s*\(\s*['\"].*\+|f['\"].*SELECT|f['\"].*INSERT|f['\"].*UPDATE|f['\"].*DELETE" \
    --include="*.py" \
    --include="*.ts" \
    --include="*.js" \
    --include="*.tsx" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    . 2>/dev/null | head -10; then
    echo "⚠️  Found potential SQL injection risks"
else
    echo "✅ No obvious SQL injection patterns found"
fi
echo ""

# Check 4: Check for XSS vulnerabilities (React)
echo "4. Checking for XSS vulnerabilities..."
if grep -r -E "dangerouslySetInnerHTML|innerHTML\s*=" \
    --include="*.tsx" \
    --include="*.jsx" \
    --include="*.ts" \
    --include="*.js" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    . 2>/dev/null | head -10; then
    echo "⚠️  Found potential XSS risks"
else
    echo "✅ No obvious XSS patterns found"
fi
echo ""

# Check 5: Check npm/pip package vulnerabilities
echo "5. Checking for dependency vulnerabilities..."

if [ -f "package.json" ]; then
    echo "   Checking npm packages..."
    if command -v npm &> /dev/null; then
        npm audit --json 2>/dev/null | jq -r '.metadata | "   Total vulnerabilities: \(.vulnerabilities.total) (Critical: \(.vulnerabilities.critical), High: \(.vulnerabilities.high))"' 2>/dev/null || npm audit 2>&1 | head -5
    else
        echo "   ℹ️  npm not available, skipping npm audit"
    fi
fi

if [ -f "requirements.txt" ] || [ -f "Pipfile" ]; then
    echo "   Checking Python packages..."
    if command -v pip &> /dev/null; then
        pip list --format=json 2>/dev/null | jq -r '.[].name' | head -10 | xargs -I {} echo "   - {}"
        echo "   ℹ️  Run 'pip-audit' for detailed vulnerability scan"
    else
        echo "   ℹ️  pip not available, skipping Python package check"
    fi
fi
echo ""

# Check 6: Check for unsafe CORS configuration
echo "6. Checking for unsafe CORS configuration..."
if grep -r -E "Access-Control-Allow-Origin.*\*|cors.*origin.*\*" \
    --include="*.py" \
    --include="*.ts" \
    --include="*.js" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    . 2>/dev/null | head -5; then
    echo "⚠️  Found permissive CORS configuration"
else
    echo "✅ No unsafe CORS patterns found"
fi
echo ""

# Check 7: Check for exposed debug/development endpoints
echo "7. Checking for debug/development code..."
if grep -r -E "DEBUG\s*=\s*True|debug:\s*true|console\.log|print\(|debugger" \
    --include="*.py" \
    --include="*.ts" \
    --include="*.js" \
    --include="*.tsx" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    . 2>/dev/null | wc -l | xargs -I {} echo "   Found {} debug statements"; then
    echo "   ℹ️  Review debug code before production deployment"
fi
echo ""

# Check 8: Check file permissions
echo "8. Checking sensitive file permissions..."
if [ -f ".env" ]; then
    perm=$(stat -f "%A" .env 2>/dev/null || stat -c "%a" .env 2>/dev/null)
    if [ "$perm" != "600" ] && [ "$perm" != "400" ]; then
        echo "⚠️  .env has permissive permissions: $perm (should be 600 or 400)"
    else
        echo "✅ .env has secure permissions: $perm"
    fi
else
    echo "   ℹ️  No .env file found"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Security check complete!"
echo ""
echo "Next steps:"
echo "  • Review any ⚠️  warnings above"
echo "  • Run npm audit fix (for npm projects)"
echo "  • Use /security-review for deep branch analysis"
echo "  • Add sensitive files to .gitignore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
