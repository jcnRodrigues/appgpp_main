# Arquitetura do Projeto

## Objetivo
Manter a aplicação organizada por responsabilidade, com páginas e componentes focados em interface, regras de negócio concentradas em `server` e utilitários compartilhados em camadas reutilizáveis.

## Estrutura Recomendada

- `src/app`
  - Rotas do Next.js, páginas e endpoints `route.ts`.
  - Use este diretório apenas como ponto de entrada da aplicação.
- `src/features`
  - Domínios organizados por contexto de negócio.
  - Cada feature pode conter `components`, `server`, `types` e `models`, conforme necessidade.
- `src/components`
  - Componentes compartilhados entre múltiplos domínios.
  - Ideal para elementos genéricos como cabeçalho, rodapé, botões de ação e estados vazios.
- `src/hooks`
  - Hooks reutilizáveis do frontend.
- `src/lib`
  - Funções puras, permissões, formatação, notificações e helpers comuns.
- `docs`
  - Documentação do projeto e decisões de arquitetura.
- `installer`
  - Scripts e artefatos de empacotamento.
  - Não deve ser a fonte principal de manutenção do código de negócio.
- `prisma/generated`
  - Cliente Prisma gerado automaticamente.
  - Não editar manualmente.

## Convenções

- Página ou rota não deve concentrar regra de negócio complexa.
- Componente de UI não deve acessar banco diretamente.
- Regra de negócio e consultas devem ficar em `features/<dominio>/server`.
- Se um domínio crescer, prefira organizar por feature antes de criar novos diretórios genéricos.
- Reutilização horizontal vai para `src/components` e `src/lib`.
- Texto de interface deve permanecer em português e com acentuação correta.

## Sugestão de Fluxo

1. Criar ou ajustar a página em `src/app`.
2. Extrair a lógica de dados para `src/features/<dominio>/server`.
3. Extrair blocos reutilizáveis para `src/features/<dominio>/components`.
4. Promover componentes realmente genéricos para `src/components`.
5. Centralizar utilitários comuns em `src/lib`.

## Próximos Passos

- Reduzir duplicação entre relatórios, listas e tabelas.
- Extrair consultas repetidas para serviços menores por domínio.
- Revisar nomes antigos e padronizar pastas que ainda usam convenções herdadas.
- Manter a documentação sincronizada com a estrutura real do código.
