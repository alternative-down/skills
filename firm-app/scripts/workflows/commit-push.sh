#!/bin/bash

# Commit and push Firm workspace changes
# Usage: ./commit-push.sh "commit message"

MESSAGE="${1:-update: workspace changes}"

if [ -z "$MESSAGE" ]; then
  echo "Usage: ./commit-push.sh \"commit message\""
  exit 1
fi

cd /firm || exit 1

if ! git diff --quiet; then
  git add .
  git commit -m "$MESSAGE"
  git push origin main 2>/dev/null || git push origin master
  echo "✅ Changes committed and pushed"
else
  echo "ℹ️  No changes to commit"
fi
