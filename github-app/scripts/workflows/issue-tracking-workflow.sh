#!/bin/bash
# Issue Tracking Workflow
# Automatiza: Criar issue → Comentar → Adicionar labels → Fechar

set -e

REPO="${1:-alternative-down/skills}"
TITLE="${2:-Test Issue: Automated Workflow}"
BODY="${3:-Automaticamente criada pelo workflow}"
LABELS="${4:-test,automation}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "🔧 ISSUE TRACKING WORKFLOW"
echo "========================================="
echo ""
echo "📦 Repository: $REPO"
echo ""

# 1. Criar issue
echo "📌 [1/4] Criando issue..."
ISSUE_OUTPUT=$(node "$SCRIPT_DIR/create-issue.js" \
  --repo "$REPO" \
  --title "$TITLE" \
  --body "$BODY" \
  --labels "$LABELS")

ISSUE_NUM=$(echo "$ISSUE_OUTPUT" | grep -oE '#[0-9]+' | head -1 | tr -d '#')

if [ -z "$ISSUE_NUM" ]; then
  echo "❌ Erro ao criar issue"
  exit 1
fi

echo "✅ Issue #$ISSUE_NUM criada"
echo ""

# 2. Adicionar comentário
echo "💬 [2/4] Adicionando comentário..."
node "$SCRIPT_DIR/add-comment.js" \
  --repo "$REPO" \
  --number "$ISSUE_NUM" \
  --body "This issue was created by an automated workflow. Status: IN_PROGRESS"

echo "✅ Comentário adicionado"
echo ""

# 3. Adicionar mais labels
echo "🏷️  [3/4] Adicionando labels adicionais..."
node "$SCRIPT_DIR/add-labels.js" \
  --repo "$REPO" \
  --number "$ISSUE_NUM" \
  --labels "workflow,automated"

echo "✅ Labels adicionados"
echo ""

# 4. Fechar issue
echo "🔴 [4/4] Fechando issue..."
node "$SCRIPT_DIR/close-issue.js" \
  --repo "$REPO" \
  --number "$ISSUE_NUM"

echo "✅ Issue fechada"
echo ""
echo "========================================="
echo "✨ Workflow completo!"
echo "========================================="
echo ""
echo "📊 Resumo:"
echo "  - Issue #$ISSUE_NUM criada e processada"
echo "  - Comentário adicionado"
echo "  - Labels: $LABELS, workflow, automated"
echo "  - Status: CLOSED"
echo ""
