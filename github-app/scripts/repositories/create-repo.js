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

async function createRepo() {
  try {
    const params = parseArgs();
    const { name, description = '', private: isPrivate = 'false', issues = 'true', projects = 'true' } = params;

    if (!name) {
      console.error('Erro: --name é obrigatório');
      console.error('Uso: node create-repo.js --name repo-name --description "Descrição" --private false');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      name,
      description: description || '',
      private: isPrivate === 'true',
      has_issues: issues === 'true',
      has_projects: projects === 'true',
      has_downloads: false,
      has_wiki: false,
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: '/orgs/alternative-down/repos',
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
              const privacy = json.private ? '🔒' : '🌐';
              console.log(`\n✅ Repositório criado!\n`);
              console.log(`${privacy} ${json.name}`);
              console.log(`🔗 ${json.html_url}`);
              console.log(`📋 ${json.description || '(sem descrição)'}`);
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
    console.error('Erro ao criar repositório:', error.message);
    process.exit(1);
  }
}

createRepo().catch(console.error);
