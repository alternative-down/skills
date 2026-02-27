#!/usr/bin/env node

/**
 * Update Coolify application settings
 * Usage: node update-application.js <applicationId> [--env=VAR=value] [--ports=8080:80] [--branch=main]
 */

const https = require('https');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const token = process.env.COOLIFY_API_TOKEN;
    if (!token) {
      reject(new Error('COOLIFY_API_TOKEN not set'));
      return;
    }

    const options = {
      hostname: 'coolify.alternativedown.com.br',
      port: 443,
      path: `/api/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

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
