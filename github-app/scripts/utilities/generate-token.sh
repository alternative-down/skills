#!/bin/bash
# Generate GitHub App Installation Token
# Útil para usar em chamadas diretas à API GitHub ou git operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔐 Generating GitHub App Installation Token..."
echo ""

TOKEN=$(node "$SCRIPT_DIR/mint_installation_token.js")

echo "✅ Token generated!"
echo ""
echo "Token (first 50 chars): ${TOKEN:0:50}..."
echo ""
echo "Use in curl:"
echo "  curl -H \"Authorization: Bearer \$TOKEN\" https://api.github.com/repos/..."
echo ""
echo "Use in git clone:"
echo "  git clone https://x-access-token:\$TOKEN@github.com/owner/repo.git"
echo ""
echo "Store in variable:"
echo "  TOKEN=\$(bash $0)"
echo ""

# Se chamado com --export, retorna só o token
if [ "$1" == "--export" ]; then
  echo "$TOKEN"
fi
