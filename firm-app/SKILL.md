---
name: firm-app
description: "📋 Acesso: Firm CLI + workspace /firm (versionado em Git automaticamente). Listar tarefas/projetos, criar entities, fazer queries customizadas, registrar progresso, atualizar status. Quando usar: verificar tasks abertas, criar nova tarefa, atualizar status conforme progresso, log de conclusão, gerar relatórios. Proativo: em morning standup → listar tasks abertas; ao completar trabalho → criar record 'completed'; quando bloqueado → atualizar status + comment; em heartbeat → verificar tasks priority/overdue; code pushed → criar 'completed' record com commit reference. Exemplos: 'What's on my plate?' → lista tasks abertas + deadlines; 'Finished landing page' → cria completed record; 'What's blocking?' → lista tasks bloqueadas e dependências; 'Progress report' → resume completed/in-progress/upcoming."
homepage: https://firm.42futures.com
metadata:
  {
    "openclaw":
      {
        "emoji": "📋",
        "requires": { "bins": ["firm", "git"] }
      }
  }
---

# Firm App Skill 📋

Sistema de gestão de trabalho text-based com versionamento Git automático. Listar tarefas/projetos, fazer queries customizadas, criar entities — tudo sincronizado no repositório.

**Workspace:** `/firm` (shared, versionado em Git)

**Repositório:** `alternative-down/firm` (auto-commit + push)

---

## 📋 Quando Usar (Casos de Uso)

### ✅ Use este skill para:

| Caso | Comando | Por quê |
|------|---------|--------|
| **Listar tasks pendentes** | `list-all.sh task` | Saber o que precisa fazer |
| **Revisar projetos ativos** | `list-all.sh project` | Ver status de projetos |
| **Query customizada** | `query.sh 'from task where...'` | Filtrar info complexa |
| **Criar nova tarefa** | `add-entity.sh --type task` | Registrar work to be done |
| **Atualizar status** | `add-entity.sh --field status` | Marcar completo/em progresso |
| **Auditar relacionamentos** | `query.sh 'from person \| related task'` | Entender dependências |
| **Relatórios** | Query + agregações | Gerar insights sobre progress |
| **Versionamento** | Auto-commit no Git | Histórico de mudanças |

### ❌ NÃO use este skill para:

- Decisões estratégicas (Firm é ferramenta, não consultor)
- Validação de dados (confie em Firm validation, não na sua lógica)

---

## 🚀 Uso Proativo (Quando o Assistente Deve Usar Automaticamente)

### Situação 1: Morning Standup - Ver Tarefas Abertas
**Quando:** Início do dia, quer saber prioridades
```bash
./scripts/queries/list-all.sh task | grep -E 'pending|in_progress'

# Output:
# task.landing_page_design (pending) - Design sistema landing page
# task.coolify_setup (in_progress) - Setup Coolify deployment
```
**Por quê:** Rápido overview do que precisa fazer hoje

---

### Situação 2: Registrar Conclusão de Task
**Quando:** Terminou de fazer algo importante
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id landing_page_design \
  --field status "completed"

# Auto-commits em Git
```
**Por quê:** Registro persistente, auditável, versionado

---

### Situação 3: Criar Tarefa para Trabalho Futuro
**Quando:** Descobriu algo que precisa fazer depois
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id my_new_feature \
  --field name "Implementar login social" \
  --field priority "p1" \
  --field status "planned"

# Com mais campos:
./scripts/workflows/add-entity.sh \
  --type task \
  --id auth_oauth \
  --field name "OAuth2 integration" \
  --field description "Add Google + GitHub login" \
  --field assignee "nicolas" \
  --field due_date "2026-03-15"
```
**Por quê:** Não perder ideias, rastrear backlog

---

### Situação 4: Consultar Progress de Projeto
**Quando:** Quer saber quantas tasks completadas vs pendentes
```bash
./scripts/queries/query.sh 'from task | where project == "micro-saas-platform" | count'
./scripts/queries/query.sh 'from task | where status == "completed" and project == "micro-saas-platform"'
```
**Por quê:** Metrics, entender velocity, comunicar progresso

---

### Situação 5: Auditar Dependências (Quem depende de quem)
**Quando:** Quer entender bloqueadores
```bash
./scripts/queries/query.sh 'from task | related person'
# Mostra quantas tasks cada pessoa tem

./scripts/queries/query.sh 'from task | where status == "blocked"'
# Mostra tasks bloqueadas
```
**Por quê:** Identificar gargalos, priorizar desbloqueio

---

## 🔍 Queries - Listar & Auditar

### 📦 Listar Todas as Tasks

