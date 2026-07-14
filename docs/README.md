# App GPP

Projeto em Next.js.

## Rodando localmente

```bash
npm run dev
```

A aplicacao abre em `http://localhost:3000`.
Se preferir o launcher do Windows no projeto atual, use `scripts\Abrir-AppGPP.cmd dev` ou `AppGPP-Start.exe -Dev`.

## Producao

Se quiser um unico ponto de entrada, leia [`docs/RESUMO-GERAL-INSTALACAO-CONFIGURACAO.md`](./RESUMO-GERAL-INSTALACAO-CONFIGURACAO.md).
Consulte o guia em [`docs/PRODUCAO.md`](./PRODUCAO.md) para o passo a passo de preparo e validacao.
Para operacao em Windows com instalador/launcher, consulte [`docs/RUNBOOK-PRODUCAO-WINDOWS.md`](./RUNBOOK-PRODUCAO-WINDOWS.md).
Para suporte diario, consulte [`docs/OPERACAO-SUPORTE.md`](./OPERACAO-SUPORTE.md).
Se quiser publicar no IIS, veja [`docs/IIS-WINDOWS.md`](./IIS-WINDOWS.md).
Para um roteiro de 1 pagina, veja [`docs/CHECKLIST-IIS-WINDOWS11.md`](./CHECKLIST-IIS-WINDOWS11.md).
Para confirmar as pastas corretas, veja [`docs/ESTRUTURA-PASTAS-PRODUCAO.md`](./ESTRUTURA-PASTAS-PRODUCAO.md).
Para Docker com NGINX, veja [`docs/DOCKER-NGINX.md`](./DOCKER-NGINX.md).
Para publicar com dominio real e HTTPS valido, veja [`docs/DOCKER-DOMINIO-REAL.md`](./DOCKER-DOMINIO-REAL.md).
Para o checklist final de liberacao, veja [`docs/CHECKLIST-PRODUCAO-FINAL.md`](./CHECKLIST-PRODUCAO-FINAL.md).
Para a checklist de 1 pagina, veja [`docs/CHECKLIST-1-PAGINA-PRODUCAO.md`](./CHECKLIST-1-PAGINA-PRODUCAO.md).
Para o roteiro de backup e operacao, veja [`docs/OPERACAO-SUPORTE.md`](./OPERACAO-SUPORTE.md).
Para os comandos exatos de subida, veja [`docs/COMANDOS-SUBIR-APP.md`](./COMANDOS-SUBIR-APP.md).
Para a cola curta de operacao, veja [`docs/COLA-OPERACAO.md`](./COLA-OPERACAO.md).
Para a base de ambiente Docker, veja [`.env.docker.example`](../.env.docker.example).
Para configurar `NGINX_SERVER_NAME`, veja [`docs/DOCKER-DOMINIO-REAL.md`](./DOCKER-DOMINIO-REAL.md).
Para gerar certificados HTTPS locais, use [`scripts/Gerar-Certificado-HTTPS.cmd`](../scripts/Gerar-Certificado-HTTPS.cmd).
Para emitir certificado publico com renovacao automatica, use [`scripts/Emitir-Certificado-LetsEncrypt.cmd`](../scripts/Emitir-Certificado-LetsEncrypt.cmd).

Resumo rapido:

1. Preencher `.env` com base em [`.env.example`](../.env.example).
2. Rodar `npm run db:deploy`.
3. Rodar `npm run build`.
4. Subir com `npm run start`.

Antes de publicar, valide login, permissao, PDF e backup.
