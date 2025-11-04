# 🧠 Configuração MCP (Memory Context Protocol)

## O que é o MCP?

O MCP (Memory Context Protocol) é um sistema de gerenciamento de memória contextual implementado neste projeto para fornecer à IA uma compreensão profunda e de longo prazo do histórico do usuário.

## ✅ Status da Implementação

### Já Implementado

- ✅ **MemoryManager** (`lib/mcp/memory-manager.ts`)
  - Armazenamento de memórias com embeddings
  - Busca semântica de memórias relevantes
  - Recuperação de memórias por período
  - Geração de contexto abrangente
  - Sumarização de períodos

- ✅ **APIs de MCP** (`app/api/mcp/`)
  - `/api/mcp/conversational-onboarding` - Onboarding conversacional
  - `/api/mcp/semantic-search` - Busca semântica
  - `/api/mcp/summarize` - Sumarização de conteúdo
  - `/api/mcp/transcribe` - Transcrição de áudio

### Estrutura do Banco de Dados

O sistema MCP utiliza as seguintes tabelas no Supabase:

#### 1. `memory_embeddings`

Armazena memórias com embeddings vetoriais para busca semântica.

```sql
- id: UUID (primary key)
- user_id: UUID (foreign key → profiles)
- content_type: TEXT (conversation, diary, post, onboarding)
- content_id: TEXT (opcional, referência ao conteúdo original)
- content_text: TEXT (texto da memória)
- embedding: VECTOR(1536) (embedding OpenAI)
- metadata: JSONB (metadados adicionais)
- created_at: TIMESTAMP
```

#### 2. `ai_memory_context`

Armazena resumos de períodos para contexto de longo prazo.

```sql
- id: UUID (primary key)
- user_id: UUID (foreign key → profiles)
- time_period: TEXT (weekly, monthly, custom)
- start_date: DATE
- end_date: DATE
- summary: TEXT (resumo do período)
- key_events: JSONB (eventos importantes)
- created_at: TIMESTAMP
```

## 🔧 Como Usar

### 1. Armazenar Memória

```typescript
import { MemoryManager } from '@/lib/mcp/memory-manager';

const memoryManager = new MemoryManager(userId);

await memoryManager.storeMemory(
  'Hoje me senti muito ansiosa com a chegada do bebê',
  'diary',
  diaryEntryId,
  { mood: 'anxious', tags: ['pregnancy', 'emotions'] }
);
```

### 2. Buscar Memórias Relevantes

```typescript
const memories = await memoryManager.searchMemories(
  'Como estava me sentindo sobre a gravidez?',
  10, // limite de resultados
  0.7 // threshold de similaridade
);
```

### 3. Obter Contexto Abrangente

```typescript
const context = await memoryManager.getComprehensiveContext(
  'Quero conversar sobre minha ansiedade',
  90 // dias para trás
);

// Usar o contexto em uma chamada de IA
const response = await anthropic.messages.create({
  system: context,
  messages: [{ role: 'user', content: userMessage }],
  // ...
});
```

### 4. Gerar Resumo de Período

```typescript
const startDate = new Date('2024-10-01');
const endDate = new Date('2024-10-31');

const summary = await memoryManager.generatePeriodSummary(startDate, endDate);
```

## 📊 Fluxo de Funcionamento

```
1. Usuário interage (chat, diário, posts)
   ↓
2. Conteúdo é armazenado como memória
   ↓
3. OpenAI gera embedding vetorial
   ↓
4. Embedding é armazenado no Supabase (pgvector)
   ↓
5. Ao chatear, sistema busca memórias relevantes
   ↓
6. Contexto enriquecido é enviado para IA
   ↓
7. IA responde com consciência do histórico
```

## 🎯 Casos de Uso

### 1. Chat Empático com Memória

A NathAI se lembra de conversas anteriores e pode referenciar:

- Preocupações mencionadas anteriormente
- Progresso em desafios
- Preferências e contexto pessoal

### 2. Diário Inteligente

Ao escrever no diário, o sistema pode:

- Detectar padrões de humor
- Sugerir reflexões baseadas em entradas anteriores
- Alertar sobre mudanças significativas

### 3. Recomendações Personalizadas

Baseado no histórico:

- Receitas adequadas ao momento
- Artigos relevantes
- Atividades de autocuidado

## ⚡ Performance

### Otimizações Implementadas

1. **Indexes no Banco**
   - Index HNSW no campo `embedding` para busca vetorial rápida
   - Index B-tree em `user_id` e `created_at`

2. **Caching**
   - Memórias recentes em cache
   - Contextos pré-computados para usuários ativos

3. **Batch Processing**
   - Geração de embeddings em lote
   - Sumarização assíncrona de períodos

## 🔒 Segurança e Privacidade

- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Usuários só acessam suas próprias memórias
- ✅ Embeddings armazenados de forma segura
- ✅ Dados sensíveis nunca expostos em logs

## 📝 Tarefas de Manutenção

### Executar Periodicamente

1. **Geração de Resumos Semanais**
   - Frequência: Toda segunda-feira
   - Script: `scripts/generate-weekly-summaries.ts` (a criar)

2. **Limpeza de Memórias Antigas**
   - Frequência: Mensal
   - Ação: Arquivar memórias > 1 ano

3. **Otimização de Índices**
   - Frequência: Trimestral
   - Comando: `REINDEX INDEX memory_embeddings_embedding_idx;`

## 🚀 Melhorias Futuras

- [ ] Compressão de memórias antigas
- [ ] Detecção automática de eventos importantes
- [ ] Suporte a múltiplos modelos de embedding
- [ ] Dashboard de insights de memória
- [ ] Exportação de histórico completo

## 📚 Referências

- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Supabase Vector Guide](https://supabase.com/docs/guides/ai/vector-columns)

---

**Última atualização:** 02/11/2024
