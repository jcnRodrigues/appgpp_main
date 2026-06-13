# Matriz de Permissoes (Telas)

## Convenções
- Modulo: permissao base para abrir a tela.
- Acoes de UI: botoes/acoes visiveis conforme `PERM_*`.
- Admin (`ROLE_ADMIN`) herda tudo automaticamente.

## Dashboard
- `src/app/page.tsx`
- Modulo: `DASHBOARD`
- Acoes de UI: sem acao transacional.
- Status: protegido com redirect para `/acesso-negado`.

## Funcionarios
- `src/app/funcionariosadd/page.tsx`
- Modulo: `FUNCIONARIOS`
- Acoes de UI:
- `CREATE`: exibe botao `Novo Funcionario`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/funcionario/cadastro/page.tsx`
- Modulo: `FUNCIONARIOS`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/funcionario/[id]/page.tsx`
- Modulo: `FUNCIONARIOS`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

## Patrimonio
- `src/app/patrimoniolist/page.tsx`
- Modulo: `PATRIMONIO`
- Acoes de UI:
- `CREATE`: exibe botao `Novo Patrimonio`.
- `PRINT`: exibe acesso `Lista PDF`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/patrimonio/cadastro/page.tsx`
- Modulo: `PATRIMONIO`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/patrimonio/[id]/page.tsx`
- Modulo: `PATRIMONIO`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

## Lista PDF de Patrimonios
- `src/app/patrimoniolist/lista-pdf/page.tsx`
- Modulo: `PATRIMONIO`
- Acoes de UI:
- `PRINT`: permite abrir e gerar PDF.
- Status: protegido (mensagem de permissao quando nao possui acesso).

## Centros de Custo
- `src/app/ccustos/page.tsx`
- Modulo: `CENTRO_CUSTO`
- Acoes de UI:
- `CREATE`: exibe botao `Novo Centro`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/ccusto/cadastro/page.tsx`
- Modulo: `CENTRO_CUSTO`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/ccusto/[id]/page.tsx`
- Modulo: `CENTRO_CUSTO`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

## Medicao por Centro de Custo
- `src/app/ccusto/medicao/page.tsx`
- Modulo: `MEDICAO_CCUSTO`
- Acoes de UI:
- consumo de APIs de processamento/BM respeita `CREATE`/`UPDATE` no backend.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/ccusto/medicao/processo/page.tsx`
- Modulo: `MEDICAO_CCUSTO`
- Acoes de UI:
- consulta/fechamento de BM dependem de permissoes de API.
- Status: protegido com redirect para `/acesso-negado`.

## Funcoes
- `src/app/funcoes/page.tsx`
- Modulo: `FUNCOES`
- Acoes de UI:
- `CREATE`: exibe botao `Nova Funcao`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/funcao/cadastro/page.tsx`
- Modulo: `FUNCOES`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/funcao/[id]/editar/page.tsx`
- Modulo: `FUNCOES`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

## Licencas de Software
- `src/app/licencas/page.tsx`
- Modulo: `LICENCAS_SOFTWARE`
- Acoes de UI:
- `CREATE`: exibe botao `Nova Licenca`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/licenca/cadastro/page.tsx`
- Modulo: `LICENCAS_SOFTWARE`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/licenca/[id]/editar/page.tsx`
- Modulo: `LICENCAS_SOFTWARE`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

## Alocacoes
- `src/app/alocacoes/page.tsx`
- Modulo: `ALOCACOES`
- Acoes de UI:
- `CREATE`: exibe botao `Nova Alocacao`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/alocacoes/nova/page.tsx`
- Modulo: `ALOCACOES`
- Acoes de UI:
- `CREATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/alocacoes/[id]/editar/page.tsx`
- Modulo: `ALOCACOES`
- Acoes de UI:
- `UPDATE`: obrigatorio para abrir a tela.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/alocacoes/[id]/termo/page.tsx`
- Modulo: `ALOCACOES`
- Acoes de UI:
- `PRINT`: obrigatorio para abrir/imprimir o termo.
- Status: protegido com redirect para `/acesso-negado`.

## Acesso de Usuarios
- `src/app/acesso-usuarios/page.tsx`
- Modulo: `ACESSO_USUARIOS`
- Acoes de UI:
- `CREATE`: exibe botao `Novo Usuario`.
- Status: protegido com redirect para `/acesso-negado`.

- `src/app/acesso-usuarios/cadastro/page.tsx`
- Modulo: `ACESSO_USUARIOS`
- Acoes de UI:
- `CREATE` para novo cadastro, `UPDATE` para edição (`?id=`).
- Status: protegido com redirect para `/acesso-negado`.

## Unifi Config
- `src/app/unifi-config/page.tsx`
- Modulo: `UNIFI_CONFIG`
- Acoes de UI:
- operacoes de salvar/ativar/deletar validadas no backend por `CREATE/UPDATE/DELETE`.
- Status: protegido com redirect para `/acesso-negado`.

## Monitor de Rede Ubiquiti
- `src/app/monitor-patrimonios/page.tsx`
- Modulo: `UNIFI_CONFIG`
- Acoes de UI:
- consultas de monitor dependem de permissao de modulo nas APIs.
- Status: protegido com redirect para `/acesso-negado`.

## Sistema de Dados (Importacao/Exportacao)
- `src/app/sistema-dados/page.tsx`
- Modulo: `IMPORTACAO_EXPORTACAO` (ou `ACESSO_USUARIOS` por excecao de governanca)
- Acoes de UI:
- exportar/importar bloqueado por permissao de modulo (UI + API).
- Status: bloqueio client-side com mensagem de permissao.

## Observacoes
- Menu lateral/topo: filtrado por modulo em `src/components/Header/Header.tsx`.
- Exclusao em componentes: protegida por `PERM_DELETE` no `DeleteGuardButton` e confirmada no backend.
- Operacoes de API sempre prevalecem sobre UI (defesa em profundidade).
