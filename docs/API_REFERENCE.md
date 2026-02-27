# GitHub App - API Reference

Referência completa dos scripts e parâmetros disponíveis.

## Authentication

### `mint_installation_token.js`

Gera um token de instalação temporário (válido ~1h).

```bash
node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js
```

**Output:**
```
ghs_xxxxxx...
```

**Uso:**
```bash
TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)
curl -H "Authorization: Bearer ${TOKEN}" https://api.github.com/repos/owner/repo
```

---

## Repositories

### `list-repos.js`

Lista todos os repositórios da organização.

```bash
node ~/.openclaw/skills/github-app/scripts/list-repos.js
```

**Output:**
```
📦 Repositórios (3 total)

1. 🔒 repo-name • TypeScript
   └─ https://github.com/org/repo-name
   └─ Último push: 27/02/26, 11:38
```

---

### `create-repo.js`

Criar novo repositório.

```bash
node ~/.openclaw/skills/github-app/scripts/create-repo.js \
  --name novo-repo \
  --description "Descrição opcional" \
  --private false \
  --issues true \
  --projects true
```

**Parâmetros:**
| Flag | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `--name` | ✅ | string | - | Nome do repositório |
| `--description` | ❌ | string | "" | Descrição |
| `--private` | ❌ | boolean | false | Privado ou público |
| `--issues` | ❌ | boolean | true | Habilitar issues |
| `--projects` | ❌ | boolean | true | Habilitar projects |

---

### `get-repo-info.js`

Informações completas de um repositório.

```bash
node ~/.openclaw/skills/github-app/scripts/get-repo-info.js --repo owner/repo
```

**Output:**
```
📊 repo-name

🌐 PÚBLICO • ✅ ATIVO
📝 Descrição do repositório
🔗 https://github.com/owner/repo

📈 Estatísticas:
   Stars: ⭐ 42
   Forks: 🔀 7
   Issues: 📌 3
   Watchers: 👀 5

⚙️ Configuração:
   Linguagem: TypeScript
   Default Branch: main
   Criado: 27/02/2026
   Atualizado: 27/02/2026
   Push: 27/02/26, 11:38

🛠️ Features:
   Issues: ✅
   Projects: ✅
   Wiki: ❌
   Downloads: ✅
```

---

### `update-repo.js`

Atualizar configurações de um repositório.

```bash
node ~/.openclaw/skills/github-app/scripts/update-repo.js \
  --repo owner/repo \
  --description "Nova descrição" \
  --private false \
  --issues true \
  --projects false
```

---

### `delete-repo.js`

Deletar repositório (requer confirmação).

```bash
node ~/.openclaw/skills/github-app/scripts/delete-repo.js --repo owner/repo
```

⚠️ Pede confirmação antes de deletar.

---

## Issues

### `list-issues.js`

Listar issues com filtros opcionais.

```bash
# Listar abertos
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo owner/repo \
  --state open

# Listar todos
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo owner/repo \
  --state all

# Filtrar por autor
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo owner/repo \
  --author username
```

**Parâmetros:**
| Flag | Required | Type | Options |
|------|----------|------|---------|
| `--repo` | ✅ | string | owner/repo |
| `--state` | ❌ | string | open, closed, all |
| `--author` | ❌ | string | username |

---

### `create-issue.js`

Criar nova issue.

```bash
node ~/.openclaw/skills/github-app/scripts/create-issue.js \
  --repo owner/repo \
  --title "Título obrigatório" \
  --body "Descrição opcional" \
  --labels "bug,urgent,p1"
```

**Parâmetros:**
| Flag | Required | Type | Description |
|------|----------|------|-------------|
| `--repo` | ✅ | string | owner/repo |
| `--title` | ✅ | string | Título da issue |
| `--body` | ❌ | string | Descrição (suporta Markdown) |
| `--labels` | ❌ | string | Labels separados por vírgula |

---

### `close-issue.js`

Fechar issue por número.

```bash
node ~/.openclaw/skills/github-app/scripts/close-issue.js \
  --repo owner/repo \
  --number 42
```

---

### `add-comment.js`

Adicionar comentário em issue ou PR.

```bash
node ~/.openclaw/skills/github-app/scripts/add-comment.js \
  --repo owner/repo \
  --number 42 \
  --body "Comentário em Markdown"
```

---

### `add-labels.js`

Adicionar labels a issue/PR.

```bash
node ~/.openclaw/skills/github-app/scripts/add-labels.js \
  --repo owner/repo \
  --number 42 \
  --labels "bug,critical,p1"
```

---

## Pull Requests

### `list-prs.js`

Listar pull requests com filtros.

```bash
node ~/.openclaw/skills/github-app/scripts/list-prs.js \
  --repo owner/repo \
  --state open \
  --head feature-branch
```

**Parâmetros:**
| Flag | Required | Type | Options |
|------|----------|------|---------|
| `--repo` | ✅ | string | owner/repo |
| `--state` | ❌ | string | open, closed, all |
| `--head` | ❌ | string | branch name |

---

### `create-pr.js`

Criar pull request.

```bash
node ~/.openclaw/skills/github-app/scripts/create-pr.js \
  --repo owner/repo \
  --title "Título obrigatório" \
  --head feature-branch \
  --base main \
  --body "Descrição das mudanças" \
  --draft false
```

