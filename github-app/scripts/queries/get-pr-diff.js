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

async function getPRDiff() {
  try {
    const params = parseArgs();
    const { repo, number, format = 'diff' } = params;

    if (!repo || !number) {
      console.error('Erro: --repo e --number são obrigatórios');
      console.error('Uso: node get-pr-diff.js --repo owner/repo --number 42 [--format diff|patch]');
      process.exit(1);
    }

    const token = await mintToken();

    const acceptHeader = format === 'patch' ? 'application/vnd.github.v3.patch' : 'application/vnd.github.v3.diff';

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/pulls/${number}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': acceptHeader,
        'User-Agent': 'OpenClaw-GitHub-App',
      },
    };

    return new Promise((resolve, reject) => {
      https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              // Para diff/patch, a resposta é texto plano, não JSON
              if (format === 'patch' || format === 'diff') {
                const lines = responseData.split('\n');
                const headerLine = lines[0] || '';
                const filesChanged = responseData.match(/^diff --git/gm)?.length || 0;
                const additions = (responseData.match(/^\+(?!\+\+)/gm) || []).length;
                const deletions = (responseData.match(/^\-(?!\-\-)/gm) || []).length;

                console.log(`\n📊 Diff do PR #${number}:\n`);
                console.log(`Arquivos alterados: ${filesChanged}`);
                console.log(`+ Adições: ${additions}`);
                console.log(`- Deletions: ${deletions}`);
                console.log(`\n📝 Conteúdo (primeiras 200 linhas):\n`);
                console.log(lines.slice(0, 200).join('\n'));
                if (lines.length > 200) {
                  console.log(`\n... (${lines.length - 200} linhas omitidas)`);
                }
                resolve(responseData);
              }
            } else {
              // Se for erro JSON
              try {
                const json = JSON.parse(responseData);
                console.error(`Erro (${res.statusCode}):`, json.message || responseData);
                reject(new Error(json.message));
              } catch {
                console.error(`Erro (${res.statusCode}):`, responseData);
                reject(new Error(responseData));
              }
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao obter diff do PR:', error.message);
    process.exit(1);
  }
}

getPRDiff().catch(console.error);
