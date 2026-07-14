# PowerShell Scripts (Local)

Esta pasta e para scripts PowerShell locais de apoio ao desenvolvimento.

## Regras

- Arquivos aqui **nao sao versionados** (a pasta esta no `.gitignore`).
- Use para automacoes locais, testes, utilitarios temporarios e debug.
- Nao salve credenciais em texto puro.

## Convencao sugerida

- Nomeie scripts com verbo + objetivo:
  - `build-installer-local.ps1`
  - `reset-cache-local.ps1`
  - `seed-dev-local.ps1`

## Execucao

No PowerShell, a partir da raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\seu-script.ps1
```
