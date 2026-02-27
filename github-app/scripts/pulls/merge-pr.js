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

async function mergePR() {
  try {
    const params = parseArgs();
    const { repo, number, method = 'merge', title, message } = params;

    if (!repo || !number) {
      console.error('Erro: --repo e --number são obrigatórios');
      console.error('Uso: node merge-pr.js --repo owner/repo --number 42 --method merge');
      console.error('Métodos: merge, squash, rebase');
      process.exit(1);
    }

    if (!['merge', 'squash', 'rebase'].includes(method)) {
      console.error('Erro: --method deve ser "merge", "squash" ou "rebase"');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      merge_method: method,
    };

    if (title) payload.commit_title = title;
    if (message) payload.commit_message = message;

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}/merge`,
      method: 'PUT',
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
              console.log(`\n✅ PR mergeado com sucesso!\n`);
              console.log(`🟣 #${number}`);
              console.log(`Método: ${method}`);
              console.log(`SHA: ${json.sha.substring(0, 7)}`);
              resolve(json);
            } else if (res.statusCode === 405) {
              console.error(`❌ PR não pode ser mergeado (já foi mergeado ou está conflitado)`);
              reject(new Error('PR merge conflict or already merged'));
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
    console.error('Erro ao mergear PR:', error.message);
    process.exit(1);
  }
}

mergePR().catch(console.error);
