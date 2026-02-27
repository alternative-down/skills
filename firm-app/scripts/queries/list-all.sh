#!/bin/bash

# List all entities of a given type
# Usage: ./list-all.sh <entity-type>
# Works from any directory

TYPE="${1:-task}"

if [ -z "$TYPE" ]; then
  echo "Usage: list-all.sh <entity-type>"
  echo "Examples: list-all.sh task, list-all.sh project, list-all.sh person"
  exit 1
fi

firm -w /firm list "$TYPE"

# Sync any changes
cd /firm || exit 1
if git diff --quiet; then
  exit 0
fi

"$(dirname "$0")/../workflows/commit-push.sh" "chore: sync workspace changes"
