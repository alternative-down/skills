#!/usr/bin/env node

/**
 * List all Coolify applications
 * Usage: node list-applications.js [projectId]
 */

const { makeRequest } = require('../utilities/api-helper');

async function main() {
  try {
    const path = process.argv[2] ? `/projects/${process.argv[2]}/applications` : '/applications';
    const result = await makeRequest('GET', path);
    
    if (result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const apps = result.body.data || result.body;
    console.log(`Found ${apps.length} application(s):\n`);
    
    apps.forEach(app => {
      console.log(`  ID: ${app.id}`);
      console.log(`  Name: ${app.name}`);
      console.log(`  Status: ${app.status || 'unknown'}`);
      console.log(`  FQDN: ${app.fqdn || 'N/A'}`);
      console.log(`  Git Repo: ${app.git_repository || 'N/A'}`);
      console.log(`  Branch: ${app.git_branch || 'N/A'}`);
      console.log('');
    });
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
