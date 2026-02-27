#!/usr/bin/env node
const fs = require('fs');
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

async function listBranches() {
  try {
    const params = parseArgs();
    const { repo, pattern } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório. Exemplo: --repo owner/repo-name');
      process.exit(1);
    }

    const token = await mintToken();

    const path = `/repos/${repo}/branches?per_page=30`;

    const options = {
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'OpenClaw-GitHub-App',
      },
    };

    return new Promise((resolve, reject) => {
      https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            let branches = JSON.parse(data);
            
            // Filtrar por padrão se especificado
            if (pattern) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              branches = branches.filter(b => regex.test(b.name));
            }

            console.log(`\n🌿 Branches - ${repo}\n`);
            if (!Array.isArray(branches) || branches.length === 0) {
              console.log('Nenhum branch encontrado.');
              resolve([]);
              return;
            }

            branches.forEach((branch, i) => {
              const protection = branch.protected ? '🔒' : '🔓';
              const sha = branch.commit.sha.substring(0, 7);
              console.log(`${i + 1}. ${protection} ${branch.name}`);
              console.log(`   └─ Commit: ${sha}`);
            });
            resolve(branches);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao listar branches:', error.message);
    process.exit(1);
  }
}

listBranches().catch(console.error);
