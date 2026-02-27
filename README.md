# OpenClaw Skills

Repositório de skills (habilidades) para **OpenClaw** — automações reutilizáveis para agentes IA.

## 📦 Skills Disponíveis

### 🐙 github-app

**Automação completa do GitHub via GitHub App**

Acesso seguro ao GitHub sem expor tokens. Suporta operações em repositórios, issues, PRs, branches, commits e reviews.

**28 scripts organizados por contexto + 4 workflows prontos para produção:**

---

## 🚀 Quick Start

### Workflows Prontos (Recomendado para Agentes)

Execute workflows completos com um comando:

#### 1️⃣ Issue Tracking Workflow
```bash
bash ~/.openclaw/skills/github-app/scripts/workflows/issue-tracking-workflow.sh \
  alternative-down/skills \
  "Título da Issue" \
  "Descrição" \
  "label1,label2"
```
✨ Cria issue → comenta → adiciona labels → fecha

#### 2️⃣ PR Review & Merge Workflow
```bash
bash ~/.openclaw/skills/github-app/scripts/workflows/pr-review-workflow.sh \
  alternative-down/skills \
  feature-branch \
  "Título do PR" \
  "Descrição do PR" \
  "reviewer1,reviewer2"
```
✨ Cria PR → atribui reviewers → deixa review → mergeia

#### 3️⃣ Repository Monitoring
```bash
bash ~/.openclaw/skills/github-app/scripts/workflows/repository-monitoring.sh \
  alternative-down/skills
```
✨ Relatório: repo info, PRs, issues, commits recentes

#### 4️⃣ Branch Management
```bash
bash ~/.openclaw/skills/github-app/scripts/workflows/branch-management.sh \
  alternative-down/skills \
  status|protect|cleanup|delete-branch
```
✨ Listar, proteger, ou deletar branches

---

## 📁 Scripts Organizados por Contexto

### 📊 Queries (8 scripts - Leitura & Informação)
```bash
queries/
├── list-repos.js           # Listar repositórios
├── list-issues.js          # Listar issues
├── list-prs.js             # Listar pull requests
├── list-branches.js        # Listar branches
├── list-commits.js         # Listar commits
├── list-reviews.js         # Listar reviews de PR
├── get-repo-info.js        # Informações completas do repo
└── get-pr-diff.js          # Diff completo de PR
```

### 📋 Issues (4 scripts - Gerenciar Issues)
```bash
issues/
├── create-issue.js         # Criar issue
├── close-issue.js          # Fechar issue
├── add-comment.js          # Comentar em issue/PR
└── add-labels.js           # Adicionar labels
```

### 🔀 Pulls (5 scripts - Gerenciar Pull Requests)
```bash
pulls/
├── create-pr.js            # Criar PR
├── merge-pr.js             # Mergear PR
├── create-review.js        # Deixar review (APPROVE/REQUEST_CHANGES/COMMENT)
├── request-reviewers.js    # Atribuir reviewers
└── add-review-comment.js   # Comentar em linha específica
```

### 📦 Repositories (3 scripts - Gerenciar Repositórios)
```bash
repositories/
├── create-repo.js          # Criar repositório
├── update-repo.js          # Atualizar configurações
└── delete-repo.js          # Deletar repositório
```

### 🌿 Branches (2 scripts - Gerenciar Branches)
```bash
branches/
├── delete-branch.js        # Deletar branch
└── protect-branch.js       # Proteger branch
```

### 🔐 Auth (1 script - Autenticação)
```bash
auth/
└── mint_installation_token.js  # Gerar token temporário
```

### 🛠️ Utilities (1 script - Helpers)
```bash
utilities/
└── generate-token.sh           # Gerar token para uso manual
```

### ⚙️ Workflows (4 workflows prontos)
```bash
workflows/
├── issue-tracking-workflow.sh      # Criar/processar issues
├── pr-review-workflow.sh           # Criar/reviewer/merge PRs
├── repository-monitoring.sh        # Relatório do repositório
└── branch-management.sh            # Gerenciar branches
```

---

## 📂 Estrutura Completa do Repositório

```
skills/
├── README.md                       # Este arquivo
├── docs/                           # Documentação extra
│   ├── API_REFERENCE.md           # Referência de todos os scripts
│   ├── EXAMPLES.md                # Exemplos de uso
│   └── TROUBLESHOOTING.md         # Troubleshooting
├── github-app/
│   ├── SKILL.md                   # Documentação oficial
│   └── scripts/
│       ├── queries/               # 📊 Leitura & Informação
│       ├── issues/                # 📋 Gerenciar Issues
│       ├── pulls/                 # 🔀 Gerenciar PRs
│       ├── repositories/          # 📦 Gerenciar Repos
│       ├── branches/              # 🌿 Gerenciar Branches
│       ├── auth/                  # 🔐 Autenticação
│       ├── utilities/             # 🛠️ Helpers
│       ├── workflows/             # ⚙️ Workflows Prontos
│       └── references/            # 📚 Materiais de Referência
└── .gitignore
```

---

## ✨ Features

✅ **28 scripts organizados** — 6 contextos diferentes + utilities  
✅ **4 workflows prontos** — Execute operações complexas com 1 comando  
✅ **Autenticação segura** via GitHub App (sem PAT)  
✅ **Estrutura intuitiva** — Scripts agrupados por função  
✅ **Documentação detalhada** — API reference, exemplos, troubleshooting  
✅ **Testado em produção** — Todos os scripts foram testados  

---

## 🤝 Uso em Agentes

**Para agentes:** Use os workflows prontos ou chame scripts diretamente pelo contexto!

```bash
# ✅ Recomendado (1 linha com workflow)
bash ~/.openclaw/skills/github-app/scripts/workflows/issue-tracking-workflow.sh repo title body labels

# Ou scripts individuais por contexto
node ~/.openclaw/skills/github-app/scripts/queries/list-repos.js
node ~/.openclaw/skills/github-app/scripts/issues/create-issue.js --repo owner/repo --title "Título"
```

---

## 📖 Documentação

- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** — Parâmetros de cada script
- **[EXAMPLES.md](./docs/EXAMPLES.md)** — Exemplos de integração
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** — Solução de problemas

---

## 🔧 Setup

Skill já configurada em `~/.openclaw/skills/github-app/` com credenciais via `openclaw.json`.

Verificar se está ativa:
```bash
ls ~/.openclaw/skills/github-app/scripts/queries/ | head
```

---

## 📞 Referências

- [GitHub App Documentation](https://docs.github.com/en/apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [OpenClaw Docs](https://docs.openclaw.ai)

---

**Mantido por:** Kael  
**Última atualização:** 2026-02-27  
**Versão:** 2.1.0 (Scripts Organizados por Contexto)
