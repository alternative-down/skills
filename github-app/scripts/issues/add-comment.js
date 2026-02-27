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

async function addComment() {
  try {
    const params = parseArgs();
    const { repo, number, body } = params;

    if (!repo || !number || !body) {
      console.error('Erro: --repo, --number e --body são obrigatórios');
      console.error('Uso: node add-comment.js --repo owner/repo --number 42 --body "Comentário aqui"');
      process.exit(1);
    }

    const token = await mintToken();
    const payload = { body };
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/issues/${number}/comments`,
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
              console.log(`\n✅ Comentário adicionado!\n`);
              console.log(`💬 ${json.body.substring(0, 60)}...`);
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
    console.error('Erro ao adicionar comentário:', error.message);
    process.exit(1);
  }
}

addComment().catch(console.error);
