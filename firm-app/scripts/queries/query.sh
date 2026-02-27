#!/bin/bash

# Execute a Firm query
# Usage: ./query.sh <query>
# Examples:
#   ./query.sh 'from task | where is_completed == false'
#   ./query.sh 'from project | where status == "active" | count'

QUERY="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [ -z "$QUERY" ]; then
  echo "Usage: ./query.sh '<query>'"
  echo ""
  echo "Examples:"
  echo "  ./query.sh 'from task | where is_completed == false'"
  echo "  ./query.sh 'from project | where status == \"active\"'"
  echo "  ./query.sh 'from person | related task | count'"
  exit 1
fi

cd /firm || exit 1
firm query "$QUERY"

# Sync any changes
if git diff --quiet; then
  exit 0
fi

"$SCRIPT_DIR/scripts/workflows/commit-push.sh" "chore: sync workspace changes"
