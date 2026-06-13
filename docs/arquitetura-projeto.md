# Arquitetura do Projeto

## Objetivo
Separar claramente o que é interface, o que é regra de negócio e o que é compartilhado para manter o projeto mais fácil de entender, testar e evoluir.

## Estrutura Atual

- `src/app`
  - Rotas do Next.js, páginas e endpoints `route.ts`.
  - Aqui ficam as entradas da aplicação.
- `src/features`
  - Domínios por contexto de negócio.
  - Cada feature pode ter `components`, `server` e, quando necessário, `types` ou `models`.
- Domínios já consolidados: `ativos-rede`, `patrimonio`, `centro-custo`, `funcionario`, `alocacoes`, `licenca`, `funcao`, `dashboard`, `acesso-usuarios`, `autorizacao-delete`, `monitor-patrimonios`, `unifi-config`.
- `src/components`
  - Componentes realmente compartilhados entre domínios.
- `src/hooks`
  - Hooks reutilizáveis pelo frontend.
- `src/lib`
  - Utilitários compartilhados, autenticação, permissões e helpers puros.
- `installer/_stage` e `installer/_payload_stage`
  - Artefatos gerados pelos scripts de empacotamento.
  - Servem para distribuir a aplicação, mas não são a fonte principal de manutenção do código.
  - Sempre que possível, altere o código em `src/` e regenere esses diretórios a partir dos scripts do `installer/`.
- `prisma/generated`
  - Cliente Prisma gerado automaticamente.
  - Não deve ser editado manualmente; ele é recriado pelo `prisma generate`.

## Convenções

- Páginas e rotas não devem conter regra de negócio pesada.
- Componentes de UI não devem falar direto com o banco.
- Serviços devem concentrar acesso a dados e regras de domínio.
- Se um conjunto de componentes crescer em torno de um domínio, mova para `src/features/<dominio>`.
- Utilitários compartilhados devem ficar em `src/lib`.

## Próximos Passos

- Quebrar serviços muito grandes em módulos menores por domínio.
- Criar camadas de `repository` para consultas complexas quando fizer sentido.
- Reduzir duplicação entre relatórios, listas e tabelas.
- Corrigir warnings de lint prioritários.
- Regenerar e revisar os artefatos do `installer/` quando houver mudanças estruturais em `src/`.
