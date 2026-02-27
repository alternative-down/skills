#!/usr/bin/env node

/**
 * Create a new Coolify project
 * Usage: node create-project.js <name> [--description="..."]
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Usage: node create-project.js <name> [--description="..."]');
    process.exit(1);
  }

  const descArg = process.argv.find(arg => arg.startsWith('--description='));
  const description = descArg ? descArg.split('=')[1] : '';

  try {
    const body = { name, description };
    const result = await makeRequest('POST', '/projects', body);
    
    if (result.status !== 201 && result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const project = result.body.data || result.body;
    console.log(`✓ Project created: ${name}`);
    console.log(`  ID: ${project.id}`);
    console.log(JSON.stringify(project, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
