# OpenClaw Skills

Repositório de skills (habilidades) para **OpenClaw** — automações reutilizáveis para agentes IA.

## 📦 Skills Disponíveis

### 🐙 github-app

**Automação completa do GitHub via GitHub App**

Acesso seguro ao GitHub sem expor tokens. Suporta operações em repositórios, issues, PRs, branches, commits e reviews.

**23 scripts individuais + 4 workflows prontos para produção:**

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

## 📚 Individual Scripts

### 📊 Queries (5)
- `list-repos.js` — Lista repositórios da organização
- `list-issues.js` — Lista issues com filtros
- `list-prs.js` — Lista pull requests
- `list-branches.js` — Lista branches
- `list-commits.js` — Lista commits

### 📝 Issues & Comments (4)
- `create-issue.js` — Criar issue
- `add-comment.js` — Comentar em issues/PRs
- `add-labels.js` — Adicionar labels
- `close-issue.js` — Fechar issue

### 🔀 Pull Requests (4)
- `create-pr.js` — Criar PR
- `merge-pr.js` — Mergear PR (merge/squash/rebase)
- `list-reviews.js` — Listar reviews
- `create-review.js` — Deixar review (APPROVE/REQUEST_CHANGES/COMMENT)
- `request-reviewers.js` — Atribuir reviewers
- `get-pr-diff.js` — Obter diff completo

### 🌿 Branches (2)
- `delete-branch.js` — Deletar branch
- `protect-branch.js` — Proteger branch

### 📦 Repositórios (4)
- `create-repo.js` — Criar repositório
- `get-repo-info.js` — Informações do repo
- `update-repo.js` — Atualizar configurações
- `delete-repo.js` — Deletar repositório

### 💬 Code Reviews (1)
- `add-review-comment.js` — Comentar em linhas específicas de código

### 🔐 Autenticação (1)
- `mint_installation_token.js` — Gerar token temporário

### 🛠️ Utilities (1)
- `generate-token.sh` — Gerar token para uso manual

---

## 📁 Estrutura do Repositório

```
skills/
├── README.md                        # Este arquivo
├── docs/                            # Documentação extra
│   ├── API_REFERENCE.md            # Referência de todos os scripts
│   ├── EXAMPLES.md                 # Exemplos de uso
│   └── TROUBLESHOOTING.md          # Troubleshooting
├── github-app/
│   ├── SKILL.md                    # Documentação oficial
│   ├── scripts/
│   │   ├── *.js                    # Scripts individuais (23)
│   │   ├── workflows/              # Workflows prontos (4)
│   │   │   ├── issue-tracking-workflow.sh
│   │   │   ├── pr-review-workflow.sh
│   │   │   ├── repository-monitoring.sh
│   │   │   └── branch-management.sh
│   │   └── utilities/              # Funções auxiliares
│   │       └── generate-token.sh
│   └── references/                 # Materiais de referência
└── .gitignore
```

---

## ✨ Features

✅ **Automação completa** — 23 scripts individuais + 4 workflows  
✅ **Autenticação segura** via GitHub App (sem PAT)  
✅ **Workflows prontos** — Execute operações complexas com 1 comando  
✅ **Organização em subpastas** — Scripts, workflows, utilities separados  
✅ **Documentação detalhada** — API reference, exemplos, troubleshooting  
✅ **Testado em produção** — Todos os scripts foram testados  

---

## 🤝 Uso em Agentes

**Para agentes:** Use os workflows prontos!

```bash
# ✅ Recomendado (1 linha)
bash ~/.openclaw/skills/github-app/scripts/workflows/issue-tracking-workflow.sh repo title body labels

# ou para scripts individuais
node ~/.openclaw/skills/github-app/scripts/create-issue.js --repo owner/repo --title "Título"
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
ls ~/.openclaw/skills/github-app/scripts/ | head
```

---

## 📞 Referências

- [GitHub App Documentation](https://docs.github.com/en/apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [OpenClaw Docs](https://docs.openclaw.ai)

---

**Mantido por:** Kael  
**Última atualização:** 2026-02-27  
**Versão:** 2.0.0 (Workflows + Reorganização)
