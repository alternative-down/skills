#!/bin/bash

# Add a new entity and commit
# Usage: ./add-entity.sh --type task --id my_task --field name "My Task"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd /firm || exit 1

# Pass all args to firm add
firm add "$@"

if [ $? -eq 0 ]; then
  echo ""
  echo "💾 Syncing changes..."
  "$SCRIPT_DIR/scripts/workflows/commit-push.sh" "feat: add new entity"
else
  echo "❌ Failed to create entity"
  exit 1
fi
