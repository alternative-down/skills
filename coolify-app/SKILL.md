---
name: coolify-app
description: "🚀 Acesso: Coolify API v1 (https://coolify.alternativedown.com.br). Cria aplicações, triggerem deployments, restarta containers, monitora saúde, acessa logs. Autenticação segura com Bearer token. Quando usar: criar apps de repos GitHub, fazer deploy de landing pages, reiniciar containers em debug, verificar logs e status, atualizar configurações. Proativo: quando repo novo criado → criar app automaticamente; quando work completo → deploy e verificar status; quando app crashear → reiniciar e trazer logs; em heartbeat → verificar saúde de todas apps. Exemplos: 'Deploy landing-page' → cria app e build; 'App crashing?' → logs e restart; 'Status de todas apps?' → lista health."
homepage: https://coolify.io
metadata:
  {
    "openclaw":
      {
        "emoji": "🚀",
        "requires": { "bins": ["node"], "env": ["COOLIFY_API_TOKEN", "COOLIFY_BASE_URL"] }
      }
  }
---

# Coolify App Skill 🚀

Deploy, monitor e gerenciar aplicações no Coolify via API segura. Crie apps do zero, triggerem builds, restarte containers, monitore logs e saúde — tudo automatizado.

**URL da Instância:** https://coolify.alternativedown.com.br/

