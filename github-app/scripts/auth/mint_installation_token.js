#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

const appId = process.env.GITHUB_APP_ID;
const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
const keyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;

if (!appId || !installationId || !keyPath) {
  console.error('Missing required env vars: GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY_PATH');
  process.exit(1);
}

const privateKey = fs.readFileSync(keyPath, 'utf8');

const b64u = (value) =>
  Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const now = Math.floor(Date.now() / 1000);
const header = { alg: 'RS256', typ: 'JWT' };
const payload = { iat: now - 60, exp: now + 540, iss: appId };
const signingInput = `${b64u(header)}.${b64u(payload)}`;
const signer = crypto.createSign('RSA-SHA256');
signer.update(signingInput);
signer.end();
const signature = signer
  .sign(privateKey)
  .toString('base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');
const jwt = `${signingInput}.${signature}`;

const req = https.request(
  {
    hostname: 'api.github.com',
    path: `/app/installations/${installationId}/access_tokens`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'openclaw-github-app-skill',
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        const parsed = JSON.parse(body);
        if (!parsed.token) {
          console.error('GitHub response missing token');
          process.exit(1);
        }
        process.stdout.write(parsed.token);
        return;
      }

      console.error(`GitHub API error (${res.statusCode}): ${body}`);
      process.exit(1);
    });
  },
);

req.on('error', (err) => {
  console.error(`Request failed: ${err.message}`);
  process.exit(1);
});

req.end();
