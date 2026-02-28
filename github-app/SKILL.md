---
name: github-app
description: "🐙 Acesso: GitHub API v3 (via GitHub App com autenticação segura). Clona repos privados, cria/gerencia issues e PRs, faz commits e protege branches sem expor tokens. Quando usar: acessar repositórios, documentar progresso, submeter mudanças para review, auditar commits. Proativo: quando mencionar repo, automaticamente clonar; ao completar trabalho, criar issue de documentação; ao fazer push, criar PR automaticamente. Exemplos: 'Clone landing-page-saas' → clona e prepara; 'Terminei o design' → cria issue documentando; 'Review commits' → lista e resume mudanças."
homepage: https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps
metadata:
  {
    "openclaw":
      {
        "emoji": "🐙",
        "requires": { "bins": ["node"], "env": ["GITHUB_APP_ID", "GITHUB_APP_INSTALLATION_ID", "GITHUB_APP_PRIVATE_KEY_PATH"] }
      }
  }
---

# GitHub App Skill 🐙

Automação segura de GitHub sem expor tokens. Clonar repos private, criar/gerenciar issues e PRs, fazer commits e proteger branches — tudo com autenticação segura via GitHub App.

**Credenciais obrigatórias** (configuradas em `~/.openclaw/openclaw.json`):
- `GITHUB_APP_ID` - ID da app
- `GITHUB_APP_INSTALLATION_ID` - ID da instalação
- `GITHUB_APP_PRIVATE_KEY_PATH` - Caminho da chave privada PEM

---

## 📋 Quando Usar (Casos de Uso)

### ✅ Use este skill para:

| Caso | Comando | Por quê |
|------|---------|--------|
| **Clonar repo private** | `clone` + token | Acesso seguro sem PAT visível |
| **Criar issue automaticamente** | `create-issue.js` | Documentar bugs, tasks, requisitos |
| **Criar PR automaticamente** | `create-pr.js` | Submeter mudanças automaticamente |
| **Revisar o trabalho recente** | `list-commits.js` | Auditar mudanças antes de merge |
| **Gerenciar releases** | `create-issue.js` com labels | Rastrear releases como workflow |
| **Proteger branches importantes** | `protect-branch.js` | Garantir qualidade: PR + review obrigatório |
| **Atualizar documentação em repo** | `clone` + `git push` | Versionar docs junto com código |
| **Fechar issues automaticamente** | `close-issue.js` | Quando uma task é completada |

### ❌ NÃO use este skill para:

- Deletar repositórios (operação destruidora, exige confirmação manual)
- Operações que precisam de contexto humano (decisões sobre PRs)

---

## 🚀 Uso Proativo (Quando o Assistente Deve Usar Automaticamente)

### Situação 1: Clonar Repositório de Projeto
**Quando:** Você menciona um repo alternativedown que precisa trabalhar
```bash
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
git clone https://x-access-token:${TOKEN}@github.com/alternative-down/repo-name.git
```
**Por quê:** Acesso seguro a repos private sem expor credenciais

---

### Situação 2: Documentar Progresso com Issues
**Quando:** Completou uma tarefa e quer registrar no GitHub
```bash
node {baseDir}/scripts/create-issue.js \
  --repo alternative-down/repo-name \
  --title "Tarefa: [Descrição do trabalho realizado]" \
  --body "Completado em [data]. Status: concluído." \
  --labels "documentation,completed"
```
**Por quê:** Rastreamento centralizador, histórico persistente

---

### Situação 3: Submeter Mudanças via PR
**Quando:** Fez mudanças em um projeto e quer submeter pra review
```bash
# 1. Clone
TOKEN=$(node {baseDir}/scripts/mint_installation_token.js)
git clone https://x-access-token:${TOKEN}@github.com/alternative-down/repo.git

# 2. Create feature branch
git checkout -b feature/nova-funcionalidade

# 3. Commit changes
git add -A && git commit -m "feat: descrição clara"

# 4. Push
git push https://x-access-token:${TOKEN}@github.com/alternative-down/repo.git feature/nova-funcionalidade

# 5. Create PR
node {baseDir}/scripts/create-pr.js \
  --repo alternative-down/repo \
  --title "feat: descrição clara" \
  --head feature/nova-funcionalidade \
  --base main \
  --body "Mudanças realizadas: ..."
```
**Por quê:** Workflow completo, auditável, com PR para review

