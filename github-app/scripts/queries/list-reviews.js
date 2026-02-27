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

async function listReviews() {
  try {
    const params = parseArgs();
    const { repo, number } = params;

    if (!repo || !number) {
      console.error('Erro: --repo e --number são obrigatórios');
      console.error('Uso: node list-reviews.js --repo owner/repo --number 42');
      process.exit(1);
    }

    const token = await mintToken();

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}/reviews`,
      method: 'GET',
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
            const json = JSON.parse(responseData);
            if (res.statusCode === 200) {
              if (json.length === 0) {
                console.log(`\n📋 Nenhuma review encontrada no PR #${number}\n`);
                resolve([]);
                return;
              }

              console.log(`\n📋 Reviews do PR #${number}:\n`);
              json.forEach((review, idx) => {
                const stateEmoji = {
                  'APPROVED': '✅',
                  'CHANGES_REQUESTED': '⛔',
                  'COMMENTED': '💬',
                  'DISMISSED': '❌',
                  'PENDING': '⏳'
                };
                console.log(`${idx + 1}. ${stateEmoji[review.state] || '❓'} ${review.user.login}`);
                console.log(`   Estado: ${review.state}`);
                if (review.body) console.log(`   Comentário: ${review.body.substring(0, 60)}${review.body.length > 60 ? '...' : ''}`);
                console.log(`   ID: ${review.id}\n`);
              });
              console.log(`Total: ${json.length} reviews`);
              resolve(json);
            } else {
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
    console.error('Erro ao listar reviews:', error.message);
    process.exit(1);
  }
}

listReviews().catch(console.error);
