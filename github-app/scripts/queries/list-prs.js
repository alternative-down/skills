#!/usr/bin/env node
const fs = require('fs');
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

async function listPRs() {
  try {
    const params = parseArgs();
    const { repo, state = 'open', head } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório. Exemplo: --repo owner/repo-name');
      process.exit(1);
    }

    const token = await mintToken();

    let path = `/repos/${repo}/pulls?state=${state}&per_page=30`;
    if (head) {
      path += `&head=${head}`;
    }

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
            const prs = JSON.parse(data);
            
            console.log(`\n🔀 Pull Requests - ${repo} (${state})\n`);
            if (!Array.isArray(prs) || prs.length === 0) {
              console.log('Nenhum PR encontrado.');
              resolve([]);
              return;
            }

            prs.forEach((pr, i) => {
              const status = pr.state === 'open' ? '🟢 ABERTO' : pr.merged ? '🟣 MERGED' : '🔴 FECHADO';
              const date = new Date(pr.created_at).toLocaleDateString('pt-BR');
              console.log(`${i + 1}. ${status} #${pr.number} - ${pr.title}`);
              console.log(`   └─ Autor: ${pr.user.login} (${date})`);
              console.log(`   └─ ${pr.head.ref} → ${pr.base.ref}`);
              if (pr.draft) {
                console.log(`   └─ ⚠️  DRAFT`);
              }
            });
            resolve(prs);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao listar PRs:', error.message);
    process.exit(1);
  }
}

listPRs().catch(console.error);
