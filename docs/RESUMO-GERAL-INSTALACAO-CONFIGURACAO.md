# Resumo Geral de Instalacao e Configuracao

Este documento resume o cenario geral do AppGPP para instalacao, configuracao e subida em producao.

## 1. Visao geral

O projeto pode ser executado de 4 formas:

1. Node local para desenvolvimento ou teste.
2. Instalador Windows para servidor local.
3. Docker com NGINX para ambiente containerizado.
4. Docker com HTTPS local ou dominio real com Lets Encrypt.

O banco esperado e MySQL. O fluxo atual assume banco existente e preservacao de dados.

## 2. Variaveis essenciais

No `.env`, revise pelo menos:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APPGPP_PUBLIC_URL`
- `NGINX_SERVER_NAME`
- `LETSENCRYPT_CERT_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UNIFI_SECRET_KEY`

Variaveis comuns extras:

- `UNIFI_API_KEY`
- `HOST_INVENTORY_AGENT_TOKEN`
- `HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN`
- `PUPPETEER_EXECUTABLE_PATH`
- `CHROME_PATH`
- `GOOGLE_CHROME_BIN`

## 3. Preparacao padrao

1. Copie `.env.example` ou `.env.docker.example` para `.env`.
2. Ajuste `DATABASE_URL` para o banco correto.
3. Confirme que o banco MySQL ja existe.
4. Confirme permissao de conexao do usuario MySQL a partir do host do AppGPP.
5. Defina `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` com a URL publica real.
6. Defina `NEXTAUTH_SECRET` fixo e forte.
7. Revise credenciais de login, Google e UniFi, se aplicavel.

## 4. Comandos principais

### Node local

```bash
npm ci
npm run db:deploy
npm run build
npm run start
```

### Node na rede local

```bash
npm run start:lan
```

### Instalador Windows

```bash
npm run installer:build
C:\AppGPP\scripts\Abrir-AppGPP.cmd
```

### Docker com NGINX

```bash
docker compose up -d --build
```

### Docker com HTTPS local

```powershell
scripts\Gerar-Certificado-HTTPS.cmd
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build
```

### Docker com dominio real e Lets Encrypt

```powershell
scripts\Emitir-Certificado-LetsEncrypt.cmd -Domain app.seudominio.com -Email admin@empresa.com
docker compose -f docker-compose.yml -f docker-compose.letsencrypt.yml -f docker-compose.letsencrypt-nginx.yml up -d --build
```

## 5. Estrutura de destino

### Windows com instalador

- Pasta recomendada: `C:\AppGPP`
- O instalador salva `appgpp-server.env`
- O instalador valida o banco existente e nao cria schema novo
- O launcher principal fica em `AppGPP-Start.exe` e `scripts\Abrir-AppGPP.cmd`

### Docker

- App em `app`
- NGINX em `nginx`
- Backup em volume persistente `appgpp-backups`
- HTTPS opcional com templates e volumes extras

## 6. HTTPS

### Local

- Gere certificado autoassinado com `scripts\Gerar-Certificado-HTTPS.cmd`
- Use `NGINX_SERVER_NAME=localhost`

### Producao real

- Use Lets Encrypt
- Ajuste `NEXTAUTH_URL` para `https://app.seudominio.com`
- Ajuste `APPGPP_PUBLIC_URL` para `https://app.seudominio.com`
- Ajuste `NGINX_SERVER_NAME` e `LETSENCRYPT_CERT_NAME` para o dominio real
- Libere portas `80` e `443`

## 7. Banco e dados

- O banco MySQL deve existir antes da subida.
- O instalador apenas valida a conexao com o banco existente.
- O objetivo e preservar dados ja gravados.
- As migrations devem ser aplicadas com `npm run db:deploy`.

## 8. Validacao minima

Antes de liberar:

- Login local
- Login Google, se habilitado
- Dashboard
- Fluxos principais
- PDF ou relatorios
- Backup

## 9. Backup e operacao

- Mantenha backup diario do banco.
- Guarde uma copia fora do servidor principal.
- Valide restauracao.
- Guarde logs de instalacao e execucao.
- Atualizacoes devem ser validadas em homologacao antes de producao.

## 10. Arquivos guia

- [README principal](./README.md)
- [Comandos de subida](./COMANDOS-SUBIR-APP.md)
- [Cola de operacao](./COLA-OPERACAO.md)
- [Checklist de 1 pagina](./CHECKLIST-1-PAGINA-PRODUCAO.md)
- [Checklist final](./CHECKLIST-PRODUCAO-FINAL.md)
- [Windows com instalador](./RUNBOOK-PRODUCAO-WINDOWS.md)
- [Producao geral](./PRODUCAO.md)
- [Docker com NGINX](./DOCKER-NGINX.md)
- [Dominio real e HTTPS](./DOCKER-DOMINIO-REAL.md)
