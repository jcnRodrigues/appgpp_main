# Arquivo de Referência: Variáveis de Ambiente para Netlify

## 📝 Como Usar Este Arquivo

1. Copie as variáveis abaixo
2. Acesse Netlify → Site Settings → Build & Deploy → Environment
3. Cole cada variável individualmente com seus valores reais
4. NUNCA compartilhe variáveis com valores reais (secrets)

---

## 🔐 Variáveis a Configurar no Netlify

### 1. Banco de Dados (OBRIGATÓRIO)
```
NAME: DATABASE_URL
VALUE: mysql://user:password@host:port/database
```

**Exemplos:**
- PlanetScale: `mysql://user:password@aws.connect.psdb.cloud/database?sslaccept=strict`
- Local: `mysql://root:password@localhost:3306/appgpp`
- AWS RDS: `mysql://admin:password@database.abc123.us-east-1.rds.amazonaws.com:3306/appgpp`

---

### 2. NextAuth (OBRIGATÓRIO)
```
NAME: NEXTAUTH_URL
VALUE: https://seu-site.netlify.app
```

```
NAME: NEXTAUTH_SECRET
VALUE: <gerar com command abaixo>
```

**Para gerar NEXTAUTH_SECRET:**
```bash
# Execute no terminal:
openssl rand -base64 32

# Ou online em: https://generate-secret.vercel.app/32
```

---

### 3. Google OAuth (OBRIGATÓRIO para login Google)
```
NAME: GOOGLE_CLIENT_ID
VALUE: <do Google Cloud Console>
```

```
NAME: GOOGLE_CLIENT_SECRET
VALUE: <do Google Cloud Console>
```

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie uma conta gerenciada (OAuth 2.0 Client ID)
3. URIs de Origem Autorizadas:
   - `https://seu-site.netlify.app`
4. URIs Redirecionados Autorizados:
   - `https://seu-site.netlify.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)

---

### 4. Admin Local (OBRIGATÓRIO)
```
NAME: ADMIN_EMAIL
VALUE: seu-email@empresa.com
```

```
NAME: ADMIN_PASSWORD
VALUE: senha-muito-segura-123!
```

⚠️ **IMPORTANTE:** Altere a senha após primeiro login!

---

### 5. Dashboard Auto-Refresh (OPCIONAL)
```
NAME: NEXT_PUBLIC_DASHBOARD_REFRESH_MS
VALUE: 30000
```

Valores sugeridos:
- `0` = desabilita auto-refresh
- `30000` = 30 segundos (padrão)
- `60000` = 1 minuto
- `300000` = 5 minutos

---

### 6. Allowed Origins para Desenvolvimento (OPCIONAL)
```
NAME: DEV_ALLOWED_ORIGINS
VALUE: seu-site.netlify.app,localhost:3000,127.0.0.1:3000
```

---

## ✅ Checklist de Variáveis

Certifique-se de que todas estão configuradas:

- [x] `DATABASE_URL`
- [x] `NEXTAUTH_URL`
- [x] `NEXTAUTH_SECRET`
- [x] `GOOGLE_CLIENT_ID`
- [x] `GOOGLE_CLIENT_SECRET`
- [x] `ADMIN_EMAIL`
- [x] `ADMIN_PASSWORD`
- [ ] `NEXT_PUBLIC_DASHBOARD_REFRESH_MS` (opcional)

---

## 🔒 Segurança

### ✅ O que FAZER:
- Usar variáveis de ambiente do Netlify
- Gerar `NEXTAUTH_SECRET` com `openssl` ou ferramenta aleatória
- Usar senhas fortes (mínimo 12 caracteres)
- Manter MySQL com autenticação forte
- Rotacionar `NEXTAUTH_SECRET` periodicamente

### ❌ O que NÃO fazer:
- ❌ Commitar `.env` ou `.env.local`
- ❌ Compartilhar valores de secrets
- ❌ Usar senhas fracas
- ❌ Deixar banco de dados open ao público
- ❌ Usar `NEXTAUTH_SECRET` genérico

---

## 🧪 Validação Após Configurar

Execute no terminal local:

```bash
# Verificar que .env não está sendo trackado
git status | grep env

# Testar autenticação localmente
npm run dev
# Acesse http://localhost:3000 e teste login
```

---

## 📞 Referências

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Database URLs](https://www.prisma.io/docs/concepts/database-connectors/mysql)

---

**Criado:** 15 de Abril de 2026
