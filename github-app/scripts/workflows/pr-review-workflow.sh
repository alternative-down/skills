#!/bin/bash
# PR Review & Merge Workflow
# Automatiza: Criar PR → Atribuir reviewers → Deixar review → Mergear

set -e

REPO="${1:-alternative-down/skills}"
PR_BRANCH="${2:-feature-branch}"
PR_TITLE="${3:-Automated PR: Feature Implementation}"
PR_BODY="${4:-This PR was created by an automated workflow}"
REVIEWERS="${5:-developer1,developer2}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "🔀 PR REVIEW & MERGE WORKFLOW"
echo "========================================="
echo ""
echo "📦 Repository: $REPO"
echo "🌿 Branch: $PR_BRANCH → main"
echo ""

# 1. Criar PR
echo "📝 [1/4] Criando Pull Request..."
PR_OUTPUT=$(node "$SCRIPT_DIR/create-pr.js" \
  --repo "$REPO" \
  --title "$PR_TITLE" \
  --head "$PR_BRANCH" \
  --base main \
  --body "$PR_BODY")

PR_NUM=$(echo "$PR_OUTPUT" | grep -oE '#[0-9]+' | head -1 | tr -d '#')

if [ -z "$PR_NUM" ]; then
  echo "❌ Erro ao criar PR"
  exit 1
fi

echo "✅ PR #$PR_NUM criada"
echo ""

# 2. Atribuir reviewers
echo "👥 [2/4] Atribuindo reviewers..."
node "$SCRIPT_DIR/request-reviewers.js" \
  --repo "$REPO" \
  --number "$PR_NUM" \
  --reviewers "$REVIEWERS"

echo "✅ Reviewers atribuídos"
echo ""

# 3. Listar reviews (para verificar estado)
echo "📋 [3/4] Verificando reviews..."
node "$SCRIPT_DIR/list-reviews.js" \
  --repo "$REPO" \
  --number "$PR_NUM"

echo ""

# 4. Mergear PR
echo "✅ [4/4] Mergeando PR..."
node "$SCRIPT_DIR/merge-pr.js" \
  --repo "$REPO" \
  --number "$PR_NUM" \
  --method squash \
  --title "Merge PR #$PR_NUM: $PR_TITLE"

echo ""
echo "========================================="
echo "✨ Workflow completo!"
echo "========================================="
echo ""
echo "📊 Resumo:"
echo "  - PR #$PR_NUM criada"
echo "  - Reviewers: $REVIEWERS"
echo "  - Status: MERGED"
echo ""
