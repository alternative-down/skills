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

async function updateRepo() {
  try {
    const params = parseArgs();
    const { repo, description, private: isPrivate, issues, projects } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório');
      console.error('Uso: node update-repo.js --repo owner/repo --description "Nova descrição" --private false');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {};
    
    if (description) payload.description = description;
    if (isPrivate !== undefined) payload.private = isPrivate === 'true';
    if (issues !== undefined) payload.has_issues = issues === 'true';
    if (projects !== undefined) payload.has_projects = projects === 'true';

    if (Object.keys(payload).length === 0) {
      console.error('Erro: Especifique pelo menos um parâmetro para atualizar');
      console.error('Parâmetros disponíveis: --description, --private, --issues, --projects');
      process.exit(1);
    }

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}`,
      method: 'PATCH',
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
              console.log(`\n✅ Repositório atualizado!\n`);
              console.log(`📦 ${json.name}`);
              if (description) console.log(`📝 ${json.description}`);
              if (isPrivate) console.log(`🔒 Privado: ${json.private}`);
              if (issues) console.log(`📌 Issues: ${json.has_issues}`);
              if (projects) console.log(`📊 Projects: ${json.has_projects}`);
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
    console.error('Erro ao atualizar repositório:', error.message);
    process.exit(1);
  }
}

updateRepo().catch(console.error);
