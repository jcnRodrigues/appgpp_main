# Runbook de Producao Windows

Este runbook descreve o fluxo recomendado para operar o AppGPP em Windows usando o launcher `AppGPP-Start.exe` e o instalador do projeto.

## Escopo

Use este fluxo quando a aplicacao for executada em um servidor Windows, com banco MySQL externo ou local, e quando a distribuicao for feita pelo instalador gerado pelo proprio projeto.

## 1. Premissas

- O projeto deve ficar em uma pasta local do disco, por exemplo `C:\AppGPP`.
- Evite executar build ou gerar instalador diretamente em caminho UNC de rede.
- O servidor precisa ter acesso ao MySQL.
- O servidor precisa de Node.js 20, 21 ou 22, ou do runtime embutido gerado pelo instalador.

## 2. Preparacao inicial

1. Copie o projeto para uma pasta local.
2. Instale as dependencias.
3. Crie o arquivo `.env` a partir de [`.env.example`](../.env.example).
4. Revise as variaveis:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `APPGPP_PUBLIC_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `UNIFI_SECRET_KEY`

## 3. Preparar banco

Execute as migrations no ambiente alvo:

```bash
npm run db:deploy
```

Se o banco ainda nao existir, crie-o antes.
O usuario do MySQL precisa ter permissao para conectar a partir do host onde o AppGPP sera instalado. Se o erro for `Host 'NOME-DO-PC' is not allowed to connect`, ajuste os grants no servidor MySQL.

## 4. Build da aplicacao

```bash
npm ci
npm run build
```

Se houver erro de Prisma ou rename do client em rede, mova o projeto para disco local antes de repetir.

## 5. Gerar instalador

Se a distribuicao for feita pelo instalador do projeto:

```bash
npm run installer:build
```

Saidas esperadas:

- `dist/AppGPP-Installer-<packageVersion>-<datahora>.exe`
- `dist/Instalador APPGPP.zip`
- `dist/AppGPP-Payload.zip`

## 6. Instalar no servidor

1. Execute o instalador gerado.
2. Preencha:
   - Pasta de instalacao: `C:\AppGPP`
   - Host/IP do servidor AppGPP
   - Porta do AppGPP
   - Host/IP do MySQL
   - Porta do MySQL
   - Usuario MySQL
   - Senha MySQL
   - Banco MySQL
3. Finalize a instalacao.
4. Cadastre a empresa quando o instalador solicitar.

O instalador apenas valida a conexao com o banco existente. Ele nao cria schema novo e nao apaga dados.

## 7. Iniciar a aplicacao

O projeto disponibiliza dois caminhos:

- `AppGPP-Start.exe`
- `scripts\Abrir-AppGPP.cmd`

Esses atalhos leem `appgpp-server.env` quando existe.

Exemplo de `appgpp-server.env`:

```env
APPGPP_PUBLIC_HOST=app.seudominio.com
APPGPP_PORT=3000
APPGPP_BIND_HOST=0.0.0.0
```

## 8. Validacao apos inicio

1. Acesse a URL publica.
2. Confirme login local.
3. Confirme login Google, se habilitado.
4. Abra dashboard e uma tela protegida por permissao.
5. Teste um fluxo que gere PDF, se aplicavel.
6. Teste o backup.
7. Se usar UniFi, valide a comunicacao com a configuracao salva.

## 9. Operacao diaria

- Mantenha backup agendado do banco.
- Guarde logs de instalacao e execucao.
- Ao atualizar, use o modo correto:
  - `AppGPP-Update-Menu-<versao>.exe` para escolher o modo na tela
  - `scripts\Update-AppGPP-System.ps1` para atualizar so a aplicacao
  - `scripts\Update-AppGPP-Database.ps1` para aplicar so migrations
  - `scripts\Update-AppGPP-Both.ps1` para aplicar os dois juntos
- Refaca build, instalador e validacao em ambiente de homologacao antes de subir em producao.

## 10. Recuperacao

Se a aplicacao nao subir:

1. Verifique se `npm run start` sobe manualmente na pasta local.
2. Confirme `DATABASE_URL`.
3. Confirme `NEXTAUTH_SECRET` e `NEXTAUTH_URL`.
4. Confirme se o banco MySQL esta acessivel.
5. Verifique se o Chrome/Edge esta disponivel quando houver geracao de PDF.

## 11. Observacao sobre IIS e Service

O repositorio possui um guia especifico para IIS em [`docs/IIS-WINDOWS.md`](./IIS-WINDOWS.md).
Se a equipe quiser esse modelo, o recomendado e manter o backend Node fora do IIS e usar o IIS apenas como reverse proxy.
No IIS, use uma pasta separada como `C:\AppGPP-IIS`.
