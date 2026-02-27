#!/usr/bin/env node
const https = require('https');
const { execSync } = require('child_process');

async function mintToken() {
  const tokenScript = `${__dirname}/mint_installation_token.js`;
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

async function addLabels() {
  try {
    const params = parseArgs();
    const { repo, number, labels } = params;

    if (!repo || !number || !labels) {
      console.error('Erro: --repo, --number e --labels são obrigatórios');
      console.error('Uso: node add-labels.js --repo owner/repo --number 42 --labels "bug,urgent,p1"');
      process.exit(1);
    }

    const token = await mintToken();

    const labelList = labels.split(',').map(l => l.trim());
    const payload = { labels: labelList };
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/issues/${number}/labels`,
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
            if (res.statusCode === 200) {
              console.log(`\n✅ Labels adicionados!\n`);
              console.log(`🏷️  #${number}`);
              const labelNames = json.map(l => l.name).join(', ');
              console.log(`Labels: ${labelNames}`);
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
    console.error('Erro ao adicionar labels:', error.message);
    process.exit(1);
  }
}

addLabels().catch(console.error);
