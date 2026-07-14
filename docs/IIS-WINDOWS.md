# IIS no Windows 11

Este guia monta o AppGPP no IIS do Windows 11 como reverse proxy para o processo Node.js do Next.js.

## Visao geral

Arquitetura recomendada:

- `C:\AppGPP` -> aplicacao Node/Next
- `C:\AppGPP-IIS` -> site do IIS com apenas o `web.config`
- `localhost:3000` -> processo do AppGPP iniciado por tarefa agendada

O IIS nao executa o Next.js diretamente. Ele publica a aplicacao e encaminha as requisicoes para o backend local.

## 1. Componentes necessarios

- IIS habilitado no Windows 11.
- URL Rewrite instalada.
- Application Request Routing instalada.
- Node.js 20, 21 ou 22, ou runtime embutido da instalacao.

## 2. Habilitar o IIS no Windows 11

Voce pode habilitar o IIS de duas formas:

1. Pela interface grafica:
   - Abra `Ativar ou desativar recursos do Windows`.
   - Marque `Internet Information Services`.
   - Em `Servicos de Informacao da Internet`, habilite pelo menos:
     - `Ferramentas de Gerenciamento da Web`
     - `Console de Gerenciamento do IIS`
     - `Servicos Web`
2. Por PowerShell, executado como administrador:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer -All
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ManagementConsole -All
```

Ou use o atalho do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Enable-IIS-Windows11.ps1
```

Depois disso, instale:

- URL Rewrite
- Application Request Routing

Esses dois componentes nao vem prontos no IIS padrao do Windows 11.

### Roteiro visual

Se preferir fazer tudo pela interface:

1. Abra o menu Iniciar.
2. Digite `Ativar ou desativar recursos do Windows`.
3. Abra a janela que aparece.
4. Marque `Internet Information Services`.
5. Expanda `Servicos de Informacao da Internet`.
6. Marque, no minimo:
   - `Ferramentas de Gerenciamento da Web`
   - `Console de Gerenciamento do IIS`
   - `Servicos Web`
7. Confirme com `OK`.
8. Aguarde o Windows aplicar as alteracoes.
9. Abra `Gerenciador do IIS` pelo menu Iniciar.
10. Confirme que o servidor local aparece na arvore da esquerda.
11. Instale o `URL Rewrite`.
12. Instale o `Application Request Routing`.

## 3. Preparar a aplicacao

1. Instale o AppGPP em `C:\AppGPP`.
2. Configure o arquivo `.env`.
3. Execute:

```bash
npm run db:deploy
npm run build
```

4. Registre a tarefa de inicializacao do backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Register-AppGPP-StartupTask.ps1 -InstallDir C:\AppGPP
```

5. Inicie o backend uma vez para validar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Start-AppGPP-Server.ps1
```

## 4. Criar o site no IIS

1. Crie uma pasta separada para o IIS, por exemplo `C:\AppGPP-IIS`.
2. Copie para essa pasta o arquivo [`deploy/iis/web.config`](../deploy/iis/web.config).
3. Ajuste no `web.config` apenas a porta do backend, se voce mudar o `localhost:3000` padrao.
4. Crie um site no IIS apontando o physical path para `C:\AppGPP-IIS`.
5. Configure o binding em `80` ou `443`.
6. Use um Application Pool com:
   - `.NET CLR Version`: `No Managed Code`
   - `Managed pipeline mode`: `Integrated`
   - `Start mode`: `AlwaysRunning`, se quiser manter o backend sempre pronto

### Roteiro visual no IIS Manager

1. Abra `Gerenciador do IIS`.
2. No painel da esquerda, clique no nome do computador.
3. No painel da direita, clique em `Sites`.
4. Clique com o botao direito em `Sites`.
5. Escolha `Adicionar Site...`.
6. Preencha:
   - `Nome do site`: `AppGPP`
   - `Caminho fisico`: `C:\AppGPP-IIS`
   - `Porta`: `80` ou `443`
7. Se usar HTTPS, selecione o certificado no campo de binding.
8. Clique em `OK`.
9. Clique no site criado.
10. Em `Acoes`, escolha `Configuracoes Avancadas...`.
11. Defina `Application Pool` com `No Managed Code`.
12. Se quiser manter o backend sempre ativo, ajuste `Start Mode` para `AlwaysRunning`.
13. Em `Bindings...`, confira o host name e a porta publicados.

## 5. Arquivo web.config

O arquivo de exemplo faz proxy para `http://127.0.0.1:3000`.

A URL publica fica por conta do binding do IIS e das variaveis `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL`.

## 6. Validacao

1. Acesse a URL publica do IIS.
2. Verifique se a pagina inicial abre.
3. Verifique se login, formularios e API routes respondem.
4. Verifique redirecionamentos de autenticacao.
5. Verifique geracao de PDF e backup.

## 7. HTTPS

Para publicar em HTTPS no Windows 11:

1. Instale ou importe um certificado no `Personal` do computador local.
2. No IIS, abra o site do AppGPP.
3. Clique em `Bindings...`.
4. Adicione ou edite o binding `https` na porta `443`.
5. Selecione o certificado correto.
6. Confirme que a URL publica usada em `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` usa `https`.

### Roteiro visual do HTTPS

1. No `Gerenciador do IIS`, selecione o site `AppGPP`.
2. No painel da direita, clique em `Bindings...`.
3. Clique em `Add...`.
4. Em `Type`, escolha `https`.
5. Em `IP address`, deixe `All Unassigned` ou escolha o IP correto.
6. Em `Port`, use `443`.
7. Em `Host name`, informe o dominio real, se houver.
8. Marque `Require Server Name Indication` se houver mais de um site HTTPS no mesmo servidor.
9. Escolha o certificado no campo `SSL certificate`.
10. Clique em `OK` e depois em `Close`.

Se voce estiver usando nome de dominio, ajuste o `Host name` no binding para o dominio real.

## 8. Operacao

- Use `scripts\Stop-AppGPP-Server.ps1` para parar o backend.
- Use `scripts\Update-AppGPP.ps1` para atualizar a instalacao.
- Mantenha o IIS apenas como frente HTTP/HTTPS.

## 9. Observacoes

- O IIS precisa dos modulos URL Rewrite e ARR para o proxy funcionar.
- O backend Node precisa rodar fora do IIS.
- Se a aplicacao nao abrir, valide primeiro o processo em `localhost:3000` antes de revisar o IIS.
- Depois de ativar o IIS, confirme se `http://localhost` abre a pagina padrao do IIS antes de publicar o site do AppGPP.
- Se a URL publica mudar, atualize `NEXTAUTH_URL`, `APPGPP_PUBLIC_URL` e o binding do IIS no mesmo momento.
