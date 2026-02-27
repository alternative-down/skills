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

async function listCommits() {
  try {
    const params = parseArgs();
    const { repo, branch = 'main', limit = '10', author } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório. Exemplo: --repo owner/repo-name');
      process.exit(1);
    }

    const token = await mintToken();

    let path = `/repos/${repo}/commits?sha=${branch}&per_page=${Math.min(limit, 30)}`;
    if (author) {
      path += `&author=${author}`;
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
            const commits = JSON.parse(data);
            
            console.log(`\n📝 Commits - ${repo}/${branch}\n`);
            if (!Array.isArray(commits) || commits.length === 0) {
              console.log('Nenhum commit encontrado.');
              resolve([]);
              return;
            }

            commits.forEach((commit, i) => {
              const sha = commit.sha.substring(0, 7);
              const date = new Date(commit.commit.author.date).toLocaleDateString('pt-BR', {
                year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              });
              const author = commit.commit.author.name;
              const message = commit.commit.message.split('\n')[0].substring(0, 60);
              console.log(`${i + 1}. ${sha} - ${message}`);
              console.log(`   └─ ${author} (${date})`);
            });
            resolve(commits);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao listar commits:', error.message);
    process.exit(1);
  }
}

listCommits().catch(console.error);
