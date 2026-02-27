#!/bin/bash

# List all entities of a given type
# Usage: ./list-all.sh <entity-type>

TYPE="${1:-task}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [ -z "$TYPE" ]; then
  echo "Usage: ./list-all.sh <entity-type>"
  echo "Examples: ./list-all.sh task, ./list-all.sh project, ./list-all.sh person"
  exit 1
fi

cd /firm || exit 1
firm list "$TYPE"

# Sync any changes
if git diff --quiet; then
  exit 0
fi

"$SCRIPT_DIR/scripts/workflows/commit-push.sh" "chore: sync workspace changes"
