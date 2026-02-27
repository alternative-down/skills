#!/usr/bin/env node

/**
 * Get detailed information about a specific Coolify application
 * Usage: node get-application.js <applicationId>
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
