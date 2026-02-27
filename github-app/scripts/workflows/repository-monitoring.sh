#!/bin/bash
# Repository Monitoring & Status Report
# Automatiza: Listar info → PRs → Issues → Commits recentes

set -e

REPO="${1:-alternative-down/skills}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "📊 REPOSITORY MONITORING REPORT"
echo "========================================="
echo ""
echo "Repository: $REPO"
echo "Generated: $(date)"
echo ""

# 1. Info geral
echo "📦 REPOSITORY INFORMATION"
echo "========================================="
node "$SCRIPT_DIR/queries/get-repo-info.js" --repo "$REPO"
echo ""

# 2. PRs abertos
echo "🔀 OPEN PULL REQUESTS"
echo "========================================="
node "$SCRIPT_DIR/queries/list-prs.js" \
  --repo "$REPO" \
  --state open

echo ""

# 3. Issues abertas
echo "📋 OPEN ISSUES"
echo "========================================="
node "$SCRIPT_DIR/queries/list-issues.js" \
  --repo "$REPO" \
  --state open

echo ""

# 4. Últimos commits
echo "📝 RECENT COMMITS (top 10)"
echo "========================================="
node "$SCRIPT_DIR/queries/list-commits.js" \
  --repo "$REPO" \
  --branch main \
  --limit 10

echo ""
echo "========================================="
echo "✅ Report complete!"
echo "========================================="
echo ""
