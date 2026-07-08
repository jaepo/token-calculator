#!/usr/bin/env bash
# Auto-generate Jest tests for exported functions
# Usage: /generate-tests [file_path]

set -euo pipefail

# Get the file path from argument or prompt
FILE_PATH="${1:-}"

if [ -z "$FILE_PATH" ]; then
    echo "❌ Error: Please provide a file path"
    echo "Usage: /generate-tests <file_path>"
    echo ""
    echo "Examples:"
    echo "  /generate-tests src/utils/tokenCounter.js"
    echo "  /generate-tests src/components/Button.tsx"
    exit 1
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Error: File not found: $FILE_PATH"
    exit 1
fi

# Extract directory and filename
FILE_DIR=$(dirname "$FILE_PATH")
FILE_NAME=$(basename "$FILE_PATH")
FILE_BASE="${FILE_NAME%.*}"
FILE_EXT="${FILE_NAME##*.}"

# Create __tests__ directory if it doesn't exist
TEST_DIR="$FILE_DIR/__tests__"
mkdir -p "$TEST_DIR"

# Determine test file path
TEST_FILE="$TEST_DIR/${FILE_BASE}.test.${FILE_EXT}"

echo "🔍 Analyzing file: $FILE_PATH"
echo "📝 Will create test file: $TEST_FILE"
echo ""

# Count exported functions (simplified pattern matching)
EXPORT_COUNT=$(grep -E "^export (function|const|default|class|async)" "$FILE_PATH" 2>/dev/null | wc -l | tr -d ' ')

if [ "$EXPORT_COUNT" -eq 0 ]; then
    echo "⚠️  Warning: No exported functions found in $FILE_PATH"
    echo "   Make sure the file contains 'export' statements"
    exit 1
fi

echo "✅ Found $EXPORT_COUNT exported function(s)/component(s)"
echo ""
echo "🤖 Claude will now generate comprehensive Jest tests..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next: Claude will:"
echo "  1. Read and analyze $FILE_PATH"
echo "  2. Identify all exported functions/components"
echo "  3. Generate test cases (success + error cases)"
echo "  4. Create $TEST_FILE"
echo "  5. Provide test execution command"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Test file ready to be generated at:"
echo "   $TEST_FILE"

# The actual test generation will be done by Claude
# This script prepares the environment and provides context
