#!/usr/bin/env node

/**
 * Get Coolify server information and statistics
 * Usage: node get-server-info.js
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
  try {
    const serverResult = await makeRequest('GET', '/server');
    
    if (serverResult.status !== 200) {
      console.error(`Error: ${serverResult.status}`);
      console.error(JSON.stringify(serverResult.body, null, 2));
      process.exit(1);
    }

    const server = serverResult.body.data || serverResult.body;
    
    console.log('=== Coolify Server Info ===\n');
    console.log(`  Version: ${server.version || 'unknown'}`);
    console.log(`  Name: ${server.name || 'unknown'}`);
    console.log(`  Docker: ${server.docker_engine || 'unknown'}`);
    console.log(`  Status: ${server.status || 'unknown'}`);
    console.log('');

    if (server.disk) {
      console.log('  Disk Usage:');
      console.log(`    Total: ${server.disk.total_gb}GB`);
      console.log(`    Used: ${server.disk.used_gb}GB`);
      console.log(`    Free: ${server.disk.free_gb}GB`);
      console.log('');
    }

    if (server.memory) {
      console.log('  Memory Usage:');
      console.log(`    Total: ${server.memory.total_gb}GB`);
      console.log(`    Used: ${server.memory.used_gb}GB`);
      console.log(`    Free: ${server.memory.free_gb}GB`);
      console.log('');
    }

    if (server.cpu) {
      console.log(`  CPU Usage: ${server.cpu}%\n`);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
