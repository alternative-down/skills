# Coolify App Skill

Manage Coolify deployments, applications, and infrastructure via API.

## Structure

```
coolify-app/scripts/
├── queries/       - Read operations (list, get, info)
├── actions/       - Write operations (deploy, restart, create)
└── workflows/     - Automated bash scripts combining multiple actions
```

## Setup

Set `COOLIFY_API_TOKEN` environment variable with your Coolify API token.

```bash
export COOLIFY_API_TOKEN="your-token-here"
```

In OpenClaw, this is auto-injected via `skills.entries.coolify-app.env`.

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
Get detailed info about a specific application.
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

## Workflows

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

## Integration

In agents or skills, import and use:

```javascript
const { execSync } = require('child_process');
const token = process.env.COOLIFY_API_TOKEN;

// List projects
const result = execSync('node ~/.openclaw/skills/coolify-app/scripts/queries/list-projects.js', {
  env: { ...process.env, COOLIFY_API_TOKEN: token }
}).toString();

console.log(result);
```

Or for workflows:

```bash
bash ~/.openclaw/skills/coolify-app/scripts/workflows/deploy-and-monitor.sh <appId>
```

## Instance Details

**URL**: https://coolify.alternativedown.com.br/
**API Base**: https://coolify.alternativedown.com.br/api/v1/
**Projects**: micro-saas-platform, agents
**Default Server**: StandaloneDocker with Traefik