---

### Situação 4: Auditar Mudanças Recentes
**Quando:** Quer revisar o que foi commitado antes de fazer merge
```bash
node {baseDir}/scripts/list-commits.js \
  --repo alternative-down/repo-name \
  --branch main \
  --limit 10
```
**Por quê:** Entender o que foi feito, por quem, quando

---

### Situação 5: Proteger Branch Importante
**Quando:** Quer garantir que main tenha padrão de qualidade (PR obrigatório)
```bash
node {baseDir}/scripts/protect-branch.js \
  --repo alternative-down/repo-name \
  --branch main \
  --require_pr true \
  --require_review true
```
**Por quê:** Evita commits diretos em main, force code review

---

## 🔍 Queries - Listar & Auditar

### 📦 Listar Repositórios da Organização

```bash
node {baseDir}/scripts/queries/list-repos.js
```

**Output esperado:**
```
📦 Repositórios (5 total)

1. 🔒 micro-saas-platform • TypeScript
   └─ Último push: 26/02/26, 23:50
2. 🌐 landing-page-saas • TypeScript
   └─ Último push: 27/02/26, 21:16
```

**Use quando:** Precisa relembrar nomes/status de repos

---

### 📋 Listar Issues (Abiertas, Pendentes, Completadas)

```bash
# Issues abertas
node {baseDir}/scripts/queries/list-issues.js --repo alternative-down/repo-name --state open

# Issues fechadas
node {baseDir}/scripts/queries/list-issues.js --repo alternative-down/repo-name --state closed

# Todas
node {baseDir}/scripts/queries/list-issues.js --repo alternative-down/repo-name --state all

# Filtrar por autor
node {baseDir}/scripts/queries/list-issues.js --repo alternative-down/repo-name --author "nicolasfraga"
```

**Use quando:** Quer revisar tarefas abertas ou histórico

---

### 🔀 Listar Pull Requests

```bash
# PRs abertos (aguardando review/merge)
node {baseDir}/scripts/queries/list-prs.js --repo alternative-down/repo-name --state open

# PRs da feature branch específica
node {baseDir}/scripts/queries/list-prs.js --repo alternative-down/repo-name --head feature-branch
```

**Use quando:** Quer saber o que tá aguardando merge

---

### 🌿 Listar Branches

```bash
node {baseDir}/scripts/queries/list-branches.js --repo alternative-down/repo-name

# Filtrar por padrão (ex: feature/*)
node {baseDir}/scripts/queries/list-branches.js --repo alternative-down/repo-name --pattern "feature/*"
```

**Use quando:** Quer saber quais feature branches estão ativas

---

### 📝 Listar Commits Recentes

```bash
# Últimos 10 commits da main
node {baseDir}/scripts/queries/list-commits.js \
  --repo alternative-down/repo-name \
  --branch main \
  --limit 10

# Commits de um author específico
node {baseDir}/scripts/queries/list-commits.js \
  --repo alternative-down/repo-name \
  --author "nicolasfraga"
```

**Use quando:** Auditar o que foi feito, rastrear mudanças

---

## 🔧 Ações - Repositórios

### 📦 Criar Novo Repositório

```bash
node {baseDir}/scripts/actions/create-repo.js \
  --name novo-projeto \
  --description "Descrição clara do projeto" \
  --private true \
  --issues true \
  --projects true
```

**Parâmetros:**
- `--name` (obrigatório) - Nome único
- `--description` (opcional) - Descrição clara
- `--private` (padrão: false) - true para repos internos
- `--issues` (padrão: true) - Habilitar issues
- `--projects` (padrão: true) - Habilitar project boards

