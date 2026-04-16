# ✅ CHECKLIST DE DEPLOY - APPGPP

**Data:** 15 de Abril de 2026  
**Status:** Pronto para começar  
**Tempo total estimado:** 30-45 minutos

---

## ��� FASE 1: Banco de Dados PlanetScale (10 min)

- [ ] Acesse https://planetscale.com
- [ ] Crie conta (signup com email)
- [ ] Clique "Create a database"
- [ ] Nome: **appgpp**
- [ ] Região: **South America (São Paulo)**
- [ ] Clique "Create database"
- [ ] Aguarde criação (2-3 min)
- [ ] Clique em "Connections"
- [ ] Copie a string MySQL
- [ ] Salve como `DATABASE_URL`

**Valor copiado:**
```
DATABASE_URL = 
```

---

## ��� FASE 2: Google OAuth Setup (15 min)

### 2.1 - Criar Projeto
- [ ] Acesse https://console.cloud.google.com
- [ ] Clique "Select a Project" → "New Project"
- [ ] Nome: **appgpp**
- [ ] Clique "Create"
- [ ] Aguarde criar

### 2.2 - Ativar Google+ API
- [ ] Busque "Google+ API"
- [ ] Clique em "Enable"

### 2.3 - OAuth Consent Screen
- [ ] Vá para "Credentials"
- [ ] Clique "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] Se pedir, configure "OAuth consent screen"
  - [ ] App name: **appgpp**
  - [ ] User support email: seu-email@empresa.com
  - [ ] Developer contact email: seu-email@empresa.com
  - [ ] Clique "Save and Continue"
  - [ ] Scopes: deixe padrão → "Save and Continue"
  - [ ] Test users: "Save and Continue"

### 2.4 - OAuth 2.0 Client ID
- [ ] Clique "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] Application type: **Web Application**
- [ ] Name: **appgpp**
- [ ] Authorized JavaScript origins:
  - [ ] `http://localhost:3000`
- [ ] Authorized redirect URIs:
  - [ ] `http://localhost:3000/api/auth/callback/google`
- [ ] Clique "Create"
- [ ] Copie **Client ID**
- [ ] Copie **Client Secret**

**Valores copiados:**
```
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
```

---

## ��� FASE 3: Deploy Netlify (10 min)

### 3.1 - Conectar Repositório
- [ ] Acesse https://app.netlify.com (login com GitHub é mais fácil)
- [ ] Clique "Add new site"
- [ ] Escolha "Import an existing project"
- [ ] Selecione **GitHub**
- [ ] Autorize Netlify
- [ ] Busque **appgpp_main**
- [ ] Clique "Import"

### 3.2 - Build Configuration
- [ ] Build command: ✅ `npm run netlify-build` (já correto)
- [ ] Publish directory: ✅ `.next` (já correto)
- [ ] Clique "Deploy site"
- [ ] Aguarde build (pode falhar por falta de variáveis, é normal)

**URL do Netlify (copie quando souber):**
```
NEXTAUTH_URL = https://seu-site-aleatorio.netlify.app
```

### 3.3 - Adicionar Variáveis de Ambiente
- [ ] Vá para: **Site settings**
- [ ] Clique: **Build & Deploy** → **Environment**
- [ ] Clique: **Edit variables**

Adicione 7 variáveis (uma por uma):

#### Variável 1
```
Name: DATABASE_URL
Value: [copie da PlanetScale]
```
- [ ] Adicionada

#### Variável 2
```
Name: NEXTAUTH_SECRET
Value: UmQzp8awFLOkxwft6SbPiOMcgP8mXubWu+l522PnzMQ=
```
- [ ] Adicionada

#### Variável 3
```
Name: NEXTAUTH_URL
Value: https://seu-site.netlify.app
```
- [ ] Adicionada

#### Variável 4
```
Name: GOOGLE_CLIENT_ID
Value: [copie do Google Cloud]
```
- [ ] Adicionada

#### Variável 5
```
Name: GOOGLE_CLIENT_SECRET
Value: [copie do Google Cloud]
```
- [ ] Adicionada

#### Variável 6
```
Name: ADMIN_EMAIL
Value: seu-email@empresa.com
```
- [ ] Adicionada

#### Variável 7
```
Name: ADMIN_PASSWORD
Value: SenhaForte123!
```
- [ ] Adicionada

### 3.4 - Triggar Novo Deploy
- [ ] Clique "Save"
- [ ] Vá para "Deploys"
- [ ] Clique "Trigger deploy" → "Deploy site"
- [ ] Aguarde novo build (~5-10 min)
- [ ] Status muda para "Published" ✅

---

## ��� FASE 4: Atualizar Google OAuth (5 min)

Agora que sabe a URL do site:

- [ ] Acesse https://console.cloud.google.com
- [ ] Vá para: **Credentials** → **OAuth 2.0 Client ID (appgpp)**
- [ ] Adicione em **Authorized JavaScript origins:**
  - [ ] `https://seu-site.netlify.app`
- [ ] Adicione em **Authorized redirect URIs:**
  - [ ] `https://seu-site.netlify.app/api/auth/callback/google`
- [ ] Clique "Save"
- [ ] Google leva alguns minutos para atualizar

---

## ��� FASE 5: Testes Finais (5 min)

- [ ] Acesse: `https://seu-site.netlify.app`
- [ ] Clique "Sign in"
- [ ] Teste login com **Google OAuth**
- [ ] Teste login com **email admin + password**
- [ ] Acesse **Dashboard**
- [ ] Gere um **PDF** (validar Puppeteer)
- [ ] Teste todos os **formulários**

---

## ��� DEPLOYMENT COMPLETO!

Quando todas as fases estiverem verificadas:

✅ Seu app está **LIVE** em produção!
✅ Qualquer push para `main` fará deploy automático
✅ Banco de dados MySQL configurado
✅ Google OAuth funcionando

---

## ��� Valores Importantes (Guarde!)

```
NEXTAUTH_SECRET: UmQzp8awFLOkxwft6SbPiOMcgP8mXubWu+l522PnzMQ=
DATABASE_URL: (preenchido na PlanetScale)
GOOGLE_CLIENT_ID: (do Google Cloud)
GOOGLE_CLIENT_SECRET: (do Google Cloud)
NEXTAUTH_URL: (URL do Netlify descoberta na Fase 3)
ADMIN_EMAIL: seu-email@empresa.com
ADMIN_PASSWORD: SenhaForte123!
```

---

## ��� Comece Agora!

**PRÓXIMO PASSO:** Abra https://planetscale.com e crie seu database!

