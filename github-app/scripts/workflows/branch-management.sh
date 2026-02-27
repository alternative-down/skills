#!/bin/bash
# Branch Management & Protection
# Automatiza: Listar branches → Proteger main → Deletar branches antigas

set -e

REPO="${1:-alternative-down/skills}"
ACTION="${2:-status}"  # status, protect, cleanup

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================="
echo "🌿 BRANCH MANAGEMENT"
echo "========================================="
echo ""
echo "Repository: $REPO"
echo "Action: $ACTION"
echo ""

case "$ACTION" in
  status)
    echo "📋 Listing all branches..."
    echo "========================================="
    node "$SCRIPT_DIR/queries/list-branches.js" --repo "$REPO"
    ;;

  protect)
    echo "🔒 Protecting main branch..."
    echo "========================================="
    node "$SCRIPT_DIR/branches/protect-branch.js" \
      --repo "$REPO" \
      --branch main \
      --require_pr true \
      --require_review false
    
    echo ""
    echo "✅ Main branch protected!"
    ;;

  cleanup)
    echo "🗑️  Cleaning up old branches (requires manual input)..."
    echo ""
    echo "Usage to delete a specific branch:"
    echo "  $0 $REPO delete-branch <branch-name>"
    ;;

  delete-branch)
    BRANCH_NAME="${3}"
    if [ -z "$BRANCH_NAME" ]; then
      echo "❌ Branch name required"
      echo "Usage: $0 $REPO delete-branch <branch-name>"
      exit 1
    fi
    
    echo "🗑️  Deleting branch: $BRANCH_NAME"
    echo "========================================="
    node "$SCRIPT_DIR/branches/delete-branch.js" \
      --repo "$REPO" \
      --branch "$BRANCH_NAME"
    
    echo ""
    echo "✅ Branch deleted!"
    ;;

  *)
    echo "❌ Unknown action: $ACTION"
    echo ""
    echo "Available actions:"
    echo "  status         - List all branches"
    echo "  protect        - Protect main branch"
    echo "  cleanup        - Show cleanup help"
    echo "  delete-branch  - Delete a specific branch"
    exit 1
    ;;
esac

echo ""
echo "========================================="
echo "✨ Done!"
echo "========================================="
echo ""