**Exemplos:**
```bash
# Repo público com docs
node create-repo.js --name docs --description "Documentação pública" --private false

# Repo privado interno
node create-repo.js --name internal-tools --description "Tools internas" --private true
```

---

### 📊 Obter Informações Completas do Repo

```bash
node {baseDir}/scripts/actions/get-repo-info.js --repo alternative-down/repo-name
```

**Retorna:**
- Stars, forks, watchers
- Linguagem principal, tamanho
- Datas de criação/última atualização
- Se tá archived, se tá fork

**Use quando:** Quer status completo de um repo

---

### ✏️ Atualizar Repo (Descrição, Privacidade, Settings)

```bash
node {baseDir}/scripts/actions/update-repo.js \
  --repo alternative-down/repo-name \
  --description "Nova descrição" \
  --private true
```

**Parâmetros:**
- `--repo` (obrigatório) - owner/repo-name
- `--description` - Nova descrição
- `--private` - Mudar para private/public
- `--issues` - Habilitar/desabilitar
- `--projects` - Habilitar/desabilitar

---

### 🗑️ Deletar Repositório

```bash
node {baseDir}/scripts/actions/delete-repo.js --repo alternative-down/repo-name
```

⚠️ **CUIDADO:** Requer confirmação manual. Destruidor.

---

### 🔒 Proteger Branch (Force PR & Review)

```bash
node {baseDir}/scripts/actions/protect-branch.js \
  --repo alternative-down/repo-name \
  --branch main \
  --require_pr true \
  --require_review true
```

**Parâmetros:**
- `--repo` - owner/repo-name
- `--branch` - Nome da branch (ex: main, production)
- `--require_pr` - Exigir PR antes de merge
- `--require_review` - Exigir 1+ review aprovado

**Use para:** Proteger branches críticas (main, production)

---

## ✏️ Ações - Issues, PRs, Labels

### 📌 Criar Issue

```bash
node {baseDir}/scripts/actions/create-issue.js \
  --repo alternative-down/repo-name \
  --title "Bug: X quebrado" \
  --body "Descrição do problema. Steps to reproduce. Expected vs Actual." \
  --labels "bug,p1,urgent"
```

**Boas labels:**
- `bug` - Defecto
- `feature` - Feature request
- `documentation` - Docs
- `p0, p1, p2` - Priority
- `urgent` - Precisa ASAP
- `ready-for-review` - Pronto pra revisar

---

### 💬 Adicionar Comentário em Issue/PR

```bash
node {baseDir}/scripts/actions/add-comment.js \
  --repo alternative-down/repo-name \
  --number 42 \
  --body "Comentário aqui. Pode ser update de progresso, perguntas, etc."
```

**Use para:** Atualizar progresso, fazer perguntas, sugerir mudanças

---

### 🏷️ Adicionar Labels a Issue/PR Existente

```bash
node {baseDir}/scripts/actions/add-labels.js \
  --repo alternative-down/repo-name \
  --number 42 \
  --labels "reviewed,ready-to-merge"
```

---

### 🔀 Criar Pull Request

```bash
node {baseDir}/scripts/actions/create-pr.js \
  --repo alternative-down/repo-name \
  --title "feat: descrição clara da mudança" \
  --head feature-branch \
  --base main \
  --body "## O que mudou
- Mudança 1
- Mudança 2

## Por quê
Explica o motivo.

## Testing
Como testar esta mudança." \
  --draft false
```

**Dica:** Se ainda tá work-in-progress, use `--draft true` pra marcar como DRAFT

---

### 🟣 Mergear Pull Request

```bash
node {baseDir}/scripts/actions/merge-pr.js \
  --repo alternative-down/repo-name \
  --number 42 \
  --method merge  # ou 'squash' ou 'rebase'
```

**Métodos:**
- `merge` - Cria merge commit (preserva histórico)
- `squash` - Combina todos commits em 1 (história limpa)
- `rebase` - Reaplica commits (história linear)

