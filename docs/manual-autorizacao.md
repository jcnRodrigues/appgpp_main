# Manual de Autorizacao do Sistema

## 1) Modelo de permissao
- Perfil administrativo: `ROLE_ADMIN`.
- Permissoes de acao:
- `PERM_CREATE`
- `PERM_UPDATE`
- `PERM_DELETE`
- `PERM_PRINT`
- Permissoes de modulo:
- `DASHBOARD`, `FUNCIONARIOS`, `PATRIMONIO`, `CENTRO_CUSTO`, `MEDICAO_CCUSTO`, `FUNCOES`, `LICENCAS_SOFTWARE`, `ALOCACOES`, `ACESSO_USUARIOS`, `IMPORTACAO_EXPORTACAO`, `UNIFI_CONFIG`.

## 2) Regras de negocio
- `ROLE_ADMIN` concede acesso total (modulos e acoes).
- Usuarios sem `ROLE_ADMIN` dependem de modulo + acao conforme o caso.
- Backend sempre valida permissao (fonte de verdade).
- Frontend aplica bloqueio visual para reduzir erro operacional.

## 3) Mapa rapido: Tela x Modulo x Acoes
- Dashboard (`/`): `DASHBOARD`.
- Funcionarios (`/funcionariosadd`): `FUNCIONARIOS`; botao novo com `PERM_CREATE`.
- Patrimonio (`/patrimoniolist`): `PATRIMONIO`; novo com `PERM_CREATE`; lista PDF com `PERM_PRINT`.
- Inventario de patrimonio (`/patrimoniolist/inventario`): `PATRIMONIO` sem acao extra dedicada.
- Lista PDF patrimonio (`/patrimoniolist/lista-pdf`): `PATRIMONIO` + `PERM_PRINT`.
- Centros de custo (`/ccustos`): `CENTRO_CUSTO`; novo com `PERM_CREATE`.
- Medicao (`/ccusto/medicao`): `MEDICAO_CCUSTO`.
- Funcoes (`/funcoes`): `FUNCOES`; novo com `PERM_CREATE`.
- Licencas (`/licencas`): `LICENCAS_SOFTWARE`; novo com `PERM_CREATE`.
- Alocacoes (`/alocacoes`): `ALOCACOES`; nova com `PERM_CREATE`.
- Acesso de usuarios (`/acesso-usuarios`): `ACESSO_USUARIOS`; novo com `PERM_CREATE`.
- Unifi config (`/unifi-config`): `UNIFI_CONFIG`.
- Agente de Inventario (`/monitor-patrimonios/agente`): `UNIFI_CONFIG`.
- Sistema de dados (`/sistema-dados`): `IMPORTACAO_EXPORTACAO` (ou `ACESSO_USUARIOS`, regra de governanca atual).

## 3.1) Agente de inventario: modos de consulta
- `Hibrido`: consulta rede/VPN e inventario do host ao mesmo tempo.
- `Rede/VPN`: consulta somente a infraestrutura interna.
- `Internet`: consulta somente o inventario recebido pelo agente.
- O token do agente é validado por `HOST_INVENTORY_AGENT_TOKEN`.
- O script de instalacao e gerado pela tela do agente e pode sair com o token embutido.
- A instalacao como servico Windows usa `NSSM` e cria o servico `AppGPP Host Inventory Agent`.
- Sem `NSSM`, a instalacao continua disponivel como tarefa agendada para compatibilidade.
- A remocao do servico fica disponivel pelo parametro `-UninstallService`.

## 4) Mapa rapido: Endpoint x Modulo x Acoes
- Patrimonio: CRUD + transferencias protegidos por `PATRIMONIO` e `PERM_CREATE/UPDATE/DELETE`.
- Inventario de patrimonio: tela operacional protegida por `PATRIMONIO`.
- Funcionarios: CRUD protegido por `FUNCIONARIOS` e `PERM_CREATE/UPDATE/DELETE`.
- Centro de custo: CRUD protegido por `CENTRO_CUSTO` e `PERM_CREATE/UPDATE/DELETE`.
- Funcoes: CRUD protegido por `FUNCOES` e `PERM_CREATE/UPDATE/DELETE`.
- Licencas: CRUD protegido por `LICENCAS_SOFTWARE` e `PERM_CREATE/UPDATE/DELETE`.
- Alocacoes: CRUD/transferencia/termo PDF protegidos por `ALOCACOES` e `PERM_CREATE/UPDATE/DELETE/PRINT`.
- Medicao/BM: protegido por `MEDICAO_CCUSTO` e `PERM_CREATE/UPDATE`.
- Usuarios de acesso: protegido por `ACESSO_USUARIOS` e `PERM_CREATE/UPDATE/DELETE`.
- Unifi/monitor/proxy: protegido por `UNIFI_CONFIG` (+ acoes em config).
- Agente de inventario: protegido por `UNIFI_CONFIG`, com cruzamento complementar da base de ativos e seletor de modo de consulta.
- Sistema dados import/export: protegido por `IMPORTACAO_EXPORTACAO`.

## 5) Arquivos de referencia
- Matriz de endpoints: `docs/permissoes-matriz-endpoints.md`
- Matriz de telas: `docs/permissoes-matriz-telas.md`

## 6) Pontos de implementacao
- Helpers centrais:
- `src/lib/permissions.ts`
- `src/lib/access.ts`
- Header/menu por modulo:
- `src/components/Header/Header.tsx`
- Guard de exclusao por acao:
- `src/components/DeleteGuardButton/DeleteGuardButton.tsx`

## 7) Observacoes operacionais
- Se um usuario nao visualizar menu, ainda assim o backend valida para evitar bypass.
- Em migracoes de perfil, atualizar `formulariosUser` para incluir modulo e acoes necessarias.
- Para novos modulos, sempre implementar: helper + API guard + guard de pagina + ajuste de matriz.
