# Matriz de Permissoes (API)

## Modulos e acoes
- `ROLE_ADMIN`: acesso total.
- Acoes globais: `PERM_CREATE`, `PERM_UPDATE`, `PERM_DELETE`, `PERM_PRINT`.

## Endpoints protegidos
- `PATRIMONIO`
- `GET /api/patrimonio` (modulo)
- `POST /api/patrimonio` (modulo + `CREATE`)
- `GET /api/patrimonio/[id]` (modulo)
- `PUT /api/patrimonio/[id]` (modulo + `UPDATE`)
- `DELETE /api/patrimonio/[id]` (modulo + `DELETE`)
- `GET /api/patrimonio/[id]/transferencias` (modulo)
- `POST /api/patrimonio/[id]/transferencias` (modulo + `UPDATE`)
- `GET /api/patrimonio/opcoes` (modulo)

- `FUNCIONARIOS`
- `GET /api/funcionario` (modulo)
- `POST /api/funcionario` (modulo + `CREATE`)
- `GET /api/funcionario/[id]` (modulo)
- `PUT /api/funcionario/[id]` (modulo + `UPDATE`)
- `DELETE /api/funcionario/[id]` (modulo + `DELETE`)
- `GET /api/funcionario/opcoes` (modulo)

- `CENTRO_CUSTO`
- `GET /api/ccusto` (modulo)
- `POST /api/ccusto` (modulo + `CREATE`)
- `GET /api/ccusto/[id]` (modulo)
- `PUT /api/ccusto/[id]` (modulo + `UPDATE`)
- `DELETE /api/ccusto/[id]` (modulo + `DELETE`)
- `GET /api/ccusto/opcoes` (modulo)

- `FUNCOES`
- `GET /api/funcao` (modulo)
- `POST /api/funcao` (modulo + `CREATE`)
- `GET /api/funcao/[id]` (modulo)
- `PUT /api/funcao/[id]` (modulo + `UPDATE`)
- `DELETE /api/funcao/[id]` (modulo + `DELETE`)

- `LICENCAS_SOFTWARE`
- `GET /api/licenca` (modulo)
- `POST /api/licenca` (modulo + `CREATE`)
- `GET /api/licenca/[id]` (modulo)
- `PUT /api/licenca/[id]` (modulo + `UPDATE`)
- `DELETE /api/licenca/[id]` (modulo + `DELETE`)

- `ALOCACOES`
- `GET /api/cadastro` (modulo)
- `POST /api/cadastro` (modulo + `CREATE`)
- `GET /api/cadastro/[id]` (modulo)
- `PUT /api/cadastro/[id]` (modulo + `UPDATE`)
- `DELETE /api/cadastro/[id]` (modulo + `DELETE`)
- `POST /api/cadastro/[id]/transferir` (modulo + `UPDATE`)
- `POST /api/cadastro/termo-pdf` (modulo + `PRINT`)

- `MEDICAO_CCUSTO`
- `POST /api/ccusto/medicao` (modulo + `CREATE`)
- `GET /api/ccusto/medicao/bm` (modulo)
- `POST /api/ccusto/medicao/bm` (modulo + `CREATE`)
- `PUT /api/ccusto/medicao/bm` (modulo + `UPDATE`)

- `ACESSO_USUARIOS`
- `GET /api/usuarios-acesso` (modulo)
- `POST /api/usuarios-acesso` (modulo + `CREATE`)
- `PUT /api/usuarios-acesso` (modulo + `UPDATE`)
- `DELETE /api/usuarios-acesso` (modulo + `DELETE`)

- `UNIFI_CONFIG`
- `GET /api/unifi-config` (modulo)
- `POST /api/unifi-config` (modulo + `CREATE`)
- `PATCH /api/unifi-config` (modulo + `UPDATE`)
- `DELETE /api/unifi-config` (modulo + `DELETE`)
- `POST /api/unifi-proxy` (modulo)
- `POST /api/monitor-patrimonios/consoles` (modulo)
- `POST /api/monitor-patrimonios/devices` (modulo)
- `POST /api/monitor-patrimonios/clients` (modulo)
- `POST /api/monitor-patrimonios/sites` (modulo)
- `POST /api/monitor-patrimonios/overview` (modulo)

- `DASHBOARD`
- `GET /api/dashboard` (modulo)
- `GET /api/dashboard/alocacoes-centro` (modulo)
- `GET /api/dashboard/alocacoes-tempo` (modulo)

- `IMPORTACAO_EXPORTACAO`
- `GET /api/sistema-dados` (modulo)
- `POST /api/sistema-dados` (modulo)

## Endpoints especiais
- `POST /api/delete-authorize`: requer usuario autenticado com `PERM_DELETE` para iniciar fluxo, e credencial local com `DELETE_ANY` para autorizar exclusao elevada.

## Front-end hardening
- Header filtra menu com `hasModuleAccess`.
- Paginas principais redirecionam para `/acesso-negado` quando o usuario nao possui modulo.
- Botoes de criacao/impressao escondidos sem `PERM_CREATE`/`PERM_PRINT`.
