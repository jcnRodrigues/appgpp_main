# ✅ Checklist de Deploy - Netlify

## 🔧 Configuração do Projeto

- [x] `netlify.toml` atualizado com configurações de produção
- [x] `package.json` com script `netlify-build` 
- [x] `next.config.ts` preparado
- [x] Prisma configurado com MySQL
- [x] NextAuth configurado com Google OAuth
- [x] Puppeteer com flags de sandbox para ambiente Linux
- [x] Middleware de autenticação implementado
- [x] Build cache habilitado

## 📋 Antes de Fazer o Primeiro Deploy

### Preparação do Banco de Dados
- [ ] Criar banco de dados MySQL acessível via internet
- [ ] Obter `DATABASE_URL` (formato: `mysql://user:password@host/database`)
- [ ] Testar conexão localmente com `npx prisma db push`
- [ ] Executar migrações: `npx prisma migrate deploy`

### Credenciais Google OAuth
- [ ] Criar projeto no [Google Cloud Console](https://console.cloud.google.com)
- [ ] Criar OAuth 2.0 Client ID (tipo: Web Application)
- [ ] Adicionar URLs autorizadas:
  - `https://seu-dominio.netlify.app`
  - `https://seu-dominio.netlify.app/api/auth/callback/google`
  - `http://localhost:3000` (para testes locais)
- [ ] Copiar `GOOGLE_CLIENT_ID`
- [ ] Copiar `GOOGLE_CLIENT_SECRET`

### Secrets e Configuração
- [ ] Gerar `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Definir `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- [ ] Preparar lista de variáveis para o Netlify

## 🚀 Processo de Deploy

### Passo 1: Preparar Repositório
```bash
git add .
git commit -m "chore: prepare for netlify deploy"
git push origin main
```

### Passo 2: Conectar ao Netlify
- [ ] Ir para [Netlify](https://app.netlify.com)
- [ ] Clicar "Add new site" → "Import an existing project"
- [ ] Autorizar GitHub
- [ ] Selecionar repositório
- [ ] Deixar build settings como padrão (já estão no `netlify.toml`)

### Passo 3: Configurar Variáveis de Ambiente
No Netlify (Site Settings → Build & Deploy → Environment):

```
DATABASE_URL = mysql://user:password@host/database
NEXTAUTH_URL = https://seu-site.netlify.app
NEXTAUTH_SECRET = <resultado de openssl rand -base64 32>
GOOGLE_CLIENT_ID = <do Google Cloud>
GOOGLE_CLIENT_SECRET = <do Google Cloud>
ADMIN_EMAIL = admin@empresa.com
ADMIN_PASSWORD = <senha_segura>
NEXT_PUBLIC_DASHBOARD_REFRESH_MS = 30000
```

### Passo 4: Triggar Build
- [ ] Netlify detectará automaticamente que há novo código
- [ ] Processo de build iniciará
- [ ] Deploy automático após sucesso

## 🧪 Testes Pós-Deploy

- [ ] Acessar `https://seu-site.netlify.app`
- [ ] Verificar página de login
- [ ] Testar login com credenciais admin (LOCAL)
- [ ] Testar login com Google OAuth
- [ ] Acessar dashboard após login
- [ ] Gerar PDF (para validar Puppeteer)
- [ ] Verificar acesso a todos os formulários
- [ ] Validar que middleware redireção funciona

## 🆘 Troubleshooting Rápido

### Build falha?
1. Verificar Netlify Build Log
2. Validar variável `DATABASE_URL`
3. Testar conexão MySQL: `mysql -h <host> -u <user> -p<pass> -D <db> -e "SELECT 1"`

### Erro 500 após deploy?
1. Verificar logs do servidor no Netlify
2. Testar se `NEXTAUTH_SECRET` está configurado
3. Validar se `NEXTAUTH_URL` é a URL correta

### Puppeteer: chromium-browser not found?
- Problema resolvido no Netlify com `--no-sandbox`
- Se persistir, usar `@sparticuz/chromium` (alternativa)

### Google OAuth não funciona?
- Verificar se URLs de callback estão autorizadas no Google
- Confirmar `GOOGLE_CLIENT_ID` e `CLIENT_SECRET` corretos
- Testar localmente antes: `npm run dev`

## 📊 Monitoramento Contínuo

- [ ] Configurar notificações de deploy no Netlify
- [ ] Verificar performance em "Analytics"
- [ ] Monitorar erros em "Functions" e "Logs"
- [ ] Configurar alertas para builds falhados

---

**Status:** ✅ Projeto pronto para deployment

**Versões:**
- Node: 20.x
- Next.js: 16.1.6
- Prisma: 6.19.2
- Puppeteer: 23.0.0

**Última atualização:** 15 de Abril de 2026
