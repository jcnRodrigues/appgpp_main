# Comandos para subir o App

Este guia mostra apenas os comandos para subir o AppGPP nos cenarios ja preparados no projeto.

## 1. Preparar o ambiente

1. Copie [`.env.example`](../.env.example) para `.env`.
2. Ajuste pelo menos:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `APPGPP_PUBLIC_URL`

## 2. Rodar localmente com Node

Instale dependencias:

```bash
npm ci
```

Aplique migrations:

```bash
npm run db:deploy
```

Suba o app:

```bash
npm run start
```

Se quiser ouvir na rede local:

```bash
npm run start:lan
```

## 3. Rodar no Windows com instalador

1. Gere o instalador:

```bash
npm run installer:build
```

2. Execute o instalador gerado em `dist\`.
3. Use a pasta sugerida, por exemplo `C:\AppGPP`.
4. Depois inicie com:

```powershell
C:\AppGPP\scripts\Abrir-AppGPP.cmd
```

Se quiser abrir pelo launcher:

```powershell
C:\AppGPP\AppGPP-Start.exe
```

## 4. Rodar com Docker e NGINX

1. Copie [`.env.docker.example`](../.env.docker.example) para `.env`.
2. Ajuste:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `APPGPP_PUBLIC_URL`
   - `NGINX_SERVER_NAME`
3. Suba o ambiente:

```bash
docker compose up -d --build
```

4. Abra:

```text
http://localhost
```

## 5. Rodar com Docker e HTTPS local

1. Gere os certificados autoassinados:

```powershell
scripts\Gerar-Certificado-HTTPS.cmd
```

2. Suba com o override HTTPS:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build
```

3. Abra:

```text
https://localhost
```

## 6. Rodar com dominio real e Lets Encrypt

1. Ajuste no `.env`:
   - `NEXTAUTH_URL=https://app.seudominio.com`
   - `APPGPP_PUBLIC_URL=https://app.seudominio.com`
   - `NGINX_SERVER_NAME=app.seudominio.com`
   - `LETSENCRYPT_CERT_NAME=app.seudominio.com`
2. Emita o certificado:

```powershell
scripts\Emitir-Certificado-LetsEncrypt.cmd -Domain app.seudominio.com -Email admin@empresa.com
```

3. Ou suba o stack completo:

```bash
docker compose -f docker-compose.yml -f docker-compose.letsencrypt.yml -f docker-compose.letsencrypt-nginx.yml up -d --build
```

4. Abra:

```text
https://app.seudominio.com
```

## 7. Ordem recomendada para producao

1. Ajustar `.env`.
2. Rodar `npm run db:deploy`.
3. Rodar `npm run build`.
4. Subir com Node, instalador ou Docker.
5. Validar login, PDF e backup.
