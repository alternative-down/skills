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

async function deleteBranch() {
  try {
    const params = parseArgs();
    const { repo, branch } = params;

    if (!repo || !branch) {
      console.error('Erro: --repo e --branch são obrigatórios');
      console.error('Uso: node delete-branch.js --repo owner/repo --branch feature-branch');
      process.exit(1);
    }

    if (branch === 'main' || branch === 'master') {
      console.error(`❌ Erro: Não é possível deletar a branch principal "${branch}"`);
      process.exit(1);
    }

    const token = await mintToken();

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/git/refs/heads/${branch}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'OpenClaw-GitHub-App',
      },
    };

    return new Promise((resolve, reject) => {
      https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode === 204) {
              console.log(`\n✅ Branch deletado!\n`);
              console.log(`🗑️  ${branch}`);
              resolve({ success: true });
            } else {
              const json = JSON.parse(responseData);
              console.error(`Erro (${res.statusCode}):`, json.message || responseData);
              reject(new Error(json.message));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao deletar branch:', error.message);
    process.exit(1);
  }
}

deleteBranch().catch(console.error);