```bash
./scripts/queries/list-all.sh task
```

**Output esperado:**
```
📦 Tasks (42 total)

1. landing_page_design (pending)
   └─ Design sistema landing page

2. coolify_setup (in_progress)
   └─ Setup Coolify deployment

3. github_auth (completed)
   └─ Implement GitHub App authentication
```

**Use quando:** Quer overview rápido de todas as tasks

---

### 📦 Listar Todos os Projetos

```bash
./scripts/queries/list-all.sh project
```

**Output esperado:**
```
📦 Projects (3 total)

1. micro-saas-platform (active)
   └─ Multi-tenant SaaS infrastructure

2. landing-page-saas (active)
   └─ Marketing landing page

3. devshop-core (planning)
   └─ Autonomous agent infrastructure
```

**Use quando:** Quer saber quais projetos existem e status

---

### 📦 Listar Todas as Pessoas

```bash
./scripts/queries/list-all.sh person
```

**Output esperado:**
```
📦 People (2 total)

1. nicolas (owner)
   └─ Full-stack engineer

2. bot-kael (assistant)
   └─ AI assistant
```

---

### 🔍 Query Customizada - Filtro Básico

```bash
# Tasks pendentes
./scripts/queries/query.sh 'from task | where status == "pending"'

# Tasks de um projeto específico
./scripts/queries/query.sh 'from task | where project == "micro-saas-platform"'

# Tasks atribuídas a uma pessoa
./scripts/queries/query.sh 'from task | where assignee == "nicolas"'

# Tasks com prioridade alta
./scripts/queries/query.sh 'from task | where priority == "p0" or priority == "p1"'

# Tasks completadas este mês
./scripts/queries/query.sh 'from task | where status == "completed" and completed_at > "2026-02-01"'
```

---

### 🔍 Query Customizada - Agregações & Relacionamentos

```bash
# Total de tasks por status
./scripts/queries/query.sh 'from task | group by status | count'

# Total de tasks por projeto
./scripts/queries/query.sh 'from task | group by project | count'

# Quantas tasks cada pessoa tem
./scripts/queries/query.sh 'from task | related person | count'

# Tasks bloqueadas que deveriam tá feitas
./scripts/queries/query.sh 'from task | where status == "blocked" and due_date < "2026-02-27"'

# Projetos com mais de 10 tasks pendentes
./scripts/queries/query.sh 'from task | where status == "pending" | group by project | filter count > 10'
```

---

### 📊 Query Customizada - Combinadas (Avançado)

```bash
# Tasks completadas por projeto (para relatório)
./scripts/queries/query.sh 'from task | where status == "completed" | group by project | count'

# Task completion rate (completed vs total)
./scripts/queries/query.sh 'from task | where status == "completed" | count'
# Depois divida pelo total de tasks

# Pessoas com mais tasks bloqueadas
./scripts/queries/query.sh 'from task | where status == "blocked" | related person | count'

# Tasks em progresso vs planejadas
./scripts/queries/query.sh 'from task | where status == "in_progress" or status == "planned" | count'
```

---

## ✏️ Ações - Criar & Atualizar Entities

### 📌 Criar Nova Task

```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id <unique_id> \
  --field name "<Title>" \
  --field description "<Optional description>" \
  --field project "<project_name>" \
  --field priority "<p0|p1|p2>" \
  --field status "<pending|in_progress|completed|blocked>" \
  --field assignee "<person>" \
  --field due_date "<YYYY-MM-DD>"
```

**Parâmetros:**
- `--type` - Entity type: task, project, person
- `--id` - Unique identifier (snake_case, nunca mude depois!)
- `--field name` - Título legível
- `--field description` - Detalhes (opcional)
- `--field project` - Qual projeto (opcional)
- `--field priority` - p0 (urgent) / p1 / p2 (low) / unset
- `--field status` - pending / in_progress / completed / blocked
- `--field assignee` - Quem faz
- `--field due_date` - YYYY-MM-DD

**Exemplo 1: Task simples**
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id write_landing_copy \
  --field name "Write landing page copy" \
  --field status "pending" \
  --field priority "p1"
```

**Exemplo 2: Task com todos os campos**
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id migrate_to_postgres \
  --field name "Migrate database to PostgreSQL" \
  --field description "Move from SQLite to Postgres for production readiness" \
  --field project "micro-saas-platform" \
  --field priority "p0" \
  --field status "in_progress" \
  --field assignee "nicolas" \
  --field due_date "2026-03-15"
```

