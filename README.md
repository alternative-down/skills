# OpenClaw Skills

Repositório de Skills para OpenClaw da organização Alternative Down.

Skills são pacotes reutilizáveis que estendem as capacidades do OpenClaw com novas ferramentas, automações e integrações.

## 📦 Skills Disponíveis

### 🐙 [github-app](./skills/github-app/)

Integração segura com GitHub via GitHub App. Sem PAT, sem expor credenciais.

**Funcionalidades:**
- ✅ Listar repositórios, issues, PRs, branches, commits
- ✅ Criar issues e PRs
- ✅ Fechar issues, mergear PRs
- ✅ Deletar branches
- ✅ Adicionar comentários e labels
- ✅ Git operations (clone, pull, push)

**Credenciais obrigatórias:**
```json
{
  "GITHUB_APP_ID": "...",
  "GITHUB_APP_INSTALLATION_ID": "...",
  "GITHUB_APP_PRIVATE_KEY_PATH": "..."
}
```

[📖 Documentação completa](./skills/github-app/SKILL.md)

---

## 🚀 Como Usar

### Instalação em OpenClaw

#### Opção 1: Usando git diretamente
```bash
# Clone o repositório
git clone https://github.com/alternative-down/skills.git

# Configure em ~/.openclaw/openclaw.json para carregar as skills
{
  "skills": {
    "load": {
      "extraDirs": ["~/path/to/skills/skills"]
    }
  }
}

# Restart Gateway
openclaw gateway restart
```

#### Opção 2: Copy & Paste
```bash
# Copie a skill desejada para
cp -r skills/github-app ~/.openclaw/skills/

# Restart Gateway
openclaw gateway restart
```

---

## 📝 Estrutura de um Skill

```
skill-name/
├── SKILL.md                 # Documentação e metadata
├── scripts/                 # Scripts opcionais
│   ├── main.js
│   └── helper.js
└── references/              # Documentação extra
    ├── troubleshooting.md
    └── examples.md
```

### SKILL.md (obrigatório)
- YAML frontmatter com `name` e `description`
- Markdown com instruções de uso
- Metadata OpenClaw com requisitos (bins, env vars, etc.)

**Exemplo:**
```markdown
---
name: skill-name
description: "O que essa skill faz"
metadata:
  {
    "openclaw": {
      "emoji": "🎯",
      "requires": { "bins": ["node"], "env": ["API_KEY"] },
      "homepage": "https://..."
    }
  }
---

# Skill Name

Instruções de uso...
```

---

## 🛠️ Desenvolvendo Novas Skills

1. **Crie um diretório** com o nome da skill
2. **Adicione SKILL.md** com documentação
3. **Adicione scripts** em `/scripts` se necessário
4. **Teste localmente** com OpenClaw
5. **Faça PR** para este repositório

### Checklist Antes de Submeter

- [ ] SKILL.md existe e está bem documentado
- [ ] Metadata OpenClaw está configurada corretamente
- [ ] Scripts têm permissão executável (`chmod +x`)
- [ ] Exemplos de uso estão no SKILL.md
- [ ] Testou localmente com um agente
- [ ] README.md atualizado com a nova skill
- [ ] Credenciais/secrets não estão commitadas

---

## 📋 Requisitos

- OpenClaw 2026.2.6 ou superior
- Node.js 18+ (para skills JavaScript)
- Para skills com requisitos especiais: veja a documentação da skill

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do repositório
2. Crie uma branch (`git checkout -b feature/nova-skill`)
3. Commit suas mudanças (`git commit -am 'Add nova skill'`)
4. Push para a branch (`git push origin feature/nova-skill`)
5. Abra um Pull Request

### Padrões de Código

- Scripts em JavaScript: use `const` e `async/await`
- SKILL.md: markdown bem formatado, exemplos claros
- Documentação: em português (PT-BR) por padrão
- Segurança: nunca commitar secrets, API keys, ou tokens

---

## 📚 Referências

- [OpenClaw Docs](https://docs.openclaw.ai)
- [AgentSkills Spec](https://agentskills.io)
- [ClawHub](https://clawhub.com)

---

## 📄 Licença

MIT License - veja LICENSE para detalhes

---

## 💬 Suporte

- Issues: https://github.com/alternative-down/skills/issues
- Discussions: https://github.com/alternative-down/skills/discussions
- Discord: [OpenClaw Community](https://discord.com/invite/clawd)

---

**Desenvolvido por Kael** ⚡
