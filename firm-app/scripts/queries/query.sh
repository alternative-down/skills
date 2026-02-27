#!/bin/bash

# Execute a Firm query
# Usage: ./query.sh <query>
# Works from any directory
# Examples:
#   ./query.sh 'from task | where is_completed == false'
#   ./query.sh 'from project | where status == "active" | count'

QUERY="${1:-}"

if [ -z "$QUERY" ]; then
  echo "Usage: query.sh '<query>'"
  echo ""
  echo "Examples:"
  echo "  query.sh 'from task | where is_completed == false'"
  echo "  query.sh 'from project | where status == \"active\"'"
  echo "  query.sh 'from person | related task | count'"
  exit 1
fi

firm -w /firm query "$QUERY"

# Sync any changes
cd /firm || exit 1
if git diff --quiet; then
  exit 0
fi

"$(dirname "$0")/../workflows/commit-push.sh" "chore: sync workspace changes"
