# Checklist de 1 Pagina - Producao

Use esta lista como roteiro rapido para subir o AppGPP em producao.

## 1. Preparacao

- [ ] Copiei `.env.example` ou `.env.docker.example` para `.env`.
- [ ] Configurei `DATABASE_URL`.
- [ ] Configurei `NEXTAUTH_URL`.
- [ ] Configurei `NEXTAUTH_SECRET`.
- [ ] Configurei `APPGPP_PUBLIC_URL`.
- [ ] Configurei `NGINX_SERVER_NAME`, se usar Docker.
- [ ] Configurei `LETSENCRYPT_CERT_NAME`, se usar dominio real.
- [ ] Confirmei que o banco MySQL ja existe.
- [ ] Confirmei que o usuario do MySQL tem acesso ao host do AppGPP.
- [ ] Defini `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
- [ ] Revisei `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, se houver login Google.

## 2. Banco

- [ ] Rodei `npm run db:deploy`.
- [ ] O comando concluiu sem erro.

## 3. Build

- [ ] Rodei `npm run build`.
- [ ] O build concluiu sem erro.

## 4. Subida

Escolha um caminho:

- [ ] Node local: `npm run start`
- [ ] Node na rede: `npm run start:lan`
- [ ] Instalador Windows: `npm run installer:build` e depois `C:\AppGPP\scripts\Abrir-AppGPP.cmd`
- [ ] Docker: `docker compose up -d --build`
- [ ] Docker HTTPS local: `scripts\Gerar-Certificado-HTTPS.cmd` e `docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build`
- [ ] Docker dominio real: `scripts\Emitir-Certificado-LetsEncrypt.cmd -Domain app.seudominio.com -Email admin@empresa.com`

## 5. Validacao

- [ ] Abri a URL correta.
- [ ] Login local funcionou.
- [ ] Login Google funcionou, se aplicavel.
- [ ] Dashboard carregou.
- [ ] PDF e relatorios funcionaram, se aplicavel.
- [ ] Backup foi validado.

## 6. Operacao

- [ ] Backup diario esta configurado.
- [ ] Existe copia de backup fora do servidor principal.
- [ ] Logs de instalacao e runtime foram guardados.
- [ ] O responsavel pela operacao sabe como reiniciar e atualizar.
