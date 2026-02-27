#!/usr/bin/env node
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

async function mintToken() {
  const tokenScript = `${__dirname}/mint_installation_token.js`;
  const token = execSync(`node ${tokenScript}`, { encoding: 'utf8' }).trim();
  return token;
}

async function listRepos() {
  try {
    const token = await mintToken();

    const options = {
      hostname: 'api.github.com',
      path: '/installation/repositories',
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
            const json = JSON.parse(data);
            const repos = json.repositories || [];
            
            console.log(`\n📦 Repositórios (${repos.length} total)\n`);
            repos.forEach((repo, i) => {
              const lang = repo.language ? ` • ${repo.language}` : '';
              const privacy = repo.private ? '🔒' : '🌐';
              const pushed = new Date(repo.pushed_at).toLocaleDateString('pt-BR', {
                year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              });
              console.log(`${i + 1}. ${privacy} ${repo.name}${lang}`);
              console.log(`   └─ ${repo.html_url}`);
              console.log(`   └─ Último push: ${pushed}`);
            });
            resolve(repos);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao listar repositórios:', error.message);
    process.exit(1);
  }
}

listRepos().catch(console.error);
