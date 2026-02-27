#!/usr/bin/env node
const https = require('https');
const { execSync } = require('child_process');

async function mintToken() {
  const tokenScript = `${__dirname}/../auth/mint_installation_token.js`;
  const token = execSync(`node ${tokenScript}`, { encoding: 'utf8' }).trim();
  return token;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i += 2) {
    params[args[i].replace('--', '')] = args[i + 1];
  }
  return params;
}

async function createIssue() {
  try {
    const params = parseArgs();
    const { repo, title, body = '', labels } = params;

    if (!repo || !title) {
      console.error('Erro: --repo e --title são obrigatórios');
      console.error('Uso: node create-issue.js --repo owner/repo --title "Título" --body "Descrição" --labels "bug,urgent"');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      title,
      body: body || '',
    };

    if (labels) {
      payload.labels = labels.split(',').map(l => l.trim());
    }

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/issues`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'OpenClaw-GitHub-App',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(responseData);
            if (res.statusCode === 201) {
              console.log(`\n✅ Issue criada com sucesso!\n`);
              console.log(`📌 #${json.number} - ${json.title}`);
              console.log(`🔗 ${json.html_url}`);
              resolve(json);
            } else {
              console.error(`Erro (${res.statusCode}):`, json.message || responseData);
              reject(new Error(json.message));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);

      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('Erro ao criar issue:', error.message);
    process.exit(1);
  }
}

createIssue().catch(console.error);
