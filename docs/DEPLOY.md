# Guia de Deploy no Netlify

## 📋 Pré-requisitos

- Conta no Netlify
- Conta no Google Cloud (para OAuth)
- Banco de dados MySQL acessível (ex: PlanetScale, AWS RDS, DigitalOcean)
- Git configurado

## 🚀 Passos para Deploy

### 1. Preparar Banco de Dados

Antes de fazer o deploy, você precisa ter:
- ✅ Banco de dados MySQL disponível na internet
- ✅ Criar as tabelas via Prisma migrations

```bash
# Local (antes de fazer git push)
npx prisma migrate deploy
```

### 2. Configurar Variáveis de Ambiente no Netlify

Na parte de "Site Settings" → "Build & Deploy" → "Environment", adicione:

#### Variáveis Obrigatórias:
```
DATABASE_URL=mysql://username:password@host:port/database

NEXTAUTH_URL=https://seu-site.netlify.app
NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>

GOOGLE_CLIENT_ID=<do Google Cloud Console>
GOOGLE_CLIENT_SECRET=<do Google Cloud Console>

ADMIN_EMAIL=admin@empresa.com
ADMIN_PASSWORD=<senha_segura>
```

#### Variáveis Opcionais:
```
NEXT_PUBLIC_DASHBOARD_REFRESH_MS=30000
DEV_ALLOWED_ORIGINS=seu-site.netlify.app
```

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um OAuth 2.0 Client ID (Credenciais)
3. Autorize URLs:
   - `https://seu-site.netlify.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)

### 4. Conectar Repositório ao Netlify

1. Acesse [Netlify](https://app.netlify.com)
2. "Add new site" → "Import an existing project"
3. Selecione GitHub e autorize
4. Escolha o repositório
5. O `netlify.toml` já está configurado

### 5. Monitorar o Build

O Netlify executará:
```bash
npm run netlify-build  # Gera Prisma Client + Build Next.js
```

## ⚙️ Configurações Especiais

### Puppeteer (PDF Generation)
O projeto usa Puppeteer para gerar PDFs. No Netlify:
- ✅ Já está configurado no `netlify.toml`
- ✅ A versão é compatível com sistema Linux

### Prisma
- 🔧 Gerado automaticamente antes do build
- 🗄️ Migrations executadas manualmente (via `npx prisma migrate deploy`)

### Next.js
- 📦 Versão: 16.1.6
- 🎯 Build otimizado para produção
- 🌐 SSR/ISR habilitados

## 🔒 Segurança

- ❌ NUNCA commite `.env.local` ou `client_secret.json`
- ✅ Use variáveis de ambiente do Netlify
- ✅ NEXTAUTH_SECRET deve ser uma string aleatória de 32+ caracteres

Para gerar `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## 📊 Monitoramento

### Build Falhou?
1. Verifique o Netlify Build Log
2. Verifique se as variáveis de ambiente estão corretas
3. Verifique se o banco de dados está acessível:
   ```bash
   mysql -h <host> -u <user> -p<password> -D <database> -e "SELECT 1"
   ```

### Error: DATABASE_URL not set
- Adicione em "Build & Deploy" → "Environment variables"

### Error: NEXTAUTH_SECRET not set
- Gere uma nova: `openssl rand -base64 32`
- Adicione ao Netlify

## 🔄 Fluxo de Atualização

Após fazer commit e push:

1. **GitHub** recebe o push
2. **Netlify** detecta mudança automaticamente
3. **Build** é executado
4. Se sucesso → Deploy automático
5. Se falha → Email com erro

## 📝 Post-Deploy

1. Verifique se o site está acessível
2. Teste login com Google
3. Teste login com credenciais locais
4. Verifique se os PDFs são gerados corretamente
5. Teste acesso ao dashboard

## 🆘 Troubleshooting

| Erro | Solução |
|------|---------|
| Build timeout | Increasar CI timeout em Netlify settings |
| Puppeteer error | Usar versão chromium-browser do Linux |
| CORS error | Adicionar domínio em `DEV_ALLOWED_ORIGINS` |
| 404 em páginas dinâmicas | Verifique rewrites no `netlify.toml` |

---

**Última atualização:** 15 de Abril de 2026
