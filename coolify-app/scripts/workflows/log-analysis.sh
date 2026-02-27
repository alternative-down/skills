#!/bin/bash

# Analyze application logs for errors and warnings
# Usage: ./log-analysis.sh <applicationId> [--tail=100] [--grep=ERROR]

APP_ID="$1"
TAIL_ARG="--tail=$(echo "$2" | grep -o '[0-9]*' || echo '100')"
GREP_PATTERN="${3##*=}"
GREP_PATTERN="${GREP_PATTERN:-ERROR|WARN}"

if [ -z "$APP_ID" ]; then
  echo "Usage: ./log-analysis.sh <applicationId> [--tail=100] [--grep=ERROR|WARN]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📋 Analyzing logs for application $APP_ID..."
echo "Pattern: $GREP_PATTERN"
echo "============================================="
echo ""

LOGS=$(node "$SCRIPT_DIR/queries/get-logs.js" "$APP_ID" "$TAIL_ARG" 2>/dev/null)

if [ -z "$LOGS" ]; then
  echo "❌ No logs found"
  exit 1
fi

ERRORS=$(echo "$LOGS" | grep -i "$GREP_PATTERN" | wc -l)

if [ "$ERRORS" -eq 0 ]; then
  echo "✅ No errors or warnings found in logs"
else
  echo "⚠️  Found $ERRORS matching log entries:"
  echo ""
  echo "$LOGS" | grep -i "$GREP_PATTERN"
fi

echo ""
echo "📊 Total log lines: $(echo "$LOGS" | wc -l)"
