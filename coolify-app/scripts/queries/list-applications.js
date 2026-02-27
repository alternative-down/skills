#!/usr/bin/env node

/**
 * List all Coolify applications
 * Usage: node list-applications.js [projectId]
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
