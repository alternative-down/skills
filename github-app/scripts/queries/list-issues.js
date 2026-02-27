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

async function listIssues() {
  try {
    const params = parseArgs();
    const { repo, state = 'open', author } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório. Exemplo: --repo owner/repo-name');
      process.exit(1);
    }

    const token = await mintToken();

    let path = `/repos/${repo}/issues?state=${state}&per_page=30`;
    if (author) {
      path += `&creator=${author}`;
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
            const issues = JSON.parse(data);
            
            console.log(`\n📋 Issues - ${repo} (${state})\n`);
            if (!Array.isArray(issues) || issues.length === 0) {
              console.log('Nenhum issue encontrado.');
              resolve([]);
              return;
            }

            issues.forEach((issue, i) => {
              const status = issue.state === 'open' ? '🟢 ABERTO' : '🔴 FECHADO';
              const date = new Date(issue.created_at).toLocaleDateString('pt-BR');
              console.log(`${i + 1}. ${status} #${issue.number} - ${issue.title}`);
              console.log(`   └─ Autor: ${issue.user.login} (${date})`);
              if (issue.labels && issue.labels.length > 0) {
                const labels = issue.labels.map(l => l.name).join(', ');
                console.log(`   └─ Labels: ${labels}`);
              }
            });
            resolve(issues);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao listar issues:', error.message);
    process.exit(1);
  }
}

listIssues().catch(console.error);
