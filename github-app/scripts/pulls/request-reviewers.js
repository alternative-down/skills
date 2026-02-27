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

async function requestReviewers() {
  try {
    const params = parseArgs();
    const { repo, number, reviewers } = params;

    if (!repo || !number || !reviewers) {
      console.error('Erro: --repo, --number e --reviewers são obrigatórios');
      console.error('Uso: node request-reviewers.js --repo owner/repo --number 42 --reviewers "user1,user2,user3"');
      process.exit(1);
    }

    const reviewersList = reviewers.split(',').map(r => r.trim()).filter(r => r);
    if (reviewersList.length === 0) {
      console.error('Erro: --reviewers deve conter pelo menos um usuário');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      reviewers: reviewersList,
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}/requested_reviewers`,
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
              console.log(`\n✅ Reviewers atribuídos com sucesso!\n`);
              console.log(`PR #${json.number} - ${json.title}`);
              console.log(`\n📋 Reviewers solicitados:`);
              if (json.requested_reviewers && json.requested_reviewers.length > 0) {
                json.requested_reviewers.forEach((reviewer, idx) => {
                  console.log(`  ${idx + 1}. @${reviewer.login}`);
                });
              }
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
    console.error('Erro ao solicitar reviewers:', error.message);
    process.exit(1);
  }
}

requestReviewers().catch(console.error);
