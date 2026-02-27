#!/usr/bin/env node

/**
 * Trigger a deployment for a Coolify application
 * Usage: node deploy-application.js <applicationId> [--force]
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  const appId = process.argv[2];
  if (!appId) {
    console.error('Usage: node deploy-application.js <applicationId> [--force]');
    process.exit(1);
  }

  const force = process.argv.includes('--force');

  try {
    const body = { force };
    const result = await makeRequest('POST', `/applications/${appId}/deploy`, body);
    
    if (result.status !== 200 && result.status !== 202) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    console.log(`✓ Deployment triggered for application ${appId}`);
    console.log(JSON.stringify(result.body, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
