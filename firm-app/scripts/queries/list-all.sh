#!/bin/bash

# List all entities of a given type
# Usage: ./list-all.sh <entity-type>

TYPE="${1:-task}"

if [ -z "$TYPE" ]; then
  echo "Usage: ./list-all.sh <entity-type>"
  echo "Examples: ./list-all.sh task, ./list-all.sh project, ./list-all.sh person"
  exit 1
fi

firm list "$TYPE"
