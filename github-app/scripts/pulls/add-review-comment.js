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

async function addReviewComment() {
  try {
    const params = parseArgs();
    const { repo, number, 'commit-id': commitId, path, line, body } = params;

    if (!repo || !number || !commitId || !path || !line || !body) {
      console.error('Erro: --repo, --number, --commit-id, --path, --line e --body são obrigatórios');
      console.error('');
      console.error('Uso:');
      console.error('  node add-review-comment.js \\');
      console.error('    --repo owner/repo \\');
      console.error('    --number 42 \\');
      console.error('    --commit-id abc123def456 \\');
      console.error('    --path src/index.js \\');
      console.error('    --line 10 \\');
      console.error('    --body "Comentário sobre esta linha"');
      console.error('');
      console.error('Parâmetros:');
      console.error('  --repo (obrigatório)       - owner/repo');
      console.error('  --number (obrigatório)     - Número do PR');
      console.error('  --commit-id (obrigatório)  - SHA do commit');
      console.error('  --path (obrigatório)       - Caminho do arquivo (ex: src/index.js)');
      console.error('  --line (obrigatório)       - Número da linha na diff (posição)');
      console.error('  --body (obrigatório)       - Comentário (Markdown)');
      process.exit(1);
    }

    const lineNum = parseInt(line, 10);
    if (isNaN(lineNum) || lineNum < 1) {
      console.error(`Erro: --line deve ser um número >= 1`);
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      body: body,
      commit_id: commitId,
      path: path,
      position: lineNum,  // position para PR comments
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}/comments`,
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
              console.log(`\n✅ Comentário de review adicionado com sucesso!\n`);
              console.log(`💬 Review Comment ID: ${json.id}`);
              console.log(`📄 Arquivo: ${json.path}`);
              console.log(`📍 Posição (diff): ${json.position}`);
              console.log(`👤 Usuário: ${json.user.login}`);
              console.log(`📝 Comentário:`);
              console.log(`   ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
              console.log(`🔗 ${json.html_url}`);
              resolve(json);
            } else if (res.statusCode === 422) {
              console.error(`\n⚠️  Erro (422): Validação falhou`);
              console.error(`Possíveis causas:`);
              console.error(`  - Commit não faz parte do PR`);
              console.error(`  - Position (linha) está fora do diff`);
              console.error(`  - Arquivo não foi modificado neste PR`);
              console.error(`\nDetalhes da API:`, json.message || json.errors?.[0]?.message || responseData);
              reject(new Error(json.message));
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
    console.error('Erro ao adicionar comentário:', error.message);
    process.exit(1);
  }
}

addReviewComment().catch(console.error);
