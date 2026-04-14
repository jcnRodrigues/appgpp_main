# App GPP

Projeto em Next.js.

## Rodando localmente

```bash
npm run dev
```

A aplicacao abre em `http://localhost:3000`.

## Deploy na Netlify

O projeto ja esta configurado com:

- `netlify.toml`
- plugin `@netlify/plugin-nextjs`
- script `npm run netlify-build` (executa `prisma generate` + `next build`)

### Build command

```bash
npm run netlify-build
```

### Variaveis de ambiente (Netlify)

Configure no painel da Netlify as mesmas variaveis do `.env.example`, principalmente:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_DASHBOARD_REFRESH_MS`
