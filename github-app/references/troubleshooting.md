# Troubleshooting

## 1) `fatal: could not read Username for 'https://github.com'`
Sem credencial ativa para remoto HTTPS. Use token de instalação do GitHub App e faça push/pull com URL autenticada.

## 2) `remote: Invalid username or token`
Token inválido para git (expirado, escopo incorreto ou não é installation token). Gere novo token.

## 3) `! [rejected] main -> main (fetch first)`
Remoto está na frente.

```bash
TOKEN=$(node scripts/mint_installation_token.js)
git pull --rebase https://x-access-token:${TOKEN}@github.com/<org>/<repo>.git main
git push https://x-access-token:${TOKEN}@github.com/<org>/<repo>.git main
```

## 4) `Resource not accessible by integration`
Permissões do GitHub App insuficientes (repo scope ou permission set). Ajustar permissões e reinstalar app se necessário.

## 5) `Bad credentials` na API
Token expirado. Gere novo token e repita a chamada.
