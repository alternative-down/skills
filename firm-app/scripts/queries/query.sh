#!/bin/bash

# Execute a Firm query
# Usage: ./query.sh <query>
# Examples:
#   ./query.sh 'from task | where is_completed == false'
#   ./query.sh 'from project | where status == "active" | count'

QUERY="${1:-}"

if [ -z "$QUERY" ]; then
  echo "Usage: ./query.sh '<query>'"
  echo ""
  echo "Examples:"
  echo "  ./query.sh 'from task | where is_completed == false'"
  echo "  ./query.sh 'from project | where status == \"active\"'"
  echo "  ./query.sh 'from person | related task | count'"
  exit 1
fi

firm query "$QUERY"
