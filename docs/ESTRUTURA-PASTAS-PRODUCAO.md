# Estrutura de Pastas de Producao

Use esta estrutura como padrao ao publicar o AppGPP no Windows 11.

## Pastas

- `C:\AppGPP`
  - Pasta principal da aplicacao.
  - Contem o codigo, dependencias, build, `.env`, `appgpp-server.env` e runtime.
- `C:\AppGPP-IIS`
  - Pasta do site do IIS.
  - Contem apenas o `web.config` e arquivos do site, se houver.

## Em `C:\AppGPP`

Arquivos e pastas esperados:

- `.env`
- `appgpp-server.env`
- `package.json`
- `node_modules\`
- `.next\`
- `prisma\`
- `public\`
- `scripts\`
- `src\`
- `backups\`
- `runtime\` quando o instalador incluir Node embutido

## O que nao deve ser usado como destino final

- Raiz do `C:\`
- Caminho UNC de rede
- Pasta `dist\` do repositório

## Regra pratica

Se voce estiver em duvida, use:

- App principal: `C:\AppGPP`
- IIS: `C:\AppGPP-IIS`

Essa combinacao deixa o backend e a camada HTTP separados e reduz erro de permissao e de path.
