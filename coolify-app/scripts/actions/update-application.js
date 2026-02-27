#!/usr/bin/env node

/**
 * Update Coolify application settings
 * Usage: node update-application.js <applicationId> [--env=VAR=value] [--ports=8080:80] [--branch=main]
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  const appId = process.argv[2];
  if (!appId) {
    console.error('Usage: node update-application.js <applicationId> [--env=VAR=value] [--ports=8080:80] [--branch=main]');
    process.exit(1);
  }

  const body = {};

  // Parse environment variables
  const envArgs = process.argv.filter(arg => arg.startsWith('--env='));
  if (envArgs.length > 0) {
    body.environment_variables = {};
    envArgs.forEach(arg => {
      const [key, value] = arg.slice(6).split('=');
      body.environment_variables[key] = value;
    });
  }

  // Parse ports
  const portsArg = process.argv.find(arg => arg.startsWith('--ports='));
  if (portsArg) {
    body.ports = portsArg.slice(8);
  }

  // Parse branch
  const branchArg = process.argv.find(arg => arg.startsWith('--branch='));
  if (branchArg) {
    body.git_branch = branchArg.slice(9);
  }

  try {
    const result = await makeRequest('PATCH', `/applications/${appId}`, body);
    
    if (result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    console.log(`✓ Application ${appId} updated`);
    console.log(JSON.stringify(result.body, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
