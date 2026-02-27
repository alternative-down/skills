---
name: github-app
description: "Operar GitHub via GitHub App com autenticação segura. Listar repositórios, issues, PRs, branches, commits e fazer operações de git sem PAT."
metadata:
  {
    "openclaw":
      {
        "emoji": "🐙",
        "requires": { "bins": ["node"], "env": ["GITHUB_APP_ID", "GITHUB_APP_INSTALLATION_ID", "GITHUB_APP_PRIVATE_KEY_PATH"] },
        "homepage": "https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps",
      },
  }
---

# GitHub App Skill

Autenticação segura no GitHub via GitHub App (sem PAT, sem expor credenciais).

**Credenciais obrigatórias** (configuradas em `~/.openclaw/openclaw.json`):
- `GITHUB_APP_ID` - ID da app
- `GITHUB_APP_INSTALLATION_ID` - ID da instalação
- `GITHUB_APP_PRIVATE_KEY_PATH` - Caminho da chave privada PEM

---

## 📦 Listar Repositórios

```bash
# Lista todos os repos da organização instalada
node {baseDir}/scripts/list-repos.js

# Exemplo de output:
# 1. repo-name (TypeScript, privado, últimas 20:10:54 em 2026-02-26)
```

---

## 📋 Listar Issues

```bash
# Lista issues abertas em um repo
node {baseDir}/scripts/list-issues.js --repo owner/repo-name --state open

# Com filtro de autor
node {baseDir}/scripts/list-issues.js --repo owner/repo-name --author usuario

# Possíveis valores para --state: open, closed, all
```

---

## 🔀 Listar Pull Requests

```bash
# Lista PRs abertos
node {baseDir}/scripts/list-prs.js --repo owner/repo-name --state open

# Com filtro de head branch
node {baseDir}/scripts/list-prs.js --repo owner/repo-name --head feature-branch
```

---

## 🌿 Listar Branches

```bash
# Lista todos os branches
node {baseDir}/scripts/list-branches.js --repo owner/repo-name

# Filtrar por padrão
node {baseDir}/scripts/list-branches.js --repo owner/repo-name --pattern "feature/*"
```

---

## 📝 Listar Commits

```bash
# Últimos 10 commits da branch main
node {baseDir}/scripts/list-commits.js --repo owner/repo-name --branch main --limit 10

# Com filtro de autor
node {baseDir}/scripts/list-commits.js --repo owner/repo-name --author "João"
```

---

## 🔐 Git Operations

### Clone com autenticação

```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
git clone https://x-access-token:${TOKEN}@github.com/owner/repo.git
```

### Pull/Rebase

```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
git -C /path/to/repo pull --rebase https://x-access-token:${TOKEN}@github.com/owner/repo.git main
```

### Push

```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
git -C /path/to/repo push https://x-access-token:${TOKEN}@github.com/owner/repo.git main
```

---

---

## ✏️ AÇÕES - Criar / Atualizar / Deletar

### 📌 Criar Issue

```bash
node {baseDir}/scripts/create-issue.js \
  --repo owner/repo-name \
  --title "Título da issue" \
  --body "Descrição detalhada" \
  --labels "bug,urgent"
```

**Parâmetros:**
- `--repo` (obrigatório) - owner/repo-name
- `--title` (obrigatório) - Título
- `--body` (opcional) - Descrição
- `--labels` (opcional) - Labels separados por vírgula

---

### 🔴 Fechar Issue

```bash
node {baseDir}/scripts/close-issue.js \
  --repo owner/repo-name \
  --number 42
```

---

### 💬 Adicionar Comentário em Issue/PR

```bash
node {baseDir}/scripts/add-comment.js \
  --repo owner/repo-name \
  --number 42 \
  --body "Comentário aqui"
```

---

### 🏷️ Adicionar Labels a Issue/PR

```bash
node {baseDir}/scripts/add-labels.js \
  --repo owner/repo-name \
  --number 42 \
  --labels "bug,critical,p1"
```

---

### 🔀 Criar Pull Request

```bash
node {baseDir}/scripts/create-pr.js \
  --repo owner/repo-name \
  --title "Título do PR" \
  --head feature-branch \
  --base main \
  --body "Descrição das mudanças" \
  --draft false
```

**Parâmetros:**
- `--repo` (obrigatório) - owner/repo-name
- `--title` (obrigatório) - Título
- `--head` (obrigatório) - Branch fonte (feature-branch)
- `--base` (opcional, padrão: main) - Branch destino
- `--body` (opcional) - Descrição
- `--draft` (opcional, padrão: false) - Criar como DRAFT

---

### 🟣 Mergear Pull Request

```bash
node {baseDir}/scripts/merge-pr.js \
  --repo owner/repo-name \
  --number 42 \
  --method merge \
  --title "Opcional: título commit customizado" \
  --message "Opcional: mensagem commit customizada"
```

**Parâmetros:**
- `--repo` (obrigatório) - owner/repo-name
- `--number` (obrigatório) - Número do PR
- `--method` (opcional, padrão: merge) - merge | squash | rebase
- `--title` (opcional) - Título customizado do commit
- `--message` (opcional) - Mensagem customizada do commit

---

### 🗑️ Deletar Branch

```bash
node {baseDir}/scripts/delete-branch.js \
  --repo owner/repo-name \
  --branch feature-branch
```

⚠️ **Não é possível deletar branches principais (main, master)**

---

## 🔧 Gerar Token (Uso Manual)

Se precisar do token direto:

```bash
node {baseDir}/scripts/mint_installation_token.js
```

Retorna um token temporário válido por ~1 hora. Use em chamadas diretas à API GitHub:

```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
curl -H "Authorization: Bearer ${TOKEN}" \
  https://api.github.com/repos/owner/repo
```

---

## ⚙️ Chamadas API Customizadas

Para queries não cobertos acima, use a API diretamente:

```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)

# Buscar um issue específico
curl -H "Authorization: Bearer ${TOKEN}" \
  https://api.github.com/repos/owner/repo/issues/42

# Criar uma issue
curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -d '{"title":"Novo issue","body":"Descrição"}' \
  https://api.github.com/repos/owner/repo/issues
```

---

## 🛡️ Regras de Operação

- ✅ **Nunca logar tokens** em resposta ou arquivo
- ✅ **Renovar token conforme necessário** (válido ~1h)
- ✅ **Preferir GitHub App a PAT** em produção
- ✅ **Em erro `fetch first` no push**: executar `pull --rebase` primeiro
- ✅ **Testar mudanças localmente** antes de push

---

## 📚 Recursos

- Script de mint: `scripts/mint_installation_token.js`
- Documentação GitHub App: https://docs.github.com/en/apps
- API Reference: https://docs.github.com/en/rest
