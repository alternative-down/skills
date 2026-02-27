# GitHub App - Troubleshooting

Solução de problemas comuns ao usar os scripts.

---

## 🔐 Autenticação

### "No such file or directory" ao rodar script

**Causa:** Path do script está incorreto ou GitHub App não está configurado.

**Solução:**
```bash
# Verificar se o script existe
ls ~/.openclaw/skills/github-app/scripts/list-repos.js

# Verificar variáveis de ambiente
echo $GITHUB_APP_ID
echo $GITHUB_APP_INSTALLATION_ID
echo $GITHUB_APP_PRIVATE_KEY_PATH
```

Se variáveis estão vazias, verificar `~/.openclaw/openclaw.json`:
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

---

### "401 Unauthorized"

**Causa:** Token expirado ou credenciais inválidas.

**Solução:**
```bash
# Token é renovado automaticamente, mas se erro persiste:
# 1. Verificar credenciais no openclaw.json
# 2. Testar mint_installation_token
node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js

# Se vazio, GitHub App pode estar desabilitada
```

---

### "403 Forbidden"

**Causa:** GitHub App não tem permissão para operação.

**Solução:**
1. Ir para GitHub → Settings → Developer Settings → GitHub Apps
2. Selecionar app → Permissions
3. Verificar se tem:
   - ✅ `read:org` / `write:org` (para repos)
   - ✅ `issues:write` (para criar/modificar issues)
   - ✅ `pull_requests:write` (para PRs)
   - ✅ `contents:write` (para branches/commits)

---

## 📦 Repositórios

### "404 Not Found" ao listar/criar issue

**Causa:** Repositório não existe ou app não está instalada nele.

**Solução:**
```bash
# Verificar se repo existe
node ~/.openclaw/skills/github-app/scripts/list-repos.js

# Instalar GitHub App na organização:
# Settings → Installed GitHub Apps → Configure

# Testar acesso
node ~/.openclaw/skills/github-app/scripts/get-repo-info.js \
  --repo owner/repo-name
```

---

### "Repository access denied"

**Causa:** GitHub App não está instalada no repositório.

**Solução:**
1. GitHub → Repository → Settings → Installed GitHub Apps
2. Procurar pela app
3. Se não está → Instalar

---

### "422 Unprocessable Entity" ao criar issue

**Causa:** Parâmetros inválidos ou faltando.

**Solução:**
```bash
# Verificar parâmetros obrigatórios
node ~/.openclaw/skills/github-app/scripts/create-issue.js \
  --repo owner/repo \
  --title "Título é obrigatório"

# Verificar caracteres especiais em labels
# Se label não existe, será criado automaticamente

# Se body tem quebras de linha, usar escape
node ~/.openclaw/skills/github-app/scripts/create-issue.js \
  --repo owner/repo \
  --title "Título" \
  --body "Linha 1\nLinha 2"
```

---

## 🔀 Pull Requests

### "Validation Failed" ao criar PR

**Causa:** Branch não existe ou já existe PR entre essas branches.

**Solução:**
```bash
# Verificar se head branch existe
node ~/.openclaw/skills/github-app/scripts/list-branches.js \
  --repo owner/repo

# Se branch não existe, criar:
TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)
git clone https://x-access-token:${TOKEN}@github.com/owner/repo.git
cd repo
git checkout -b feature-branch
git push origin feature-branch

# Então criar PR
node ~/.openclaw/skills/github-app/scripts/create-pr.js \
  --repo owner/repo \
  --title "Feature" \
  --head feature-branch \
  --base main
```

---

### "Unprocessable Entity" ao mergear PR

**Causa:** 
- PR tem conflitos de merge
- Falha nos checks (branch protection)
- Status checks não passaram

**Solução:**
```bash
# Verificar estado do PR
node ~/.openclaw/skills/github-app/scripts/get-pr-diff.js \
  --repo owner/repo \
  --number 42

# Se tem conflitos, resolver manualmente:
git clone https://github.com/owner/repo.git
git checkout feature-branch
git pull origin main  # Tentar rebase
git push origin feature-branch  # Force push se necessário
```

---

### "Cannot merge PR" (bot cannot review own PRs)

**Causa:** GitHub App não pode deixar review em seu próprio PR.

**Solução:** 
- Essa é uma limitação do GitHub (bots não podem revisar PRs que abriram)
- Usar outro user/bot para deixar review
- Ou usar `COMMENT` em vez de `APPROVE`

---

## 🌿 Branches

### "Cannot delete branch (protected)"

**Causa:** Branch (main, master, etc) está protegida.

**Solução:**
```bash
# Verificar branches protegidas
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/owner/repo/branches/main/protection

# Se é main/master, não deletar
# Sempre manter branch padrão

# Se é branch de feature, verificar se está em uso
node ~/.openclaw/skills/github-app/scripts/list-prs.js \
  --repo owner/repo
```

---

### "Branch protection failed"

**Causa:** Permissões insuficientes ou syntax error em parâmetros.

