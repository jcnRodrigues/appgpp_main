# Sistema de Gerenciamento de Patrimônios - AppGPP

## Funcionalidades Implementadas

### 1. **Serviço de Patrimônio** 
📄 Arquivo: `src/back-end/service/Patrimonio.services/patrimonio.service.ts`

Funções implementadas:
- `listarPatrimonios()` - Lista com filtros por descrição, status e tipo
- `criarPatrimonio()` - Criar novo patrimônio
- `atualizarPatrimonio()` - Atualizar patrimônio existente
- `getTiposPatrimonio()` - Obter tipos disponíveis
- `getStatusPatrimonio()` - Obter status disponíveis
- `getCentrosCusto()` - Obter centros de custo

### 2. **Componente de Formulário**
📄 Arquivo: `src/back-end/components/PatrimonioForm/PatrimonioForm.tsx`

Funcionalidades:
- Formulário completo para criar e editar patrimônios
- Campos dinâmicos carregados da API
- Validações básicas frontend
- Suporte para criar e atualizar patrimônios
- Interface responsiva com Tailwind CSS

**Campos do Formulário:**
- ID do Patrimônio
- Descrição (obrigatório)
- Descrição Detalhada
- Tipo de Patrimônio
- Data de Entrada
- Data de Saída
- Nota Fiscal
- Licença/Série
- Valor (obrigatório)
- Status (obrigatório)
- Centro de Custo

### 3. **Componente de Tabela**
📄 Arquivo: `src/back-end/components/PatrimonioTable/PatrimonioTable.tsx`

Funcionalidades:
- Listagem em formato de tabela interativa
- Filtros por descrição, status e tipo
- Busca em tempo real
- Ações de edição e exclusão
- Indicadores de status com cores
- Formatação de valores monetários e datas

### 4. **API Routes**

#### GET/POST - Lista e Criação
📄 Arquivo: `src/app/api/patrimonio/route.ts`
- **GET**: Lista patrimônios com filtros opcionais
  - Parâmetros: `descricao`, `status`, `tipo`, `skip`, `take`
  - Retorna: Array de patrimônios
  
- **POST**: Cria novo patrimônio
  - Valida campos obrigatórios
  - Retorna patrimônio criado

#### GET/PUT/DELETE - Operações Específicas
📄 Arquivo: `src/app/api/patrimonio/[id]/route.ts`
- **GET**: Obtém patrimônio específico por ID
- **PUT**: Atualiza patrimônio existente
- **DELETE**: Deleta patrimônio (com confirmação)

#### GET - Opções Dinâmicas
📄 Arquivo: `src/app/api/patrimonio/opcoes/route.ts`
- **GET**: Retorna tipos, status e centros de custo disponíveis
  - Usado pelo formulário para Popular dropdowns

### 5. **Páginas**

#### Página de Cadastro
📄 Arquivo: `src/app/patrimonio/cadastro/page.tsx`
- Rota: `/patrimonio/cadastro`
- Exige autenticação
- Integra `PatrimonioForm` para criar novos patrimônios

#### Página de Edição
📄 Arquivo: `src/app/patrimonio/[id]/page.tsx`
- Rota: `/patrimonio/[id]`
- Exige autenticação
- Permite editar patrimônio existente
- Carrega dados automaticamente

#### Página de Listagem
📄 Arquivo: `src/app/patrimoniolist/page.tsx`
- Rota: `/patrimoniolist`
- Exibe todos os patrimônios em tabela
- Botão para criar novo patrimônio
- Integra `PatrimonioTable` com filtros

## Fluxo de Uso

### 1. **Listar Patrimônios**
```
/patrimoniolist → Exibe tabela com todos os patrimônios
│
├── Buscar/Filtrar → Busca em tempo real
│
├── Editar → Clica em editar
│   └── /patrimonio/[id] → Formulário pré-preenchido
│       └── Salva → Volta para listagem
│
└── Novo → Clica em "Novo Patrimônio"
    └── /patrimonio/cadastro → Formulário vazio
        └── Salva → Volta para listagem
```

### 2. **Criar Patrimônio**
```
/patrimonio/cadastro 
→ Preenche formulário 
→ Clica "Criar Patrimônio" 
→ API POST /api/patrimonio 
→ Redireciona para /patrimoniolist
```

### 3. **Editar Patrimônio**
```
/patrimoniolist 
→ Clica em editar 
→ /patrimonio/[id] 
→ Carrega dados 
→ Atualiza campos 
→ Clica "Atualizar" 
→ API PUT /api/patrimonio/[id] 
→ Redireciona para /patrimoniolist
```

### 4. **Considerar Patrimônio**
```
/patrimoniolist 
→ Clica em deletar 
→ Confirma exclusão 
→ API DELETE /api/patrimonio/[id] 
→ Remove da tabela
```

## Segurança e Validações

✅ **Autenticação**: Todas as páginas exigem login (NextAuth)
✅ **Validação Frontend**: Campos obrigatórios e formatos
✅ **Validação Backend**: Dupla validação em APIs
✅ **Erro Handling**: Tratamento de erros com feedback ao usuário
✅ **Confirmação**: Confirma antes de deletar

## Customizações Possíveis

1. **Adicionar campos**: Editar `PatrimonioForm.tsx`
2. **Filtros avançados**: Expandir `PatrimonioTable.tsx`
3. **Exportação**: Adicionar botão de exportar para CSV/Excel
4. **Auditoria**: Rastrear criação/edição com campos `createdAt`, `updatedAt`
5. **Permissões**: Adicionar validação de permissões por usuário
6. **Imagens**: Adicionar upload de imagens para patrimônios

## Stack Tecnológico

- **Framework**: Next.js 16+
- **Banco de Dados**: Prisma com SQLite
- **Autenticação**: NextAuth.js
- **UI**: React + Tailwind CSS + Radix UI
- **Ícones**: Lucide React
- **Validação**: TypeScript
