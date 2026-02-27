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

async function createReview() {
  try {
    const params = parseArgs();
    const { repo, number, event, body = '' } = params;

    if (!repo || !number || !event) {
      console.error('Erro: --repo, --number e --event são obrigatórios');
      console.error('Uso: node create-review.js --repo owner/repo --number 42 --event APPROVE|REQUEST_CHANGES|COMMENT --body "Mensagem"');
      console.error('\nEventos válidos:');
      console.error('  APPROVE - Aprovar o PR');
      console.error('  REQUEST_CHANGES - Solicitar mudanças');
      console.error('  COMMENT - Apenas comentar (sem decisão)');
      process.exit(1);
    }

    const validEvents = ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'];
    if (!validEvents.includes(event)) {
      console.error(`Erro: --event deve ser um de: ${validEvents.join(', ')}`);
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      event: event,
      body: body || '',
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}/reviews`,
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
              const eventEmoji = {
                'APPROVE': '✅ APROVADO',
                'REQUEST_CHANGES': '⛔ MUDANÇAS SOLICITADAS',
                'COMMENT': '💬 COMENTÁRIO'
              };
              console.log(`\n✅ Review enviado com sucesso!\n`);
              console.log(`${eventEmoji[event]} #${json.pull_request_review_id}`);
              console.log(`Usuário: ${json.user.login}`);
              console.log(`Estado: ${json.state}`);
              if (body) console.log(`Mensagem: ${body}`);
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
    console.error('Erro ao criar review:', error.message);
    process.exit(1);
  }
}

createReview().catch(console.error);