**Solução:**
```bash
# Verificar permissões
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/owner/repo/branches

# Sintaxe correta
node ~/.openclaw/skills/github-app/scripts/protect-branch.js \
  --repo owner/repo \
  --branch main \
  --require_pr true \
  --require_review false

# Booleans devem ser "true" ou "false" (strings)
```

---

## 📝 Issues & Comments

### Comment muito longo é truncado

**Causa:** GitHub API tem limite de caracteres.

**Solução:**
```bash
# Limite é ~65k caracteres
# Se comment for maior, dividir em múltiplos

# Parte 1
node ~/.openclaw/skills/github-app/scripts/add-comment.js \
  --repo owner/repo \
  --number 42 \
  --body "Primeira parte..."

# Parte 2
node ~/.openclaw/skills/github-app/scripts/add-comment.js \
  --repo owner/repo \
  --number 42 \
  --body "Segunda parte..."
```

---

### Labels não aparecem após add

**Causa:** Label pode estar em minúsculas ou caracteres inválidos.

**Solução:**
```bash
# GitHub cria labels automaticamente com:
# - Nomes em lowercase
# - Sem caracteres especiais (exceto -, .)

# Usar nomes válidos
node ~/.openclaw/skills/github-app/scripts/add-labels.js \
  --repo owner/repo \
  --number 42 \
  --labels "bug,high-priority,p1"

# Evitar
--labels "Bug/High-Priority"  # ❌ Caracteres inválidos
--labels "🐛 Bug"              # ❌ Emoji não permitido
```

---

## 🔍 Queries

### "Empty result" ao listar issues/PRs

**Causa:** Filtro muito restritivo ou realmente não há resultados.

**Solução:**
```bash
# Remover filtros e tentar sem restrições
node ~/.openclaw/skills/github-app/scripts/list-issues.js \
  --repo owner/repo \
  --state all

# Verificar se repo tem issues habilitadas
node ~/.openclaw/skills/github-app/scripts/get-repo-info.js \
  --repo owner/repo
```

---

### Commits não aparecem em list-commits

**Causa:** Branch pode estar vazia ou não tem commits.

**Solução:**
```bash
# Verificar branches
node ~/.openclaw/skills/github-app/scripts/list-branches.js \
  --repo owner/repo

# Aumentar limite
node ~/.openclaw/skills/github-app/scripts/list-commits.js \
  --repo owner/repo \
  --branch main \
  --limit 50

# Se still empty, repo pode ser novo/vazio
```

---

## ⚙️ Geral

### Token não está funcionando em curl/chamadas manuais

**Causa:** Formato do header incorreto ou token expirado.

**Solução:**
```bash
# ✅ Correto
TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)
curl -H "Authorization: Bearer $TOKEN" https://api.github.com/repos/owner/repo

# ❌ Errado
curl -H "Authorization: token $TOKEN"  # ← 'Bearer' não 'token'
curl -H "auth: $TOKEN"                  # ← Header errado

# Verificar token
echo $TOKEN
# Deve começar com: ghs_
```

---

### "Invalid repository format"

**Causa:** Owner/repo format incorreto.

**Solução:**
```bash
# ✅ Correto
--repo owner/repo-name

# ❌ Errado
--repo owner-name/repo      # ← Dash no owner
--repo "owner/repo-name"    # ← Quotes (não usar)
--repo owner/repo-name/     # ← Slash no final

# Listar owners válidos
node ~/.openclaw/skills/github-app/scripts/list-repos.js
```

---

### Script demora muito (timeout)

**Causa:** API lenta ou conexão de rede instável.

**Solução:**
```bash
# Aumentar timeout (adicionar em openclaw.json):
{
  "skills": {
    "entries": {
      "github-app": {
        "timeout": 30000  # 30 segundos
      }
    }
  }
}

# Tentar novamente
# API GitHub é geralmente rápida (~200-500ms)
# Se timeout, pode ser GH API outage ou rate limit
```

---

### Rate limiting (429 Too Many Requests)

**Causa:** Muitas requisições em pouco tempo.

**Solução:**
```bash
# GitHub App tem rate limit: 5,000 requests/hour por instalação

# Verificar status
TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)
curl -i -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/rate_limit

# Resposta
# X-RateLimit-Limit: 5000
# X-RateLimit-Remaining: 4999
# X-RateLimit-Reset: <unix timestamp>

# Se atingiu limite, esperar até reset time
```

---

## 📞 Relatando Problemas

Se problema não está aqui:

1. **Verificar logs:**
   ```bash
   journalctl -u openclaw -n 50
   ```

2. **Testar manualmente:**
   ```bash
   TOKEN=$(node ~/.openclaw/skills/github-app/scripts/mint_installation_token.js)
   curl -v -H "Authorization: Bearer $TOKEN" \
     https://api.github.com/repos/alternative-down/skills
   ```

3. **Verificar GitHub status:**
   https://www.githubstatus.com

---

**Última atualização:** 2026-02-27
