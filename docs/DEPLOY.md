# Deploy

Este projeto roda como uma aplicacao Next.js com Prisma e MySQL.

Para o passo a passo completo de preparacao, veja:

- [`docs/PRODUCAO.md`](./PRODUCAO.md)

Resumo do fluxo:

1. Criar e revisar o `.env` com base em [`.env.example`](../.env.example).
2. Garantir acesso ao MySQL.
3. Executar `npm run db:deploy`.
4. Executar `npm run build`.
5. Subir com `npm run start`.
6. Validar login, permissao, PDF e backup.

Observacao:

- O app precisa de `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `APPGPP_PUBLIC_URL` e `DATABASE_URL` corretos para operar em producao.
