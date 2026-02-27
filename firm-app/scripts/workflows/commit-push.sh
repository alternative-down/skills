#!/bin/bash

# Commit and push Firm workspace changes
# Usage: ./commit-push.sh "commit message"

MESSAGE="${1:-chore: sync workspace changes}"

cd /firm || exit 1

# Check if there are any changes
if ! git diff --quiet; then
  git add .
  git commit -m "$MESSAGE"
  PUSH_RESULT=$(git push origin main 2>&1)
  
  if echo "$PUSH_RESULT" | grep -q "error"; then
    # Try master if main doesn't exist
    git push origin master 2>/dev/null
  fi
  
  echo "✅ Changes committed and pushed"
else
  echo "ℹ️  No changes to commit"
fi
