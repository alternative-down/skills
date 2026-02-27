#!/usr/bin/env node

/**
 * Get detailed information about a specific Coolify application
 * Usage: node get-application.js <applicationId>
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  const appId = process.argv[2];
  if (!appId) {
    console.error('Usage: node get-application.js <applicationId>');
    process.exit(1);
  }

  try {
    const result = await makeRequest('GET', `/applications/${appId}`);
    
    if (result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const app = result.body.data || result.body;
    console.log(`Application: ${app.name}\n`);
    console.log(JSON.stringify(app, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
