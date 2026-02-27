#!/usr/bin/env node

/**
 * Restart a Coolify application
 * Usage: node restart-application.js <applicationId>
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  const appId = process.argv[2];
  if (!appId) {
    console.error('Usage: node restart-application.js <applicationId>');
    process.exit(1);
  }

  try {
    const result = await makeRequest('POST', `/applications/${appId}/restart`);
    
    if (result.status !== 200 && result.status !== 202) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    console.log(`✓ Application ${appId} restart initiated`);
    console.log(JSON.stringify(result.body, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
