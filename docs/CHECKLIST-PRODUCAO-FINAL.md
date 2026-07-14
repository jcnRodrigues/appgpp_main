# Checklist Final de Producao

Use este checklist antes de liberar o AppGPP para usuarios finais.

## Antes do deploy

- [ ] `.env` revisado e sem segredos vazios.
- [ ] `DATABASE_URL` aponta para o banco correto.
- [ ] `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` batem com a URL publica.
- [ ] `NEXTAUTH_SECRET` foi definido e nao mudou entre reinicios.
- [ ] `ADMIN_EMAIL` e `ADMIN_PASSWORD` foram definidos.
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` foram validados, se houver login Google.
- [ ] `UNIFI_SECRET_KEY` foi definido, se houver UniFi.
- [ ] O banco MySQL ja existe e o usuario tem permissao de conexao a partir do servidor.

## Deploy

- [ ] `npm run db:deploy` executado com sucesso.
- [ ] `npm run build` executado com sucesso.
- [ ] Aplicacao iniciada com `npm run start` ou pelo instalador do Windows.
- [ ] Em Docker, `docker compose up -d --build` executado com sucesso.
- [ ] Em Docker com HTTPS, certificados copiados para `nginx/certs/`.

## Validacao funcional

- [ ] Login local testado.
- [ ] Login Google testado, se aplicavel.
- [ ] Dashboard acessivel.
- [ ] Telas principais do negocio testadas.
- [ ] PDF e relatorios testados, se aplicavel.
- [ ] Fluxos de integracao testados, se aplicavel.

## Backup e recuperacao

- [ ] Backup do banco configurado.
- [ ] Pasta `backups/` verificada.
- [ ] Restauracao de teste validada.
- [ ] Copia de backup fora do servidor principal.
- [ ] Procedimento de rollback documentado.

## Operacao

- [ ] Logs de instalacao e de runtime revisados.
- [ ] Atualizacao do instalador ou da imagem Docker documentada.
- [ ] Responsavel pela operacao informado sobre o fluxo de suporte.
