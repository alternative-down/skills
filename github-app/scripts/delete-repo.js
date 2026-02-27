#!/usr/bin/env node
const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

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

function askConfirmation(repoName) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`\n⚠️  Tem certeza que quer deletar "${repoName}"? (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function deleteRepo() {
  try {
    const params = parseArgs();
    const { repo } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório');
      console.error('Uso: node delete-repo.js --repo owner/repo-name');
      process.exit(1);
    }

    const [owner, name] = repo.split('/');
    if (!owner || !name) {
      console.error('Erro: formato --repo deve ser owner/repo-name');
      process.exit(1);
    }

    const confirmed = await askConfirmation(repo);
    if (!confirmed) {
      console.log('❌ Operação cancelada.');
      process.exit(0);
    }

    const token = await mintToken();

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}`,
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
              console.log(`\n✅ Repositório deletado!\n`);
              console.log(`🗑️  ${repo}`);
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
    console.error('Erro ao deletar repositório:', error.message);
    process.exit(1);
  }
}

deleteRepo().catch(console.error);
