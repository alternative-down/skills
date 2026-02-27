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

async function getRepoInfo() {
  try {
    const params = parseArgs();
    const { repo } = params;

    if (!repo) {
      console.error('Erro: --repo é obrigatório');
      console.error('Uso: node get-repo-info.js --repo owner/repo-name');
      process.exit(1);
    }

    const token = await mintToken();

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repo}`,
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
            const repo = JSON.parse(data);
            
            const privacy = repo.private ? '🔒 PRIVADO' : '🌐 PÚBLICO';
            const status = repo.archived ? '📦 ARQUIVADO' : '✅ ATIVO';
            
            console.log(`\n📊 ${repo.name}\n`);
            console.log(`${privacy} • ${status}`);
            console.log(`📝 ${repo.description || '(sem descrição)'}`);
            console.log(`🔗 ${repo.html_url}`);
            console.log(`\n📈 Estatísticas:`);
            console.log(`   Stars: ⭐ ${repo.stargazers_count}`);
            console.log(`   Forks: 🔀 ${repo.forks_count}`);
            console.log(`   Issues: 📌 ${repo.open_issues_count}`);
            console.log(`   Watchers: 👀 ${repo.watchers_count}`);
            console.log(`\n⚙️  Configuração:`);
            console.log(`   Linguagem: ${repo.language || 'N/A'}`);
            console.log(`   Default Branch: ${repo.default_branch}`);
            console.log(`   Criado: ${new Date(repo.created_at).toLocaleDateString('pt-BR')}`);
            console.log(`   Atualizado: ${new Date(repo.updated_at).toLocaleDateString('pt-BR')}`);
            console.log(`   Push: ${new Date(repo.pushed_at).toLocaleDateString('pt-BR', { 
              year: '2-digit', month: '2-digit', day: '2-digit', 
              hour: '2-digit', minute: '2-digit' 
            })}`);
            console.log(`\n🛠️  Features:`);
            console.log(`   Issues: ${repo.has_issues ? '✅' : '❌'}`);
            console.log(`   Projects: ${repo.has_projects ? '✅' : '❌'}`);
            console.log(`   Wiki: ${repo.has_wiki ? '✅' : '❌'}`);
            console.log(`   Downloads: ${repo.has_downloads ? '✅' : '❌'}`);
            
            resolve(repo);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject).end();
    });
  } catch (error) {
    console.error('Erro ao obter informações do repositório:', error.message);
    process.exit(1);
  }
}

getRepoInfo().catch(console.error);
