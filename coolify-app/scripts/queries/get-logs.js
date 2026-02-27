#!/usr/bin/env node

/**
 * Get logs from a Coolify application
 * Usage: node get-logs.js <applicationId> [--tail=50]
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
    console.error('Usage: node get-logs.js <applicationId> [--tail=50]');
    process.exit(1);
  }

  const tailArg = process.argv.find(arg => arg.startsWith('--tail='));
  const tail = tailArg ? tailArg.split('=')[1] : '50';

  try {
    const result = await makeRequest('GET', `/applications/${appId}/logs?tail=${tail}`);
    
    if (result.status !== 200) {
      console.error(`Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const logs = result.body.data || result.body;
    console.log(`Recent logs (last ${tail} lines):\n`);
    
    if (Array.isArray(logs)) {
      logs.forEach(log => console.log(log));
    } else {
      console.log(logs);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
