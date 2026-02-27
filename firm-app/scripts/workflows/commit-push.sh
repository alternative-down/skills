#!/bin/bash

# Commit and push Firm workspace changes
# Usage: ./commit-push.sh "commit message"
# Works from any directory

MESSAGE="${1:-chore: sync workspace changes}"

cd /firm || exit 1

# Stage all changes (including untracked files)
git add .

# Check if there are any staged changes
if ! git diff --cached --quiet; then
  git commit -m "$MESSAGE"
  git push origin main 2>/dev/null || git push origin master 2>/dev/null
  echo "✅ Changes committed and pushed"
else
  echo "ℹ️  No changes to commit"
fi
