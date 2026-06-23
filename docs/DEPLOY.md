# Deploy

Este projeto roda como uma aplicacao Next.js com Prisma/MySQL.

## Pre-requisitos
- Node.js 20+
- Banco MySQL acessivel
- Variaveis de ambiente definidas com base em [`.env.example`](/D:/Project_Gestao/appgpp/.env.example)

## Variaveis essenciais
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Build de producao
```bash
npm run build
```

## Execucao em producao
```bash
npm run start
```

## Antes de publicar
- Gere o client Prisma com `npm run build` ou `npx prisma generate`
- Confirme que o banco está acessivel a partir do servidor
- Teste login local e Google
- Teste o backup do banco em ambiente controlado

## Observacoes
- O fluxo recomendado e servir o app como uma aplicacao Node.js padrao.