**Parâmetros:**
| Flag | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `--repo` | ✅ | string | - | owner/repo |
| `--title` | ✅ | string | - | Título do PR |
| `--head` | ✅ | string | - | Branch com mudanças |
| `--base` | ❌ | string | main | Branch destino |
| `--body` | ❌ | string | "" | Descrição |
| `--draft` | ❌ | boolean | false | Criar como DRAFT |

---

### `merge-pr.js`

Mergear pull request.

```bash
node ~/.openclaw/skills/github-app/scripts/merge-pr.js \
  --repo owner/repo \
  --number 42 \
  --method merge \
  --title "Commit title (optional)" \
  --message "Commit message (optional)"
```

**Parâmetros:**
| Flag | Required | Type | Default | Options |
|------|----------|------|---------|---------|
| `--repo` | ✅ | string | - | owner/repo |
| `--number` | ✅ | string | - | PR number |
| `--method` | ❌ | string | merge | merge, squash, rebase |
| `--title` | ❌ | string | - | Commit title customizado |
| `--message` | ❌ | string | - | Commit message customizada |

---

### `get-pr-diff.js`

Obter diff completo de um PR.

```bash
node ~/.openclaw/skills/github-app/scripts/get-pr-diff.js \
  --repo owner/repo \
  --number 42 \
  --format diff
```

**Parâmetros:**
| Flag | Required | Type | Default | Options |
|------|----------|------|---------|---------|
| `--repo` | ✅ | string | - | owner/repo |
| `--number` | ✅ | string | - | PR number |
| `--format` | ❌ | string | diff | diff, patch |

---

## Reviews

### `list-reviews.js`

Listar reviews de um PR.

```bash
node ~/.openclaw/skills/github-app/scripts/list-reviews.js \
  --repo owner/repo \
  --number 42
```

---

### `create-review.js`

Deixar review em PR (APPROVE, REQUEST_CHANGES, ou COMMENT).

```bash
node ~/.openclaw/skills/github-app/scripts/create-review.js \
  --repo owner/repo \
  --number 42 \
  --event APPROVE \
  --body "Great work!"
```

**Parâmetros:**
| Flag | Required | Type | Options |
|------|----------|------|---------|
| `--repo` | ✅ | string | owner/repo |
| `--number` | ✅ | string | PR number |
| `--event` | ✅ | string | APPROVE, REQUEST_CHANGES, COMMENT |
| `--body` | ❌ | string | - |

---

### `request-reviewers.js`

Atribuir reviewers a um PR.

```bash
node ~/.openclaw/skills/github-app/scripts/request-reviewers.js \
  --repo owner/repo \
  --number 42 \
  --reviewers "user1,user2,user3"
```

**Parâmetros:**
| Flag | Required | Type |
|------|----------|------|
| `--repo` | ✅ | string |
| `--number` | ✅ | string |
| `--reviewers` | ✅ | string (comma-separated) |

---

## Branches

### `list-branches.js`

Listar branches.

```bash
node ~/.openclaw/skills/github-app/scripts/list-branches.js \
  --repo owner/repo \
  --pattern "feature/*"
```

**Parâmetros:**
| Flag | Required | Type | Description |
|------|----------|------|-------------|
| `--repo` | ✅ | string | owner/repo |
| `--pattern` | ❌ | string | Padrão glob (ex: feature/*) |

---

### `delete-branch.js`

Deletar branch.

```bash
node ~/.openclaw/skills/github-app/scripts/delete-branch.js \
  --repo owner/repo \
  --branch feature-branch
```

⚠️ Não é possível deletar main ou master.

---

### `protect-branch.js`

Proteger branch com regras.

```bash
node ~/.openclaw/skills/github-app/scripts/protect-branch.js \
  --repo owner/repo \
  --branch main \
  --require_pr true \
  --require_review false
```

**Parâmetros:**
| Flag | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `--repo` | ✅ | string | - | owner/repo |
| `--branch` | ✅ | string | - | Branch a proteger |
| `--require_pr` | ❌ | boolean | true | Exigir PR |
| `--require_review` | ❌ | boolean | false | Exigir review |

---

## Commits

### `list-commits.js`

Listar commits com filtros.

```bash
node ~/.openclaw/skills/github-app/scripts/list-commits.js \
  --repo owner/repo \
  --branch main \
  --limit 10 \
  --author "John Doe"
```

**Parâmetros:**
| Flag | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `--repo` | ✅ | string | - | owner/repo |
| `--branch` | ❌ | string | main | Branch |
| `--limit` | ❌ | number | 10 | Número de commits |
| `--author` | ❌ | string | - | Filtrar por autor |

---

## Error Handling

Todos os scripts retornam:
- **Status 0** em sucesso
- **Status 1** em erro

**Erros comuns:**

| Error | Causa | Solução |
|-------|-------|---------|
| `401 Unauthorized` | Token inválido/expirado | Renovar com mint_installation_token |
| `404 Not Found` | Repo/issue/PR não existe | Verificar owner/repo e número |
| `422 Unprocessable Entity` | Parâmetros inválidos | Consultar documentação de flags |
| `403 Forbidden` | Sem permissão | Verificar GitHub App permissions |

---

**Última atualização:** 2026-02-27
