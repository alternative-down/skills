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

async function protectBranch() {
  try {
    const params = parseArgs();
    const { repo, branch, require_pr = 'true', require_review = 'false' } = params;

    if (!repo || !branch) {
      console.error('Erro: --repo e --branch são obrigatórios');
      console.error('Uso: node protect-branch.js --repo owner/repo --branch main --require_pr true');
      process.exit(1);
    }

    const token = await mintToken();

    const payload = {
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: require_review === 'true' ? 1 : 0,
      },
      required_status_checks: {
        strict: true,
        contexts: [],
      },
      restrictions: null,
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/branches/${branch}/protection`,
      method: 'PUT',
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
              console.log(`\n✅ Branch protegido!\n`);
              console.log(`🔒 ${branch}`);
              console.log(`📦 ${repo}`);
              console.log(`Proteções ativadas:`);
              console.log(`   - Enforce admins: ✅`);
              console.log(`   - PR obrigatório: ${require_pr === 'true' ? '✅' : '❌'}`);
              console.log(`   - Review obrigatório: ${require_review === 'true' ? '✅' : '❌'}`);
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
    console.error('Erro ao proteger branch:', error.message);
    process.exit(1);
  }
}

protectBranch().catch(console.error);
