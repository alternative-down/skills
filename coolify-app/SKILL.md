---
name: coolify-app
description: "Manage Coolify deployments and applications. Deploy, restart, monitor health, and manage infrastructure via API."
metadata:
  {
    "openclaw":
      {
        "emoji": "🚀",
        "requires": { "bins": ["node"], "env": ["COOLIFY_API_TOKEN", "COOLIFY_BASE_URL"] },
        "homepage": "https://coolify.io/",
      },
  }
---

# Coolify App Skill

Integração segura com **Coolify** — gerenciador de deploy e orquestração de containers.

**URL:** https://coolify.alternativedown.com.br/

**Credenciais obrigatórias** (configuradas em `~/.openclaw/openclaw.json`):
- `COOLIFY_API_TOKEN` - API token para autenticação (gerado em Settings → API)
- `COOLIFY_BASE_URL` - URL base da instância Coolify (ex: https://coolify.alternativedown.com.br)

## Query Scripts

### `list-projects.js`
List all Coolify projects.
```bash
node scripts/queries/list-projects.js
```

### `list-applications.js`
List all applications, optionally filtered by project.
```bash
node scripts/queries/list-applications.js [projectId]
```

### `get-application.js`
Get detailed information about a specific application.
```bash
node scripts/queries/get-application.js <applicationId>
```

### `get-logs.js`
Retrieve application logs.
```bash
node scripts/queries/get-logs.js <applicationId> [--tail=50]
```

### `get-server-info.js`
Get Coolify server statistics and health.
```bash
node scripts/queries/get-server-info.js
```

## Action Scripts

### `create-application.js`
Create a new Coolify application from a GitHub repository.
```bash
node scripts/actions/create-application.js <name> <projectId> <repository> [options]
```

**Parameters:**
- `<name>` - Application name
- `<projectId>` - ID of the project
- `<repository>` - GitHub repository in format `owner/repo`

**Options:**
- `--branch=<branch>` - Git branch to deploy (default: main)
- `--buildpack=<buildpack>` - Build pack type: nodejs, static, docker (default: nodejs)
- `--description=<desc>` - Application description
- `--ports=<port>` - Port to expose (default: 3000)
- `--env=<VAR=value>` - Environment variables (repeatable)

**Examples:**
```bash
node scripts/actions/create-application.js landing-page 1 alternative-down/landing-page-saas --branch=main

node scripts/actions/create-application.js myapp 1 owner/repo --ports=8080 --env=NODE_ENV=production --env=API_KEY=xxx
```

### `deploy-application.js`
Trigger a deployment for an application.
```bash
node scripts/actions/deploy-application.js <applicationId> [--force]
```

### `restart-application.js`
Restart an application.
```bash
node scripts/actions/restart-application.js <applicationId>
```

### `create-project.js`
Create a new Coolify project.
```bash
node scripts/actions/create-project.js <name> [--description="..."]
```

### `update-application.js`
Update application settings (environment, ports, branch).
```bash
node scripts/actions/update-application.js <appId> [--env=VAR=value] [--ports=8080:80] [--branch=main]
```

## Workflow Scripts

### `deploy-and-monitor.sh`
Deploy an application and monitor status until healthy.
```bash
./scripts/workflows/deploy-and-monitor.sh <applicationId> [--wait=300]
```

### `application-health-check.sh`
Check health status of all applications.
```bash
./scripts/workflows/application-health-check.sh [projectId]
```

### `log-analysis.sh`
Analyze application logs for errors and warnings.
```bash
./scripts/workflows/log-analysis.sh <applicationId> [--tail=100] [--grep=ERROR|WARN]
```
