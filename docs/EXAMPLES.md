# GitHub App - Exemplos Práticos

Casos de uso comuns e como implementar com os scripts disponíveis.

---

## 1. Workflow de Issue Tracking

**Objetivo:** Criar issue → Comentar → Adicionar labels → Fechar

```bash
#!/bin/bash

REPO="alternative-down/skills"
TITLE="Test Issue: PR Review Workflow"
BODY="Testing the new review scripts"
LABELS="test,automation"

# 1. Criar issue
ISSUE=$(node ~/.openclaw/skills/github-app/scripts/create-issue.js \
  --repo "$REPO" \
  --title "$TITLE" \
  --body "$BODY" \
  --labels "$LABELS" | grep -oE '#[0-9]+' | head -1 | tr -d '#')

echo "Issue criada: #$ISSUE"

# 2. Adicionar comentário
node ~/.openclaw/skills/github-app/scripts/add-comment.js \
  --repo "$REPO" \
  --number "$ISSUE" \
  --body "Testando automação de comentários"

# 3. Adicionar mais labels
node ~/.openclaw/skills/github-app/scripts/add-labels.js \
  --repo "$REPO" \
  --number "$ISSUE" \
  --labels "high-priority,devshop"

# 4. Fechar issue
node ~/.openclaw/skills/github-app/scripts/close-issue.js \
  --repo "$REPO" \
  --number "$ISSUE"
```

---

## 2. Automação de PR Review

**Objetivo:** Criar PR → Atribuir reviewers → Deixar review → Mergear

```bash
#!/bin/bash

REPO="alternative-down/skills"
PR_BRANCH="feature-new-api"
PR_TITLE="Implement new API endpoint"
PR_BODY="This PR adds support for async operations"

# 1. Criar PR
node ~/.openclaw/skills/github-app/scripts/create-pr.js \
  --repo "$REPO" \
  --title "$PR_TITLE" \
  --head "$PR_BRANCH" \
  --base main \
  --body "$PR_BODY"

# Extrair número do PR da saída
PR_NUMBER=1

# 2. Atribuir reviewers
node ~/.openclaw/skills/github-app/scripts/request-reviewers.js \
  --repo "$REPO" \
  --number "$PR_NUMBER" \
  --reviewers "developer1,developer2"

# 3. Listar reviews (para verificar estado)
node ~/.openclaw/skills/github-app/scripts/list-reviews.js \
  --repo "$REPO" \
  --number "$PR_NUMBER"

# 4. Deixar review de aprovação
node ~/.openclaw/skills/github-app/scripts/create-review.js \
  --repo "$REPO" \
  --number "$PR_NUMBER" \
  --event APPROVE \
  --body "Código está limpo e bem testado. 👍"

# 5. Mergear PR
node ~/.openclaw/skills/github-app/scripts/merge-pr.js \
  --repo "$REPO" \
  --number "$PR_NUMBER" \
  --method squash \
  --title "Implement new API endpoint" \
  --message "Feature release: async operation support"
```

---

## 3. Monitoramento de Repositório

**Objetivo:** Listar PRs abertos, issues pendentes, commits recentes

```bash
#!/bin/bash

REPO="alternative-down/skills"

echo "=== REPOSITÓRIO: $REPO ==="

# Info geral
node ~/.openclaw/skills/github-app/scripts/get-repo-info.js \
  --repo "$REPO"

echo ""
echo "=== PRs ABERTOS ==="
node ~/.openclaw/skills/github-app/scripts/list-prs.js \
  --repo "$REPO" \
  --state open

echo ""
echo "=== ISSUES ABERTAS ==="
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo "$REPO" \
  --state open

echo ""
echo "=== ÚLTIMOS 5 COMMITS ==="
node ~/.openclaw/skills/github-app/scripts/list-commits.js \
  --repo "$REPO" \
  --branch main \
  --limit 5
```

---

## 4. Gestão de Branches

**Objetivo:** Listar branches → Proteger main → Deletar branches antigas

```bash
#!/bin/bash

REPO="alternative-down/skills"

# 1. Listar todas as branches
echo "=== BRANCHES ==="
node ~/.openclaw/skills/github-app/scripts/list-branches.js \
  --repo "$REPO"

# 2. Proteger branch main
echo ""
echo "=== PROTEGENDO MAIN ==="
node ~/.openclaw/skills/github-app/scripts/protect-branch.js \
  --repo "$REPO" \
  --branch main \
  --require_pr true \
  --require_review true

# 3. Deletar branch de desenvolvimento (usar com cuidado!)
echo ""
echo "=== DELETANDO BRANCH ==="
node ~/.openclaw/skills/github-app/scripts/delete-branch.js \
  --repo "$REPO" \
  --branch "feature-old-api"
```

---

## 5. Integração com Agente IA

**Objetivo:** Usar dentro de um agente OpenClaw para análise de PR

```javascript
const { execSync } = require('child_process');

async function analyzePR(repo, prNumber) {
  try {
    // 1. Obter diff do PR
    const diff = execSync(
      `node ~/.openclaw/skills/github-app/scripts/get-pr-diff.js \\
        --repo ${repo} \\
        --number ${prNumber} --format diff`
    ).toString();

    // 2. Listar reviews existentes
    const reviews = execSync(
      `node ~/.openclaw/skills/github-app/scripts/list-reviews.js \\
        --repo ${repo} \\
        --number ${prNumber}`
    ).toString();

    // 3. Deixar comentário com análise
    const analysis = `
