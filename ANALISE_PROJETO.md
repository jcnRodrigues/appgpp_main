# Análise do Projeto AppGPP

## 1. Visão Geral

**AppGPP** (Aplicativo de Gestão de Patrimônio e Pessoal) é um sistema web desenvolvido em Next.js para gerenciamento de patrimônios, funcionários, centros de custo e alocações.

## 2. Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16.1.6 |
| Linguagem | TypeScript |
| Banco de Dados | SQLite (via Prisma) |
| ORM | Prisma 6.12.0 |
| Autenticação | NextAuth.js 4.24.13 |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Ícones | Lucide React |
| Gráficos | Recharts 3.7.0 |
| Datas | date-fns, react-day-picker |
| PDF | pdf-lib, puppeteer |

## 3. Estrutura do Banco de Dados

### Modelos Principais:

```
tbUser              → Usuários do sistema
tbFuncionario      → Funcionários
tbStatusFun        → Status de funcionários
tbFuncao           → Funções/Cargos
tbPatrimonio       → Patrimônios/Ativos
tbTipoPat          → Tipos de patrimônio
tbStatusPat        → Status de patrimônio
tbEmpresa          → Empresas
tbCCusto           → Centros de Custo
tbCadastro         → Cadastro/Alocações
```

### Modelos de Autenticação:
```
Account            → Contas OAuth
Session            → Sessões ativas
User               → Usuários NextAuth
VerificationToken → Tokens de verificação
```

## 4. Estrutura de Pastas

```
src/
├── app/                    # Páginas e API Routes do Next.js
│   ├── page.tsx           # Dashboard principal
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth
│   │   ├── patrimonio/  # API de patrimônios
│   │   ├── funcionario/ # API de funcionários
│   │   ├── ccusto/      # API de centros de custo
│   │   ├── funcao/      # API de funções
│   │   ├── cadastro/    # API de cadastros
│   │   └── dashboard/   # API do dashboard
│   ├── patrimonio/      # Páginas de patrimônio
│   ├── funcionario/    # Páginas de funcionários
│   ├── ccusto/         # Páginas de centros de custo
│   ├── funcao/         # Páginas de funções
│   ├── alocacoes/      # Páginas de alocações
│   └── appointments/   # Páginas de agendamentos
│
├── back-end/
│   ├── components/      # Componentes React
│   │   ├── Dashboard/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── PatrimonioForm/
│   │   ├── PatrimonioTable/
│   │   ├── FuncionarioForm/
│   │   ├── FuncionarioTable/
│   │   └── ...outros componentes
│   ├── services/        # Lógica de negócio
│   │   ├── Patrimonio.services/
│   │   ├── Funcionario.service/
│   │   ├── Dashboard.service/
│   │   └── ...outros serviços
│   ├── model/          # Modelos de dados
│   └── repository/     # Repositórios
│
└── lib/                 # Utilitários
```

## 5. Funcionalidades Implementadas

### Dashboard
- Visualização de dados com gráficos (Recharts)
- Alocações por centro de custo
- Alocações ao longo do tempo

### Gestão de Patrimônios
- Listagem com filtros
- Cadastro de novos patrimônios
- Edição de patrimônios existentes
- Exclusão com confirmação
- Campos: ID, descrição, tipo, status, valor, nota fiscal, licenças, datas

### Gestão de Funcionários
- Cadastro e listagem de funcionários
- Associação com funções e centros de custo
- Controle de status (ativo/inativo)

### Gestão de Centros de Custo
- CRUD de centros de custo
- Associação com empresas

### Gestão de Funções
- CRUD de funções/cargos

### Alocações
- Registro de alocações de patrimônios a funcionários
- Controle de datas de alocação e devolução

## 6. Rotas da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET/POST | /api/patrimonio | Lista/Cria patrimônios |
| GET/PUT/DELETE | /api/patrimonio/[id] | Detalhe/Edita/Deleta |
| GET | /api/patrimonio/opcoes | Opções para dropdowns |
| GET/POST | /api/funcionario | Lista/Cria funcionários |
| GET/POST | /api/ccusto | Lista/Cria centros de custo |
| GET/POST | /api/funcao | Lista/Cria funções |
| GET/POST | /api/cadastro | Lista/Cria alocações |
| GET | /api/dashboard | Dados do dashboard |

## 7. Páginas Principais

| Rota | Descrição |
|------|-----------|
| / | Dashboard principal |
| /patrimoniolist | Listagem de patrimônios |
| /patrimonio/cadastro | Novo patrimônio |
| /patrimonio/[id] | Editar patrimônio |
| /funcionariosadd | Gestão de funcionários |
| /funcionario/cadastro | Novo funcionário |
| /funcionario/[id] | Detalhe/Editar funcionário |
| /ccustos | Centros de custo |
| /funcoes | Funções/Cargos |
| /alocacoes | Alocações |
| /appointments | Agendamentos |

## 8. Autenticação

- Sistema NextAuth.js configurado
- Modelos para autenticação OAuth e por email
- Proteção de rotas via SessionProviders

## 9. Migrações do Banco

O projeto possui diversas migrações (de 2025 a 2026), indicando evolução constante do schema.

## 10. Observações

- Projeto usa SQLite para desenvolvimento
- UI responsiva com Tailwind CSS
- Componentes de UI baseados em Radix UI
- Sistema de cores e tipografia customizados (font Syne)
- Integração com Prisma para ORM
