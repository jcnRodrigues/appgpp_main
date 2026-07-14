# Operacao e Suporte

Este manual resume as rotinas basicas para operar o AppGPP em producao.

## 1. Abrir o sistema

No ambiente Windows do projeto, a abertura normal pode ser feita por:

- `AppGPP-Start.exe`
- `scripts\Abrir-AppGPP.cmd`

Se o ambiente usa o launcher do instalador, o `appgpp-server.env` define host e porta:

```env
APPGPP_PUBLIC_HOST=app.seudominio.com
APPGPP_PORT=3000
APPGPP_BIND_HOST=0.0.0.0
```

## 2. Verificacoes rapidas

Quando um usuario reportar problema:

1. Confirme se a aplicacao responde na URL publica.
2. Confirme se o MySQL esta acessivel.
3. Confirme se o login local funciona com a conta admin.
4. Confirme se o Google OAuth, quando usado, esta com credenciais validas.
5. Confirme se o usuario tem permissao para a tela afetada.
6. Confirme se o Chrome/Edge esta disponivel para gerar PDF.

## 3. Backup

O sistema gera backups na pasta `backups/`.

Fluxo recomendado:

1. Acesse a tela de backup no sistema.
2. Gere um novo backup.
3. Baixe o `backup-completo.sql` ou o pacote JSON, conforme necessidade.
4. Guarde pelo menos uma copia fora do servidor principal.

O endpoint de exportacao gera:

- `backup-completo.json`
- `backup-completo.sql`
- `resumo.json`
- arquivos por tabela em `backups/<nome>/tables/`

Para gerar SQL a partir do ultimo backup salvo, use:

```bash
npm run backup:sql
```

## 4. Restauracao

O repositorio nao traz uma rotina automatica de restore do banco.
O processo padrao e:

1. Restaurar o banco MySQL a partir do `.sql` salvo.
2. Conferir se a estrutura bate com a versao atual da aplicacao.
3. Aplicar migrations pendentes com `npm run db:deploy`, se necessario.
4. Validar login e telas principais.

## 5. Atualizacao

Para atualizar uma instalacao Windows existente:

1. Prepare a nova versao em uma pasta de origem separada.
2. Execute o atualizador com menu:

```powershell
dist\AppGPP-Update-Menu-<versao>.exe
```

O menu permite escolher:

- `Atualizar só sistema`
- `Atualizar só banco`
- `Atualizar ambos`

O motor por baixo:

- para o AppGPP
- cria backup da instalacao atual em `C:\AppGPP\_backups\<data>`
- copia a nova versao
- reinicia a aplicacao
- faz rollback se a validacao falhar

Para gerar os tres pacotes Windows em `dist/`:

```bash
npm run update:build
```

Arquivos principais gerados:

- `AppGPP-Update-Menu-<versao>.exe`
- `AppGPP-Update-System-<versao>.exe`
- `AppGPP-Update-Database-<versao>.exe`
- `AppGPP-Update-Both-<versao>.exe`

## 6. Checklist diario de suporte

- [ ] Aplicacao abre sem erro.
- [ ] Login local funciona.
- [ ] Login Google funciona, se ativo.
- [ ] Banco responde.
- [ ] Backup foi gerado no dia.
- [ ] PDF/relatorios funcionam.
- [ ] Servidor tem espaco em disco.
- [ ] Logs de instalacao e atualizacao estao arquivados.

## 7. Problemas comuns

- Se o build falhar em rede, mover o projeto para disco local.
- Se o PDF falhar, conferir `PUPPETEER_EXECUTABLE_PATH`, `CHROME_PATH` ou `GOOGLE_CHROME_BIN`.
- Se o login falhar, conferir `NEXTAUTH_SECRET`, `NEXTAUTH_URL` e permissao do usuario.
- Se o backup nao abrir, conferir permissao do usuario e existencia da pasta `backups/`.
- Se o instalador nao iniciar, conferir se o payload e o EXE estao juntos na mesma pasta.