## Code Review Analysis

**Diff Analysis:**
- Files changed: ${(diff.match(/^diff --git/gm) || []).length}
- Lines added: ${(diff.match(/^\+(?!\+\+)/gm) || []).length}
- Lines removed: ${(diff.match(/^\-(?!\-\-)/gm) || []).length}

**Review Status:**
${reviews}

**Recommendation:** Approved for merge
    `;

    execSync(
      `node ~/.openclaw/skills/github-app/scripts/add-comment.js \\
        --repo ${repo} \\
        --number ${prNumber} \\
        --body "${analysis}"`
    );

    // 4. Deixar review formal
    execSync(
      `node ~/.openclaw/skills/github-app/scripts/create-review.js \\
        --repo ${repo} \\
        --number ${prNumber} \\
        --event APPROVE \\
        --body "Automated review: Code quality checks passed"`
    );
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

// Usar
analyzePR('alternative-down/skills', 3);
```

---

## 6. Pipeline de Deploy

**Objetivo:** Verificar PRs mergeáveis → Mergear → Listar commits para release notes

```bash
#!/bin/bash

REPO="alternative-down/skills"
BASE_BRANCH="main"

echo "=== VERIFICANDO PRs MERGEÁVEIS ==="
POPEN=$(node ~/.openclaw/skills/github-app/scripts/list-prs.js \
  --repo "$REPO" \
  --state open)

if [ -z "$POPEN" ]; then
  echo "Nenhum PR aberto"
  exit 0
fi

echo "$POPEN"

# Se houver PRs, mergear automaticamente
echo ""
echo "=== MERGEANDO PRs ==="
# (Implementar lógica de filtro aqui)

# Listar commits para release notes
echo ""
echo "=== COMMITS DESDE ÚLTIMA RELEASE ==="
node ~/.openclaw/skills/github-app/scripts/list-commits.js \
  --repo "$REPO" \
  --branch "$BASE_BRANCH" \
  --limit 20
```

---

## 7. Criar Repositório Novo com Proteções

**Objetivo:** Automatizar setup de novo repo com branch protection

```bash
#!/bin/bash

ORG="alternative-down"
REPO_NAME="novo-projeto"
DESCRIPTION="Novo projeto com automações"

echo "=== CRIANDO REPOSITÓRIO ==="
node ~/.openclaw/skills/github-app/scripts/create-repo.js \
  --name "$REPO_NAME" \
  --description "$DESCRIPTION" \
  --private false \
  --issues true \
  --projects true

sleep 2  # Aguardar criação

echo ""
echo "=== PROTEGENDO BRANCH MAIN ==="
node ~/.openclaw/skills/github-app/scripts/protect-branch.js \
  --repo "$ORG/$REPO_NAME" \
  --branch main \
  --require_pr true \
  --require_review true

echo ""
echo "✅ Repositório pronto:"
echo "   https://github.com/$ORG/$REPO_NAME"
```

---

## 8. Auditoria de Issues

**Objetivo:** Encontrar issues antigas sem resposta

```bash
#!/bin/bash

REPO="alternative-down/skills"

echo "=== AUDITORIA DE ISSUES ==="

# Listar todas as issues abertas
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo "$REPO" \
  --state open | while read -r line; do
  
  # Para cada issue, adicionar label de avaliação
  ISSUE_NUM=$(echo "$line" | grep -oE '#[0-9]+' | head -1)
  
  if [ -n "$ISSUE_NUM" ]; then
    echo "Processando $ISSUE_NUM"
    
    # Adicionar label
    node ~/.openclaw/skills/github-app/scripts/add-labels.js \
      --repo "$REPO" \
      --number "${ISSUE_NUM#\#}" \
      --labels "status-review-needed"
  fi
done
```

---

## 9. Sincronizar Documentação via Commits

**Objetivo:** Listar commits de docs e criar issue de atualização

```bash
#!/bin/bash

REPO="alternative-down/skills"
DOC_COMMITS=$(node ~/.openclaw/skills/github-app/scripts/list-commits.js \
  --repo "$REPO" \
  --branch main \
  --limit 20 | grep -i "docs\|doc\|readme")

if [ -n "$DOC_COMMITS" ]; then
  node ~/.openclaw/skills/github-app/scripts/create-issue.js \
    --repo "$REPO" \
    --title "Sync documentation updates" \
    --body "Recent commits updated docs:\n\n$DOC_COMMITS" \
    --labels "documentation,sync"
fi
```

---

## 10. Obter Token para Uso Manual

**Objetivo:** Chamar API GitHub manualmente com token válido

```bash
#!/bin/bash

TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)

# Usar com curl
curl -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/alternative-down/skills

# Usar com jq
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/alternative-down/skills | jq '.name, .stargazers_count, .watchers_count'
```

---

**Dúvidas?** Consulte [API_REFERENCE.md](./API_REFERENCE.md) ou [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Última atualização:** 2026-02-27
