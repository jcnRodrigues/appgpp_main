# Preparacao para Producao

Este guia descreve o fluxo recomendado para subir o AppGPP em producao com Node.js, Prisma e MySQL.

## 1. Pre-requisitos

- Node.js 20, 21 ou 22.
- MySQL acessivel pelo servidor da aplicacao.
- Acesso de rede ao banco e aos servicos externos usados pelo sistema.
- Uma URL publica definida para a aplicacao.
- Credenciais do Google OAuth, se o login Google for usado.

## 2. Configurar variaveis de ambiente

Crie o arquivo `.env` a partir de [`.env.example`](../.env.example) e revise pelo menos:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APPGPP_PUBLIC_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UNIFI_SECRET_KEY`

Variaveis opcionais, mas comuns em producao:

- `UNIFI_API_KEY`
- `HOST_INVENTORY_AGENT_TOKEN`
- `HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN`
- `PUPPETEER_EXECUTABLE_PATH`
- `CHROME_PATH`
- `GOOGLE_CHROME_BIN`

Observacoes:

- `APPGPP_PUBLIC_URL` deve apontar para a URL externa real da aplicacao.
- `NEXTAUTH_URL` precisa bater com a URL publica usada no acesso.
- `NEXTAUTH_SECRET` deve ser fixo, forte e nao pode mudar entre reinicios.
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` servem como bootstrap do primeiro usuario local.
- `UNIFI_SECRET_KEY` precisa ter uma chave consistente para conseguir ler os segredos salvos.

## 3. Preparar o banco

1. Garanta que o banco MySQL ja existe.
2. Confirme que a string de conexao em `DATABASE_URL` aponta para o banco correto.
3. Aplique as migrations no ambiente de producao.

Use o script do projeto:

```bash
npm run db:deploy
```

Se preferir o comando direto:

```bash
npx prisma migrate deploy
```

## 4. Gerar e validar o build

1. Instale as dependencias no servidor ou na maquina de empacotamento.
2. Gere o build de producao.

```bash
npm ci
npm run build
```

O comando `build` ja executa `prisma generate` antes do build do Next.js.
Em Windows, prefira rodar o build em uma pasta local do disco. Caminhos UNC em rede podem falhar durante a geracao do client Prisma.

## 5. Subir a aplicacao

Para um deploy Node.js padrao:

```bash
npm run start
```

Para escutar na rede local:

```bash
npm run start:lan
```

Se estiver usando o empacotamento Windows do projeto, consulte os scripts da pasta [installer](../installer/).

## 6. Validacoes pos-deploy

Execute estes testes antes de liberar para os usuarios:

1. Login local com `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
2. Login com Google, se habilitado.
3. Acesso ao dashboard inicial.
4. Consulta e cadastro nas principais telas do dominio usado pela operacao.
5. Geração de PDF/relatorios, se a funcionalidade for usada.
6. Fluxo de UniFi ou monitoramento, se estiver em uso.
7. Execucao de backup.

## 7. Backup e operacao

O projeto ja possui suporte a backups em `backups/` e um gerador de SQL em:

```bash
npm run backup:sql
```

Recomendacoes:

- Agendar backup diario do banco.
- Guardar pelo menos uma copia fora do servidor principal.
- Testar restauracao antes de depender do backup em producao.
- Para suporte diario e atualizacoes, consulte [`docs/OPERACAO-SUPORTE.md`](./OPERACAO-SUPORTE.md).

## 8. Checklist final de liberacao

- [ ] `.env` preenchido sem segredos vazios.
- [ ] `DATABASE_URL` testado contra o banco correto.
- [ ] `npm run db:deploy` executado com sucesso.
- [ ] `npm run build` executado com sucesso.
- [ ] `npm run start` validado em ambiente de teste.
- [ ] Login local validado.
- [ ] Login Google validado, se aplicavel.
- [ ] PDF/relatorios validados, se aplicavel.
- [ ] Backup validado.
- [ ] URL publica confirmada em `APPGPP_PUBLIC_URL`.

## 9. Observacoes de operacao

- O app usa Prisma + MySQL, entao mudancas de schema devem virar migration.
- O instalador nao cria banco novo: ele valida a conexao com o banco existente e preserva os dados ja gravados.
- Evite alterar `NEXTAUTH_SECRET` depois que o ambiente estiver em uso.
- Se o navegador nao estiver disponivel no servidor, configure `PUPPETEER_EXECUTABLE_PATH` ou `CHROME_PATH`.
- Se o ambiente for Windows com instalador, os scripts em `installer/` e `AppGPP-Start.ps1` cobrem o fluxo empacotado.
- Se o projeto estiver em um compartilhamento de rede Windows, copie para um disco local antes do build e da geracao do instalador.

## 10. Checklist final resumido

Veja o checklist completo em [`docs/CHECKLIST-PRODUCAO-FINAL.md`](./CHECKLIST-PRODUCAO-FINAL.md).
