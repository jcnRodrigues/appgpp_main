# 🚀 Deploy Netlify - Guia Rápido

## ⚡ TL;DR (Resumo Executivo)

Seu projeto Next.js está **100% pronto** para deploy no Netlify!

**Tempo esperado:** 15 minutos

---

## 📦 O que foi preparado?

✅ **netlify.toml** - Configuração otimizada para produção  
✅ **package.json** - Script `netlify-build` configurado  
✅ **Next.js 16** - Build otimizado  
✅ **Prisma 6** - Geração automática pré-build  
✅ **NextAuth** - OAuth Google + Autenticação Local  
✅ **Puppeteer** - PDF generation com flags de sandbox  
✅ **Middleware** - Proteção de rotas implementada  

---

## 🎯 5 Passos para Deploy

### 1️⃣ Banco de Dados (5 min)
```bash
# Tenha seu DATABASE_URL pronto (MySQL)
DATABASE_URL="mysql://user:password@host:port/database"

# Execute localmente (antes de fazer push)
npx prisma migrate deploy
```

**Opções de MySQL:**
- [PlanetScale](https://planetscale.com) - Grátis, fácil
- [AWS RDS](https://aws.amazon.com/rds) - Robusto
- [DigitalOcean](https://www.digitalocean.com) - Simples

### 2️⃣ Google OAuth (5 min)
1. Vá para [Google Cloud Console](https://console.cloud.google.com)
2. Criar OAuth 2.0 Client ID
3. Autorizar: `https://seu-site.netlify.app/api/auth/callback/google`
4. Copiar `ID` e `Secret`

### 3️⃣ Gerar Secrets (2 min)
```bash
# Terminal - gerar NEXTAUTH_SECRET
openssl rand -base64 32
# Copie o resultado
```

### 4️⃣ Conectar Netlify (2 min)
1. [Acesse Netlify](https://app.netlify.app)
2. "Add new site" → "Import an existing project"
3. GitHub → Selecione repositório
4. Padrões já estão configurados no `netlify.toml`

### 5️⃣ Variáveis de Ambiente (1 min)
No Netlify: **Site Settings** → **Build & Deploy** → **Environment**

Cole cada variável:
```
DATABASE_URL = mysql://...
NEXTAUTH_URL = https://seu-site.netlify.app
NEXTAUTH_SECRET = <resultado do openssl>
GOOGLE_CLIENT_ID = <do Google>
GOOGLE_CLIENT_SECRET = <do Google>
ADMIN_EMAIL = admin@empresa.com
ADMIN_PASSWORD = SenhaForte123!
```

---

## ✨ Depois que Deploy Estiver Live

Teste:
- [ ] Login com Google
- [ ] Login com admin (email + senha)
- [ ] Gerar PDF
- [ ] Dashboard funcionando
- [ ] Todos os formulários acessíveis

---

## 📚 Documentação Completa

Leia em ordem:

1. **DEPLOY_CHECKLIST.md** - Passo a passo detalhado ✅
2. **ENV_REFERENCE.md** - Explicação de cada variável 🔐
3. **DEPLOY.md** - Troubleshooting e dicas 🆘

---

## 🆘 Problemas Comuns?

| Problema | Solução |
|----------|---------|
| Build falha | Verifique `DATABASE_URL` em "Environment" |
| Login falha | Confirme `NEXTAUTH_SECRET` e `NEXTAUTH_URL` |
| Google OAuth erro 400 | Adicione domínio no Google Cloud Console |
| PDF não gera | Puppeteer já está configurado, sem mudanças |

---

## 📞 Próximas Ações

1. ✅ Leia os arquivos `.md` que foram criados
2. ✅ Prepare o banco de dados MySQL
3. ✅ Configure Google OAuth
4. ✅ Faça push do código
5. ✅ Conecte ao Netlify
6. ✅ Adicione variáveis de ambiente
7. ✅ Deploy automático iniciará!

---

## 🎉 Resultado Final

```
https://seu-site.netlify.app
```

Seu app estará **online**, com:
- ✅ Autenticação segura
- ✅ Banco de dados em produção
- ✅ PDFs gerados automaticamente
- ✅ Dashboard em tempo real
- ✅ Escalabilidade automática

---

**Criado:** 15 de Abril de 2026  
**Status:** ✅ Pronto para produção