**Escolha:**
- Features grandes → `merge`
- Fixes pequenos → `squash`
- Commits bem organizados → `rebase`

---

### 🔴 Fechar Issue

```bash
node {baseDir}/scripts/actions/close-issue.js \
  --repo alternative-down/repo-name \
  --number 42
```

**Use quando:** Issue foi resolvido/não precisa mais

---

### 🗑️ Deletar Branch

```bash
node {baseDir}/scripts/actions/delete-branch.js \
  --repo alternative-down/repo-name \
  --branch feature-branch
```

⚠️ Não pode deletar branches protegidas (main, master, production)

---

## 🔐 Git Operations - Clone, Pull, Push

### Clone Repository (Private ou Public)

```bash
TOKEN=$(node {baseDir}/scripts/auth/mint_installation_token.js)
git clone https://x-access-token:${TOKEN}@github.com/alternative-down/repo-name.git
```

**Vantagem:** Sem expor PAT em command history

---

### Pull com Rebase

```bash
TOKEN=$(node {baseDir}/scripts/auth/mint_installation_token.js)
git -C /path/to/repo pull --rebase https://x-access-token:${TOKEN}@github.com/alternative-down/repo-name.git main
```

**Use:** Atualizar repo local sem merge commits

---

### Push para Repository

```bash
TOKEN=$(node {baseDir}/scripts/auth/mint_installation_token.js)
git -C /path/to/repo push https://x-access-token:${TOKEN}@github.com/alternative-down/repo-name.git main
```

**Erro comum:** "fetch first" → execute `pull --rebase` antes

---

## 🧪 Gerar Token (Uso Manual)

Se precisar do token puro pra chamadas customizadas:

```bash
node {baseDir}/scripts/auth/mint_installation_token.js
```

Retorna token válido por ~1 hora. Use em curl/wget:

```bash
TOKEN=$(node {baseDir}/scripts/auth/mint_installation_token.js)

# Buscar issue específico
curl -H "Authorization: Bearer ${TOKEN}" \
  https://api.github.com/repos/alternative-down/repo/issues/42

# Criar issue via API pura
curl -X POST -H "Authorization: Bearer ${TOKEN}" \
  -d '{"title":"Issue title","body":"Issue body"}' \
  https://api.github.com/repos/alternative-down/repo/issues
```

---

## 🛡️ Boas Práticas

| Prática | Por quê |
|---------|--------|
| ✅ Gerar token novo quando expirou (1h) | Evita erros de 401 Unauthorized |
| ✅ Nunca logar o token | Segurança - token é secreto |
| ✅ Sempre usar GitHub App, não PAT | GitHub App = permissões granulares + rotação automática |
| ✅ Fazer `pull --rebase` antes de push | Evita "fetch first" errors |
| ✅ Testar mudanças localmente antes | Detecta problemas antes de commitrar |
| ✅ Usar PRs ao invés de push direto | Code review force, auditoria melhor |
| ❌ Não commitar diretamente em main | Proteja main com branch protection |
| ❌ Não usar `git push --force` | Pode reescrever histórico |

---

## 📚 Estrutura de Scripts

```
scripts/
├── queries/          # Read-only: listar, buscar
│   ├── list-repos.js
│   ├── list-issues.js
│   ├── list-prs.js
│   ├── list-branches.js
│   └── list-commits.js
├── actions/          # Write: criar, atualizar, deletar
│   ├── create-repo.js
│   ├── create-issue.js
│   ├── create-pr.js
│   ├── update-repo.js
│   ├── merge-pr.js
│   ├── close-issue.js
│   ├── protect-branch.js
│   └── delete-*.js
├── auth/             # Autenticação
│   └── mint_installation_token.js
└── utilities/        # Helpers
    └── api-helper.js
```

---

## 🔗 Recursos Externos

- [GitHub App Docs](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps)
- [GitHub REST API Reference](https://docs.github.com/en/rest)
- [GitHub App Best Practices](https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/best-practices-for-creating-a-github-app)
