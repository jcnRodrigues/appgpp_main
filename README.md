# App GPP

Projeto em Next.js.

## Rodando localmente

```bash
npm run dev
```

A aplicacao abre em `http://localhost:3000`.

## Expor local com ngrok

1. Instale as dependencias do projeto (o `ngrok` ja esta no `devDependencies`):

```bash
npm install
```

2. Se quiser salvar o token no ngrok uma vez so:

```bash
npx ngrok config add-authtoken <SEU_TOKEN>
```

3. Execute o tunel publico:

```bash
npm run dev:public
```

Se o PowerShell bloquear `npm.ps1`, use:

```powershell
npm.cmd run dev:public
```

Variaveis opcionais:

- `PORT`: porta local do Next.js (padrao `3000`)
- `NGROK_DOMAIN`: dominio reservado no ngrok (quando voce tiver um)
- `NGROK_AUTHTOKEN`: token do ngrok (o script configura automaticamente antes de abrir o tunel)
- `NGROK_TARGET_HOST`: IP/host local que o ngrok deve tunelar (padrao: IPv4 ativo detectado automaticamente)

Observacao: a cada execucao de `dev:public`, o script persiste automaticamente o IP ativo em `NGROK_TARGET_HOST` no `.env.local`.

O script carrega automaticamente variaveis de `.env.local` (prioridade) e `.env`.
Exemplo de `.env.local`:

```env
NGROK_AUTHTOKEN=SEU_TOKEN
NGROK_DOMAIN=seu-dominio.ngrok.app
PORT=3000
```

Exemplo com dominio reservado (PowerShell):

```powershell
$env:NGROK_AUTHTOKEN='SEU_TOKEN'; $env:NGROK_DOMAIN='seu-dominio.ngrok.app'; npm.cmd run dev:public
```
