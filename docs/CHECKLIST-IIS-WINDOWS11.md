# Checklist IIS Windows 11

Use esta pagina como roteiro de execucao rapido para publicar o AppGPP no IIS do Windows 11.

## Antes de começar

- [ ] Copiei o projeto para uma pasta local, por exemplo `C:\AppGPP`.
- [ ] Tenho acesso de administrador no Windows 11.
- [ ] O MySQL esta acessivel.
- [ ] Tenho o dominio ou a URL publica definida.
- [ ] O `.env` foi criado a partir de [`.env.example`](../.env.example).

## 1. Habilitar IIS

- [ ] Executei [`scripts/Enable-IIS-Windows11.ps1`](../scripts/Enable-IIS-Windows11.ps1) como administrador.
- [ ] Confirmei que o IIS abriu no `Gerenciador do IIS`.
- [ ] Instalei URL Rewrite.
- [ ] Instalei Application Request Routing.
- [ ] `http://localhost` abre a pagina padrao do IIS.

## 2. Preparar o AppGPP

- [ ] O AppGPP esta instalado em `C:\AppGPP`.
- [ ] Configurei `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` e `APPGPP_PUBLIC_URL`.
- [ ] Rodei `npm run db:deploy`.
- [ ] Rodei `npm run build`.
- [ ] Registrei a tarefa de inicializacao com [`scripts/Register-AppGPP-StartupTask.ps1`](../scripts/Register-AppGPP-StartupTask.ps1).
- [ ] Iniciei o backend com [`scripts/Start-AppGPP-Server.ps1`](../scripts/Start-AppGPP-Server.ps1).
- [ ] `localhost:3000` abre antes de colocar o IIS na frente.

## 3. Publicar no IIS

- [ ] Criei `C:\AppGPP-IIS`.
- [ ] Copiei [`deploy/iis/web.config`](../deploy/iis/web.config) para `C:\AppGPP-IIS`.
- [ ] Criei o site `AppGPP` no IIS.
- [ ] Apontei o physical path para `C:\AppGPP-IIS`.
- [ ] Configurei o binding em `80` ou `443`.
- [ ] O Application Pool esta como `No Managed Code`.
- [ ] O pipeline mode esta como `Integrated`.
- [ ] `Start Mode` esta como `AlwaysRunning`, se necessario.

## 4. HTTPS

- [ ] Importei ou instalei o certificado no computador local.
- [ ] Criei o binding `https` na porta `443`.
- [ ] Selecionei o certificado correto.
- [ ] A URL publica final usa `https`.

## 5. Validacao final

- [ ] A pagina inicial abriu pela URL do IIS.
- [ ] Login local funcionou.
- [ ] Login Google funcionou, se habilitado.
- [ ] Uma tela protegida por permissao abriu.
- [ ] PDF/relatorios funcionaram.
- [ ] Backup foi gerado e baixado.
- [ ] O host publico bate com `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL`.

## 6. Operacao diaria

- [ ] O backend sobe com a tarefa agendada.
- [ ] O backup esta agendado.
- [ ] O suporte sabe usar [`docs/OPERACAO-SUPORTE.md`](./OPERACAO-SUPORTE.md).
- [ ] O processo de update usa [`scripts/Update-AppGPP.ps1`](../scripts/Update-AppGPP.ps1).

## Ordem minima de execucao

1. Habilitar IIS.
2. Instalar URL Rewrite e ARR.
3. Rodar `db:deploy`.
4. Rodar `build`.
5. Subir backend.
6. Criar site no IIS.
7. Configurar HTTPS.
8. Validar login, PDF e backup.