**Credenciais obrigatórias** (configuradas em `~/.openclaw/openclaw.json`):
- `COOLIFY_API_TOKEN` - API token para autenticação (gerado em Settings → API)
- `COOLIFY_BASE_URL` - URL base da instância Coolify (ex: https://coolify.alternativedown.com.br)

---

## 📋 Quando Usar (Casos de Uso)

### ✅ Use este skill para:

| Caso | Comando | Por quê |
|------|---------|--------|
| **Deployer uma app nova** | `create-application.js` | Automatizar setup de novos projetos |
| **Redeploy de uma app** | `deploy-application.js` ou git push | Atualizar código rodando |
| **Restart de container** | `restart-application.js` | Aplicar mudanças de config, limpar cache |
| **Revisar status das apps** | `list-applications.js` | Saber quais tão up/down |
| **Debugar crashes** | `get-logs.js` + `get-application.js` | Entender por que container tá falhando |
| **Monitorar health** | `application-health-check.sh` | Auditar status de todas as apps |
| **Criar novo projeto** | `create-project.js` | Organizar apps por projeto |
| **Atualizar config** | `update-application.js` | Mudar branch, ports, env vars |

### ❌ NÃO use este skill para:

- Deletar aplicações (operação destruidora)
- Escalar infra (requer decisão humana)

---

## 🚀 Uso Proativo (Quando o Assistente Deve Usar Automaticamente)

### Situação 1: Depois de Pushar Mudanças no GitHub
**Quando:** Você fez push pra main de um repo
```bash
# Coolify webhook já detectou push, build começa automaticamente
# Aguarde ~2-3 min ou force redeploy:
node {baseDir}/scripts/actions/deploy-application.js jowkk4w0os8ggwo84gww8ocg
```
**Por quê:** Atualizar código rodando sem downtime

---

### Situação 2: Container Tá Crashando
**Quando:** App não tá respondendo
```bash
# 1. Check status
node {baseDir}/scripts/queries/get-application.js jowkk4w0os8ggwo84gww8ocg | grep -E 'status|restart_count'

# 2. Se crashed, restart
node {baseDir}/scripts/actions/restart-application.js jowkk4w0os8ggwo84gww8ocg

# 3. Aguarde 5-10s e check logs
sleep 5
node {baseDir}/scripts/queries/get-logs.js jowkk4w0os8ggwo84gww8ocg --tail=50
```
**Por quê:** Diagnosticar e recuperar rápido

---

### Situação 3: Fazer Deploy de Nova App
**Quando:** Tem um repo novo pronto pra deployer
```bash
node {baseDir}/scripts/actions/create-application.js \
  landing-page-saas \
  alternative-down/landing-page-saas \
  main \
  --environment-uuid=k8ow4o0o440088s08gwcwsc4 \
  --github-app-uuid=kkw8w0kos00kcoo00c8s4c00 \
  --buildpack=nixpacks \
  --is-static \
  --build-cmd="pnpm run build" \
  --publish-dir=dist
```
**Por quê:** Automatizar deploy instead of clicando na UI

---

### Situação 4: Monitorar Saúde Geral das Apps
**Quando:** Quer saber se algo tá down
```bash
./scripts/workflows/application-health-check.sh
# ou filtrar por projeto:
./scripts/workflows/application-health-check.sh qw0ccgw40o84s4c88wggg0wc
```
**Por quê:** Auditar status, alertar se alguma morreu

---

### Situação 5: Analisar Logs de Erro
**Quando:** App tá dando erro e quer investigar
```bash
./scripts/workflows/log-analysis.sh jowkk4w0os8ggwo84gww8ocg --grep=ERROR
```
**Por quê:** Encontrar stack trace, entender problema

---

## 🔍 Queries - Monitorar e Auditar

### 📦 Listar Todos os Projetos

```bash
node {baseDir}/scripts/queries/list-projects.js
```

**Output esperado:**
```
🚀 Projects (2 total)

1. micro-saas-platform (2 apps)
   - hub (https://hub.alternativedown.com.br)
   - portal (https://portal.alternativedown.com.br)
2. website-assets (1 app)
   - landing (https://landing.alternativedown.com.br)
```

**Use quando:** Lembrar IDs de projetos, status geral

---

### 📱 Listar Aplicações (com Status)

```bash
# Todas as apps
node {baseDir}/scripts/queries/list-applications.js

# Apenas do projeto específico
node {baseDir}/scripts/queries/list-applications.js qw0ccgw40o84s4c88wggg0wc
```

**Output esperado:**
```
📱 Applications (3 total)

1. hub (running)
   └─ https://hub.alternativedown.com.br | Upstream: alternative-down/micro-saas-platform#main

2. portal (running)
   └─ https://portal.alternativedown.com.br | Upstream: alternative-down/micro-saas-platform#main

3. landing-page-saas (running)
   └─ https://landing.alternativedown.com.br | Upstream: alternative-down/landing-page-saas#main
```

**Campos importantes:**
- Status: running, crashed, restarting, unknown
- URL: onde tá servindo
- Repository: origem do código
- Branch: qual branch tá deployada

**Use quando:** Quer ver status rápido de todas as apps

---

### 📊 Obter Status Completo da App

```bash
node {baseDir}/scripts/queries/get-application.js jowkk4w0os8ggwo84gww8ocg
```

**Retorna:**
- UUID, nome, descrição
- Status, restart_count, last_restart_type
- Repository, branch, último push
- Build command, start command
- Ports, domain, publish directory
- Healthcheck settings
- Docker image info

**Use quando:** Precisa de diagnóstico completo pra debugar

---

### 📋 Obter Logs da App

```bash
# Últimas 50 linhas
node {baseDir}/scripts/queries/get-logs.js jowkk4w0os8ggwo84gww8ocg --tail=50

# Últimas 200 linhas
node {baseDir}/scripts/queries/get-logs.js jowkk4w0os8ggwo84gww8ocg --tail=200
```

**Use quando:** App tá falhando, precisa entender por quê

**Nota:** Só funciona se a app tá rodando. Se tá crashed, veja status/restart_type primeiro.

---

### 🖥️ Obter Info do Servidor

```bash
node {baseDir}/scripts/queries/get-server-info.js
```

**Retorna:**
- CPU usage, memory usage, disk usage
- Docker version, status
- Traefik version
- Uptime

**Use quando:** Quer saber saúde geral da infra

---

## 🔧 Ações - Criar, Atualizar, Deploy

### 🚀 Criar Nova Aplicação

```bash
node {baseDir}/scripts/actions/create-application.js <name> <git_repo> <git_branch> [options]
```

**Parâmetros Obrigatórios:**
- `<name>` - Nome único da app (ex: landing-page-saas)
- `<git_repo>` - Repo GitHub (ex: alternative-down/landing-page-saas)
- `<git_branch>` - Branch principal (ex: main)

**Opções Obrigatórias (escolha uma):**
```bash
--environment-uuid=<uuid>    # Recomendado (simplest)
--project-uuid=<uuid>        # Alternativa (mais config)
```

**GitHub App (obrigatório):**
```bash
--github-app-uuid=<uuid>     # Sempre necessário
```

**Build Config (recomendado):**
```bash
--buildpack=nixpacks         # nixpacks | dockerfile | static | dockercompose
--build-cmd="pnpm run build" # Comando de build
--install-cmd="pnpm install" # Comando install (optional)
--start-cmd="npm start"      # Comando start (optional)
```

**Application Config:**
```bash
--ports=3000                 # Port to expose
--publish-dir=/dist          # Para static sites
--base-dir=/                 # Base directory (default: /)
--description="..."          # App description
--domain=landing.com         # Custom domain
```

**Feature Flags:**
```bash
--is-static                  # Marca como static site (Vite, Next.js static)
--is-spa                     # SPA (React, Vue, Svelte)
--auto-deploy                # Auto-deploy on git push (default: true)
--force-https                # Force HTTPS (default: true)
```

**Exemplo 1: Landing Page Vite (Static)**
```bash
node scripts/actions/create-application.js \
  landing-page-saas \
  alternative-down/landing-page-saas \
  main \
  --environment-uuid=k8ow4o0o440088s08gwcwsc4 \
  --github-app-uuid=kkw8w0kos00kcoo00c8s4c00 \
  --buildpack=nixpacks \
  --is-static \
  --build-cmd="pnpm run build" \
  --publish-dir=/dist \
  --ports=3000
```

**Exemplo 2: Node.js App**
```bash
node scripts/actions/create-application.js \
  my-api \
  alternative-down/my-api \
  main \
  --environment-uuid=k8ow4o0o440088s08gwcwsc4 \
  --github-app-uuid=kkw8w0kos00kcoo00c8s4c00 \
  --buildpack=nixpacks \
  --build-cmd="npm run build" \
  --start-cmd="npm start" \
  --ports=5000
```

**Exemplo 3: Next.js (Full Stack)**
```bash
node scripts/actions/create-application.js \
  my-nextjs-app \
  alternative-down/my-nextjs \
  main \
  --environment-uuid=k8ow4o0o440088s08gwcwsc4 \
  --github-app-uuid=kkw8w0kos00kcoo00c8s4c00 \
  --buildpack=nixpacks \
  --build-cmd="npm run build" \
  --start-cmd="npm start" \
  --ports=3000
```

---

### 🔄 Triggerar Deploy da App

```bash
# Deploy automático (webhook quando push)
# Ou force redeploy:
node {baseDir}/scripts/actions/deploy-application.js <appId>

# Force redeploy mesmo que não houve mudança
node {baseDir}/scripts/actions/deploy-application.js <appId> --force
```

**Output esperado:**
```
✓ Deployment triggered for application jowkk4w0os8ggwo84gww8ocg
{
  "message": "Build request queued.",
  "deployment_uuid": "..."
}
```

**Use quando:**
- Depois de atualizar config na app
- Quer refazer deploy manual
- Webhook falhou e quer retry

---

### 🔄 Restart da App (Sem Redeploy)

```bash
node {baseDir}/scripts/actions/restart-application.js <appId>
```

**Diferença vs Deploy:**
- **Restart**: Reinicia container existente, mantém imagem (rápido)
- **Deploy**: Rebuild, novo container, nova imagem (lento)

**Use quando:**
- Container tá crashed mas código tá OK
- Quer aplicar mudanças de env var
- Limpar cache/memory

---

### 📝 Criar Novo Projeto

```bash
node {baseDir}/scripts/actions/create-project.js <name> [--description="..."]
```

**Exemplo:**
```bash
node scripts/actions/create-project.js \
  "My SaaS" \
  --description="Production apps for My SaaS"
```

**Use quando:** Quer organizar apps em projetos separados

---

### ⚙️ Atualizar Config da App

```bash
node {baseDir}/scripts/actions/update-application.js <appId> [options]
```

**Opções:**
```bash
--branch=main                  # Mudar branch a deployar
--ports=8080                   # Mudar porta
--env=KEY=value                # Adicionar/atualizar env var
--env=KEY=value --env=K2=v2    # Múltiplas env vars
```

**Exemplos:**

Mudar branch:
```bash
node scripts/actions/update-application.js jowkk4w0os8ggwo84gww8ocg \
  --branch=production
```

Adicionar env var:
```bash
node scripts/actions/update-application.js jowkk4w0os8ggwo84gww8ocg \
  --env=DATABASE_URL=postgres://... \
  --env=API_KEY=secret123
```

---

## 📊 Workflows - Automated Tasks

### 📱 Health Check de Todas as Apps

```bash
# Check todas
./scripts/workflows/application-health-check.sh

# Check só de um projeto
./scripts/workflows/application-health-check.sh qw0ccgw40o84s4c88wggg0wc
```

**Output esperado:**
```
🏥 Application Health Check

✅ hub (running) - Status OK
✅ portal (running) - Status OK
❌ landing-page-saas (restarting) - Status WARNING

Summary: 2 healthy, 1 warning
```

**Use quando:**
- Morning check: "Tudo tá up?"
- Depois de deploy massivo
- Antes de passar turnno

---

### 📝 Deploy + Monitor até Healthy

```bash
./scripts/workflows/deploy-and-monitor.sh jowkk4w0os8ggwo84gww8ocg [--wait=300]
```

**Faz:**
1. Triggerem deploy
2. Aguarda build completar
3. Monitora healthcheck
4. Aguarda até app estar up (ou timeout)

**Timeout padrão:** 300 segundos (5 min)

**Use quando:**
- Quer deploy + confirmation que tá up
- Setup de novo projeto

---

### 🔍 Log Analysis (Procura por Errors)

```bash
# Procurar errors/warnings nas últimas 100 linhas
./scripts/workflows/log-analysis.sh jowkk4w0os8ggwo84gww8ocg --tail=100

# Procurar pattern específico
./scripts/workflows/log-analysis.sh jowkk4w0os8ggwo84gww8ocg --grep=ERROR
```

**Use quando:**
- App tá falhando intermitentemente
- Quer resumo de problemas
- Debugar crash

---

## 🛡️ Coolify Configuration Best Practices

### Static Sites (Vite, Hugo, Jekyll)

**Configuração:**
```
Build Pack: nixpacks
Is it a static site?: true
Install Command: (leave empty - Nixpacks auto-detects)
Build Command: pnpm run build (or npm, yarn)
Start Command: (leave empty - nginx handles it)
Publish Directory: /dist
```

**Por quê:**
- Nixpacks auto-detecta `pnpm-lock.yaml` ou `package-lock.json`
- Static flag = nginx serving (sem Node runtime)
- Sem start command = sem crashes tentando rodar serve globalmente

---

### Node.js Apps

**Configuração:**
```
Build Pack: nixpacks
Is it a static site?: false
Install Command: (leave empty)
Build Command: npm run build (or pnpm, yarn)
Start Command: npm start
Publish Directory: (leave empty)
Port: 3000 (ou seu port)
```

**Por quê:**
- Nixpacks detects Node.js + instala auto
- Node app precisa de runtime para rodar
- Start command executa `npm start` dentro do container

---

### Debugging Checklist

Quando app tá crashando:

```bash
# 1. Check status
node get-application.js <appId> | grep -E 'status|restart_count|last_restart_type'

# Se restart_count > 10 = crashing loop
# Se status = "restarting:unknown" = app não consegue iniciar

# 2. Check config
node get-application.js <appId> | grep -E 'build_command|start_command|is_static'

# Problema comum:
# - start_command com `npm install -g serve` = crash
# - Solução: usar `is_static: true` ao invés

# 3. Check logs (só se running)
node get-logs.js <appId> --tail=100

# 4. Se app crashed, restart
node restart-application.js <appId>

# 5. Aguarde e recheck
sleep 10
node get-application.js <appId> | grep status
```

---

## 📚 Common UUIDs (Sua Instância)

Salve esses para não perder tempo:

```bash
# Project
PROJECT_UUID=qw0ccgw40o84s4c88wggg0wc  # micro-saas-platform

# Environment
ENVIRONMENT_UUID=k8ow4o0o440088s08gwcwsc4  # production

# Server
SERVER_UUID=u4g4c8k4c8o0so084c884c4c  # localhost (Coolify host)

# GitHub App
GITHUB_APP_UUID=kkw8w0kos00kcoo00c8s4c00  # alternative-down private

# Applications
HUB_APP_UUID=<get from list-applications.js>
PORTAL_APP_UUID=<get from list-applications.js>
LANDING_APP_UUID=jowkk4w0os8ggwo84gww8ocg
```

---

## 🔗 Recursos

- [Coolify Docs](https://coolify.io/docs)
- [API Reference](https://coolify.io/api-reference)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Vite on Coolify](https://coolify.io/docs/knowledge-base/docker-compose-and-coolify)
