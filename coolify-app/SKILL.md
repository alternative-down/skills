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
Create a new Coolify application from a GitHub repository via GitHub App authentication.

```bash
node scripts/actions/create-application.js <name> <git_repository> <git_branch> [options]
```

**Parameters:**
- `<name>` - Application name
- `<git_repository>` - GitHub repository in format `owner/repo`
- `<git_branch>` - Git branch to deploy

**Required Options (choose one):**
- `--environment-uuid=<uuid>` - Environment UUID (recommended - simplest option)
- `--project-uuid=<uuid>` - Project UUID (if not using environment)

**Required for GitHub App:**
- `--github-app-uuid=<uuid>` - GitHub App UUID (get from Coolify settings)

**Build Options:**
- `--buildpack=<type>` - Build pack: nixpacks, static, dockerfile, dockercompose (default: nixpacks)
- `--ports=<ports>` - Ports to expose (default: 3000)
- `--build-cmd=<cmd>` - Custom build command
- `--start-cmd=<cmd>` - Custom start command
- `--install-cmd=<cmd>` - Custom install command

**Application Options:**
- `--description=<desc>` - Application description
- `--domain=<domain>` - Custom domain for the application
- `--base-dir=<dir>` - Base directory (default: /)
- `--publish-dir=<dir>` - Publish directory (for static apps)

**Feature Flags:**
- `--is-static` - Mark as static application
- `--is-spa` - Mark as SPA (single-page application)
- `--auto-deploy` / `--no-auto-deploy` - Enable/disable auto-deploy on git push (default: enabled)
- `--force-https` / `--no-force-https` - Enable/disable HTTPS forcing (default: enabled)

**Examples:**

Simple Node.js app:
```bash
node scripts/actions/create-application.js landing-page alternative-down/landing-page-saas main \
  --environment-uuid=k8ow4o0o440088s08gwcwsc4 \
  --github-app-uuid=YOUR_GH_APP_UUID \
  --buildpack=nixpacks \
  --ports=3000
```

Static app with custom build:
```bash
node scripts/actions/create-application.js my-landing alternative-down/landing-page-saas main \
  --environment-uuid=YOUR_ENV_UUID \
  --github-app-uuid=YOUR_GH_APP_UUID \
  --is-static \
  --buildpack=static \
  --build-cmd="pnpm run build" \
  --publish-dir=dist
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
