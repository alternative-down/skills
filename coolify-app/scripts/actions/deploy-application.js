#!/usr/bin/env node

/**
 * Trigger a deployment for a Coolify application
 * Usage: node deploy-application.js <applicationId> [--force]
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
