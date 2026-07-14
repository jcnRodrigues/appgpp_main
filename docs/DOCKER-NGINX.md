# Docker com NGINX

Este guia publica o AppGPP em Docker com NGINX como reverse proxy.

## Arquitetura

- `app`: container Node.js do Next.js
- `nginx`: container frontal HTTP
- `backups`: volume persistente para a pasta `backups`
- HTTPS opcional via `docker-compose.https.yml`

## Pre-requisitos

- Docker Desktop ou Docker Engine
- Banco MySQL acessivel
- Variaveis de ambiente preenchidas em `.env`, idealmente copiadas de [`.env.docker.example`](../.env.docker.example)

## Variaveis importantes

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NGINX_SERVER_NAME`
- `APPGPP_PUBLIC_URL`
- `LETSENCRYPT_CERT_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UNIFI_SECRET_KEY`

## Subir o ambiente

1. Copie [`.env.docker.example`](../.env.docker.example) para `.env`.
2. Ajuste `DATABASE_URL`, `NEXTAUTH_URL`, `APPGPP_PUBLIC_URL` e `NGINX_SERVER_NAME`.
3. Suba os containers:

```bash
docker compose up -d --build
```

Se quiser HTTPS com NGINX, adicione os certificados em `nginx/certs/`:

- `nginx/certs/appgpp.crt`
- `nginx/certs/appgpp.key`

Nesse modo, ajuste `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` para `https://...`.
Defina `NGINX_SERVER_NAME` com o dominio real, por exemplo `app.seudominio.com`.
Para homologacao local, mantenha `NGINX_SERVER_NAME=localhost`.
Se usar Lets Encrypt, defina `LETSENCRYPT_CERT_NAME` com o nome do certificado, normalmente igual ao dominio.

Para gerar um certificado autoassinado no Windows 11, execute:

```powershell
scripts\Gerar-Certificado-HTTPS.cmd
```

Esse script usa `openssl` para converter o certificado para PEM. Se ele nao estiver no PATH, instale o Git for Windows ou o OpenSSL.

Se voce quiser sobrescrever certificados antigos:

```powershell
scripts\Gerar-Certificado-HTTPS.cmd -Force
```

Depois suba com o override:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build
```

## Validar

1. Abra `http://localhost`.
2. Confirme que a pagina inicial carrega.
3. Confirme login local.
4. Confirme login Google, se habilitado.
5. Teste PDF e backup.

## Observacoes

- O `Dockerfile` usa Node 22, que esta dentro da faixa suportada pelo projeto.
- O Puppeteer usa `chromium` instalado no container.
- O NGINX faz proxy HTTP no modo padrao.
- O HTTPS usa `nginx/default-https.conf.template` e espera certificados em `nginx/certs/`.
- Se voce quiser apontar para um dominio real, ajuste `NEXTAUTH_URL`, `APPGPP_PUBLIC_URL` e `NGINX_SERVER_NAME` no `.env`.

## Atualizacao

Para atualizar:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Backup

O volume `appgpp-backups` preserva a pasta `backups` entre recriacoes do container.

## Dominio real

Quando trocar de `localhost` para um dominio real, siga o guia em [`docs/DOCKER-DOMINIO-REAL.md`](./DOCKER-DOMINIO-REAL.md).
Para certificado publico com renovacao automatica, use [`scripts/Emitir-Certificado-LetsEncrypt.cmd`](../scripts/Emitir-Certificado-LetsEncrypt.cmd).

## Um clique no Windows 11

Use [`scripts/Abrir-AppGPP-Docker.cmd`](../scripts/Abrir-AppGPP-Docker.cmd) para subir o stack Docker e abrir o navegador.
