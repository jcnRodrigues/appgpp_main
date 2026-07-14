# Cola de Operacao

Use estes comandos para subir e validar o AppGPP rapido.

## 1. Subir com Node

```bash
npm ci
npm run db:deploy
npm run build
npm run start
```

## 2. Subir com o instalador Windows

```powershell
npm run installer:build
C:\AppGPP\scripts\Abrir-AppGPP.cmd
```

## 3. Subir com Docker

```bash
docker compose up -d --build
```

## 4. Subir com Docker e HTTPS local

```powershell
scripts\Gerar-Certificado-HTTPS.cmd
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build
```

## 5. Subir com dominio real e Lets Encrypt

```powershell
scripts\Emitir-Certificado-LetsEncrypt.cmd -Domain app.seudominio.com -Email admin@empresa.com
docker compose -f docker-compose.yml -f docker-compose.letsencrypt.yml -f docker-compose.letsencrypt-nginx.yml up -d --build
```

## 6. Validar

```text
http://localhost
https://localhost
https://app.seudominio.com
```

Confirme sempre:

- login local
- login Google, se houver
- PDF ou relatorios
- backup
