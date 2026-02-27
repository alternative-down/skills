#!/usr/bin/env node

/**
 * List all Coolify projects
 * Usage: node list-projects.js
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  try {
    const result = await makeRequest('GET', '/projects');
    
    if (result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const projects = result.body.data || result.body;
    console.log(`Found ${projects.length} project(s):\n`);
    
    projects.forEach(p => {
      console.log(`  ID: ${p.id}`);
      console.log(`  Name: ${p.name}`);
      console.log(`  Description: ${p.description || 'N/A'}`);
      console.log('');
    });
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
