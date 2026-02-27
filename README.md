# OpenClaw Skills

Repositório de skills (habilidades) para **OpenClaw** — automações reutilizáveis para agentes IA.

## 📦 Skills Disponíveis

### 🐙 github-app

**Automação completa do GitHub via GitHub App**

Acesso seguro ao GitHub sem expor tokens. Suporta operações em repositórios, issues, PRs, branches, commits e reviews.

**22 scripts prontos para produção:**

#### 📊 Queries (5)
- `list-repos` — Lista repositórios da organização
- `list-issues` — Lista issues com filtros
- `list-prs` — Lista pull requests
- `list-branches` — Lista branches
- `list-commits` — Lista commits

#### 📝 Issues & Comments (4)
- `create-issue` — Criar issue
- `add-comment` — Comentar em issues/PRs
- `add-labels` — Adicionar labels
- `close-issue` — Fechar issue

#### 🔀 Pull Requests (4)
- `create-pr` — Criar PR
- `merge-pr` — Mergear PR (merge/squash/rebase)
- `list-reviews` — Listar reviews
- `create-review` — Deixar review (APPROVE/REQUEST_CHANGES/COMMENT)
- `request-reviewers` — Atribuir reviewers
- `get-pr-diff` — Obter diff completo

#### 🌿 Branches (2)
- `delete-branch` — Deletar branch
- `protect-branch` — Proteger branch

#### 📦 Repositórios (4)
- `create-repo` — Criar repositório
- `get-repo-info` — Informações do repo
- `update-repo` — Atualizar configurações
- `delete-repo` — Deletar repositório

#### 🔐 Autenticação (1)
- `mint_installation_token` — Gerar token temporário

---

## 🚀 Começar

### Setup

Skill já configurada em `~/.openclaw/skills/github-app/` com credenciais via `openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "github-app": {
        "enabled": true,
        "env": {
          "GITHUB_APP_ID": "...",
          "GITHUB_APP_INSTALLATION_ID": "...",
          "GITHUB_APP_PRIVATE_KEY_PATH": "..."
        }
      }
    }
  }
}
```

### Uso Rápido

```bash
# Listar repos
node ~/.openclaw/skills/github-app/scripts/list-repos.js

# Criar issue
node ~/.openclaw/skills/github-app/scripts/create-issue.js \
  --repo owner/repo \
  --title "Título" \
  --body "Descrição" \
  --labels "bug,urgent"

# Listar issues abertas
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo owner/repo \
  --state open

# Deixar review em PR
node ~/.openclaw/skills/github-app/scripts/create-review.js \
  --repo owner/repo \
  --number 42 \
  --event APPROVE \
  --body "Looks good!"
```

---

## 📚 Documentação

- **[github-app/SKILL.md](./github-app/SKILL.md)** — Documentação completa com exemplos
- **[docs/](./docs/)** — Guias avançados e troubleshooting

---

## 🔧 Estrutura

```
skills/
├── README.md                      # Este arquivo
├── docs/                          # Documentação extra
│   ├── API_REFERENCE.md
│   ├── EXAMPLES.md
│   └── TROUBLESHOOTING.md
├── github-app/
│   ├── SKILL.md                   # Documentação oficial
│   ├── scripts/                   # 22 scripts prontos
│   │   ├── list-repos.js
│   │   ├── create-issue.js
│   │   ├── create-review.js
│   │   └── ... (19 mais)
│   └── references/                # Materiais de referência
└── dist/                          # Build artifacts
```

---

## ✨ Features

✅ **Autenticação segura** via GitHub App (sem PAT)  
✅ **Operações completas** em repositórios, issues, PRs, branches  
✅ **22 scripts** prontos para produção  
✅ **Padrão consistente** — mintToken(), parseArgs(), HTTPS requests  
✅ **Documentação detalhada** com exemplos  
✅ **Testado** contra repositório real (alternative-down/skills)  

---

## 🤝 Uso em Agentes

Skills são injetados automaticamente em todos os agentes OpenClaw:

```javascript
// Dentro de um agente, chamar qualquer script
const { execSync } = require('child_process');

const repos = execSync(
  'node ~/.openclaw/skills/github-app/scripts/list-repos.js'
).toString();
```

---

## 📖 Referências

- [GitHub App Documentation](https://docs.github.com/en/apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [OpenClaw Docs](https://docs.openclaw.ai)

---

**Mantido por:** Kael  
**Última atualização:** 2026-02-27  
**Versão:** 1.0.0
