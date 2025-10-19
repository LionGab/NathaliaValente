# ClubNath - Instruções de Configuração

## ✅ Status Atual

O app está configurado e rodando em: http://localhost:5174/

## 🔒 Configuração de Segurança - Supabase Edge Functions

### 1. Adicionar API Keys aos Supabase Secrets

**IMPORTANTE:** As chaves de API devem estar armazenadas de forma segura no Supabase, NÃO no código do frontend.

Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/functions/secrets

Adicione os seguintes secrets:

```
ANTHROPIC_API_KEY=sua-nova-chave-anthropic-aqui
```

**⚠️ AÇÃO NECESSÁRIA:**
- Revogue as chaves antigas que foram expostas
- Gere uma nova chave em: https://console.anthropic.com/settings/keys
- Adicione a nova chave nos Supabase Secrets

### 2. Deploy da Edge Function

Instale o Supabase CLI se ainda não tiver:

```bash
npm install -g supabase
```

Faça login no Supabase:

```bash
supabase login
```

Link seu projeto local:

```bash
supabase link --project-ref bbcwitnbnosyfpfjtzkr
```

Faça o deploy da função:

```bash
supabase functions deploy chat-ai
```

### 3. Verificar se a função está funcionando

Após o deploy, teste a função no dashboard:
https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/functions/chat-ai

Ou teste via curl:

```bash
curl -i --location --request POST 'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo' \
  --header 'Content-Type: application/json' \
  --data '{"message":"Olá!"}'
```

## 📦 Estrutura do Projeto

```
boltnathH/
├── src/
│   ├── components/
│   │   ├── ChatPage.tsx          # Agora usa Edge Function
│   │   ├── FeedPage.tsx
│   │   ├── DailyQuotePage.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   └── lib/
│       └── supabase.ts
├── supabase/
│   ├── functions/
│   │   └── chat-ai/
│   │       └── index.ts          # Edge Function com Claude Haiku 4.5
│   └── migrations/
└── .env                          # Apenas credenciais públicas
```

## 🤖 Sobre o Robô Nath

O chat agora usa **Claude 3.5 Haiku** (modelo `claude-3-5-haiku-20241022`), que é:
- ✅ Mais rápido e econômico
- ✅ Perfeito para conversas em tempo real
- ✅ Mantém alta qualidade de resposta
- ✅ Personalizado para apoio maternal

## 🔐 Segurança

- ✅ API keys NÃO estão expostas no frontend
- ✅ Edge Function roda no servidor Supabase
- ✅ Chaves secretas armazenadas no Supabase Secrets
- ✅ CORS configurado corretamente
- ✅ Fallback em caso de erro

## 📝 Próximos Passos

1. ⚠️ **URGENTE:** Revogar chaves antigas expostas
2. Gerar novas chaves de API
3. Adicionar `ANTHROPIC_API_KEY` aos Supabase Secrets
4. Deploy da Edge Function: `supabase functions deploy chat-ai`
5. Testar o chat no app

## 🚀 Comandos de Desenvolvimento

```bash
# Iniciar servidor dev
npm run dev

# Type checking
npm run typecheck

# Build para produção
npm run build

# Deploy Edge Function
supabase functions deploy chat-ai
```

## 📚 Documentação

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Anthropic API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Claude Models](https://docs.anthropic.com/claude/docs/models-overview)
