#!/bin/bash

# Check health status of all applications
# Usage: ./application-health-check.sh [projectId]

PROJECT_ID="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🏥 Coolify Application Health Check"
echo "===================================="
echo ""

if [ -z "$PROJECT_ID" ]; then
  echo "📋 Fetching all applications..."
  APPS=$(node "$SCRIPT_DIR/queries/list-applications.js" 2>/dev/null | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
else
  echo "📋 Fetching applications for project $PROJECT_ID..."
  APPS=$(node "$SCRIPT_DIR/queries/list-applications.js" "$PROJECT_ID" 2>/dev/null | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$APPS" ]; then
  echo "❌ No applications found"
  exit 1
fi

HEALTHY=0
UNHEALTHY=0

while IFS= read -r APP_ID; do
  [ -z "$APP_ID" ] && continue
  
  STATUS=$(node "$SCRIPT_DIR/queries/get-application.js" "$APP_ID" 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  
  if [ "$STATUS" = "healthy" ] || [ "$STATUS" = "running" ]; then
    echo "✅ $APP_ID: $STATUS"
    ((HEALTHY++))
  else
    echo "⚠️  $APP_ID: ${STATUS:-unknown}"
    ((UNHEALTHY++))
  fi
done <<< "$APPS"

echo ""
echo "📊 Summary: $HEALTHY healthy, $UNHEALTHY unhealthy"
