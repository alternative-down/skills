#!/usr/bin/env node

/**
 * Create a new Coolify application from a GitHub repository
 * Usage: node create-application.js <name> <projectId> <repository> [options]
 * 
 * Options:
 *   --branch=<branch>          Git branch to deploy (default: main)
 *   --buildpack=<buildpack>    Build pack type: nodejs, static, docker, etc (default: nodejs)
 *   --description=<desc>       Application description
 *   --ports=<port>             Port to expose (default: 3000)
 *   --env=<VAR=value>          Environment variables (repeatable)
 * 
 * Examples:
 *   node create-application.js landing-page 1 owner/landing-page --branch=main --buildpack=nodejs
 *   node create-application.js myapp 1 owner/repo --ports=8080 --env=NODE_ENV=production
 */

const { makeRequest } = require('../utilities/api-helper');

function parseArgs() {
  const args = process.argv.slice(2);
  
  const name = args[0];
  const projectId = args[1];
  const repository = args[2];

  if (!name || !projectId || !repository) {
    console.error('Usage: node create-application.js <name> <projectId> <repository> [options]');
    process.exit(1);
  }

  // Parse options
  const options = {
    branch: 'main',
    buildpack: 'nodejs',
    description: '',
    ports: [3000],
    env: {}
  };

  args.slice(3).forEach(arg => {
    if (arg.startsWith('--branch=')) {
      options.branch = arg.split('=')[1];
    } else if (arg.startsWith('--buildpack=')) {
      options.buildpack = arg.split('=')[1];
    } else if (arg.startsWith('--description=')) {
      options.description = arg.split('=')[1];
    } else if (arg.startsWith('--ports=')) {
      const port = arg.split('=')[1];
      options.ports = [parseInt(port)];
    } else if (arg.startsWith('--env=')) {
      const envVar = arg.split('=').slice(1).join('=');
      const [key, val] = envVar.split('=');
      options.env[key] = val;
    }
  });

  return { name, projectId: parseInt(projectId), repository, ...options };
}

async function main() {
  const { name, projectId, repository, branch, buildpack, description, ports, env } = parseArgs();

  try {
    // Build payload for GitHub-based application
    const payload = {
      name,
      projectId,
      gitRepository: repository,
      gitBranch: branch,
      buildPack: buildpack,
      description: description || `${name} application`,
      ports: ports,
      // Environment variables if any
      ...(Object.keys(env).length > 0 && { environment: env })
    };

    console.log('📦 Creating application...');
    console.log(`   Name: ${name}`);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Repository: ${repository}#${branch}`);
    console.log(`   Build Pack: ${buildpack}`);
    console.log(`   Ports: ${ports.join(', ')}`);
    if (Object.keys(env).length > 0) {
      console.log(`   Env: ${Object.entries(env).map(([k,v]) => `${k}=${v}`).join(', ')}`);
    }
    console.log('');

    const result = await makeRequest('POST', '/applications', payload);
    
    if (result.status !== 201 && result.status !== 200) {
      console.error(`✗ Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const application = result.body.data || result.body;
    console.log(`✓ Application created successfully!`);
    console.log(`  UUID: ${application.uuid}`);
    console.log(`  FQDN: ${application.fqdn || 'N/A'}`);
    console.log(`  Status: ${application.status || 'pending'}`);
    console.log('');
    console.log('Full response:');
    console.log(JSON.stringify(application, null, 2));
  } catch (err) {
    console.error('✗ Request failed:', err.message);
    process.exit(1);
  }
}

main();