**Exemplo 3: Feature com subtasks (create multiple)**
```bash
# Main feature task
./scripts/workflows/add-entity.sh \
  --type task \
  --id oauth2_implementation \
  --field name "OAuth2 Implementation" \
  --field status "planned"

# Subtask 1
./scripts/workflows/add-entity.sh \
  --type task \
  --id oauth_google_setup \
  --field name "Setup Google OAuth" \
  --field status "pending"

# Subtask 2
./scripts/workflows/add-entity.sh \
  --type task \
  --id oauth_github_setup \
  --field name "Setup GitHub OAuth" \
  --field status "pending"
```

---

### 🔄 Atualizar Status/Fields da Task

```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id <existing_task_id> \
  --field status "in_progress"

# Ou múltiplos fields:
./scripts/workflows/add-entity.sh \
  --type task \
  --id landing_page_design \
  --field status "completed" \
  --field completed_at "2026-02-27"
```

**Exemplos:**

Task starting:
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id write_landing_copy \
  --field status "in_progress"
```

Task blocking:
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id oauth_implementation \
  --field status "blocked" \
  --field blocked_reason "Waiting for API keys from provider"
```

Task completion:
```bash
./scripts/workflows/add-entity.sh \
  --type task \
  --id github_auth_setup \
  --field status "completed" \
  --field completed_at "2026-02-27"
```

---

### 📌 Criar Novo Projeto

```bash
./scripts/workflows/add-entity.sh \
  --type project \
  --id <project_id> \
  --field name "<Project Name>" \
  --field description "<Description>" \
  --field status "<active|planning|paused|done>"
```

**Exemplo:**
```bash
./scripts/workflows/add-entity.sh \
  --type project \
  --id my_new_saas \
  --field name "My New SaaS" \
  --field description "B2B invoicing platform" \
  --field status "planning"
```

---

### 👤 Criar Nova Pessoa (Rare)

```bash
./scripts/workflows/add-entity.sh \
  --type person \
  --id <person_id> \
  --field name "<Full Name>" \
  --field role "<engineer|designer|manager|...>"
```

**Exemplo:**
```bash
./scripts/workflows/add-entity.sh \
  --type person \
  --id john_developer \
  --field name "John Developer" \
  --field role "backend engineer"
```

---

## 💾 Git Management - Commit & Push

### 📝 Commit Mudanças (Manual)

Normalmente os scripts auto-commitam, mas se quiser manual:

```bash
./scripts/workflows/commit-push.sh "feat: complete landing page design"
```

**Output esperado:**
```
✓ Changes committed: [main 1a2b3c4] feat: complete landing page design
✓ Pushed to: alternative-down/firm
```

**Mensagens boas:**
- `feat: add new task for OAuth implementation`
- `update: mark landing page design as complete`
- `docs: add requirements for new feature`
- `fix: correct priority levels`

---

## 📊 Common Queries (Save These)

### Tarefas da Semana

```bash
./scripts/queries/query.sh 'from task | where status != "completed" and status != "blocked"'
```

### Bloqueadores Atuais

```bash
./scripts/queries/query.sh 'from task | where status == "blocked"'
```

### Progress Report (Quantos tasks completadas)

```bash
./scripts/queries/query.sh 'from task | where status == "completed"'
# Conta linhas = total completados
```

### Overdue Tasks

```bash
./scripts/queries/query.sh 'from task | where due_date < "2026-02-27" and status != "completed"'
```

### Tasks por Pessoa (Load balance)

```bash
./scripts/queries/query.sh 'from task | where status == "in_progress" or status == "pending" | related person'
```

---

## 🛡️ Best Practices

| Prática | Por quê |
|---------|--------|
| ✅ Task IDs em snake_case | Consistência, evita erros |
| ✅ Descrições claras | Entender depois quando ler |
| ✅ Prioridades honestas | p0 = URGENT, p1 = normal, p2 = nice-to-have |
| ✅ Update status ao trabalhar | Tracked em tempo real |
| ✅ Use `blocked` status | Comunica gargalos |
| ✅ Set due dates realistas | Evita crushing |
| ✅ Use project field | Facilita queries e reporting |
| ❌ Não mude task IDs | ID é chave primária, quebra tudo |
| ❌ Não delete entities | Firm não suporta; mark como archived ao invés |
| ❌ Não confie só em Firm | Versionado em Git, mas sempre backup |

---

## 🔗 Recursos

- [Firm Documentation](https://firm.42futures.com/)
- [Firm Query Language Guide](https://firm.42futures.com/docs/query-language)
- [Workspace at `/firm`](/firm/AGENTS.md) - Docs locais
- [Git Repository](https://github.com/alternative-down/firm) - Versionado
