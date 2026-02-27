#!/bin/bash

# Add a new entity and commit
# Usage: ./add-entity.sh --type task --id my_task --field name "My Task"

cd /firm || exit 1

# Pass all args to firm add
firm add "$@"

if [ $? -eq 0 ]; then
  echo ""
  echo "💾 Committing changes..."
  git add .
  git commit -m "feat: add new entity"
  git push origin main 2>/dev/null || git push origin master
  echo "✅ Entity created and pushed"
else
  echo "❌ Failed to create entity"
  exit 1
fi
