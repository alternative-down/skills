#!/bin/bash

# Deploy application and monitor status
# Usage: ./deploy-and-monitor.sh <applicationId> [--wait=300]

APP_ID="$1"
WAIT_TIME="${2##*=}"
WAIT_TIME="${WAIT_TIME:-300}"

if [ -z "$APP_ID" ]; then
  echo "Usage: ./deploy-and-monitor.sh <applicationId> [--wait=300]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Deploying application $APP_ID..."
node "$SCRIPT_DIR/actions/deploy-application.js" "$APP_ID" || exit 1

echo "⏳ Monitoring deployment (${WAIT_TIME}s timeout)..."
START=$(date +%s)
TIMEOUT=$((START + WAIT_TIME))

while true; do
  CURRENT=$(date +%s)
  if [ $CURRENT -gt $TIMEOUT ]; then
    echo "⚠️  Timeout waiting for deployment"
    exit 1
  fi
  
  STATUS=$(node "$SCRIPT_DIR/queries/get-application.js" "$APP_ID" 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  
  if [ "$STATUS" = "healthy" ] || [ "$STATUS" = "running" ]; then
    echo "✅ Application is $STATUS"
    break
  fi
  
  echo "  Status: ${STATUS:-pending}... waiting 5s"
  sleep 5
done

echo "🎉 Deployment complete!"
