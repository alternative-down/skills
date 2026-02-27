#!/bin/bash

# Add a new entity and commit
# Usage: ./add-entity.sh --type task --id my_task --field name "My Task"
# Works from any directory

# Pass all args to firm add (with workspace flag)
firm -w /firm add "$@"

if [ $? -eq 0 ]; then
  echo ""
  echo "💾 Syncing changes..."
  "$(dirname "$0")/commit-push.sh" "feat: add new entity"
else
  echo "❌ Failed to create entity"
  exit 1
fi
