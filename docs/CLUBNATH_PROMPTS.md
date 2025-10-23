# Prompts Assertivos para o ClubNath (Sonnet 4.5)

Organizados por categoria para copiar e usar em Cursor AI, Claude Code (Sonnet 4.5), ChatGPT e afins. Todos já adaptados ao contexto do ClubNath (React + Vite + Supabase + Tailwind, PWA, Netlify).

---

## 1) Desenvolvimento Técnico (Cursor AI / Claude Code)

### A) Criar Sistema de Grupos Temáticos (Supabase + React)

```
Você é um desenvolvedor sênior (Sonnet 4.5) especializado em apps de comunidade usando React + Supabase.

CONTEXTO:
O ClubNath é um app PWA (React + Vite + Tailwind + Supabase) com feed social, chat IA e perfis de usuárias. Precisamos adicionar “Grupos Temáticos” onde mães podem criar/participar de comunidades privadas por tópicos (ex: “Amamentação”, “Mães Solo”).

REQUISITOS TÉCNICOS:
1) Banco de dados Supabase:
   - Tabela `groups` (id uuid pk, name text, description text, category text, creator_id uuid, is_private bool default false, created_at timestamptz default now())
   - Tabela `group_members` (id uuid pk, group_id uuid fk, user_id uuid, role text in ('admin','moderator','member'), joined_at timestamptz default now())
   - Tabela `group_posts` (id uuid pk, group_id uuid fk, user_id uuid, content text, media_url text null, created_at timestamptz default now())
   - Políticas RLS para garantir que: (a) apenas membros leem posts privados; (b) só admins criam/removem moderadores; (c) autora pode editar/deletar seus posts

2) Funcionalidades:
   - Usuária pode criar até 5 grupos (validar no backend)
   - Categorias predefinidas: 'Fé', 'Amamentação', 'Pós-Parto', 'Mães Solo', 'Criação'
   - Realtime: novo post do grupo aparece sem refresh (Supabase Realtime)
   - Moderação automática: função que bloqueia posts contendo lista de termos proibidos
   - Notificações push: quando alguém posta no grupo (usar Edge Function + tabela push_tokens)

3) UI/UX (Tailwind):
   - Tela Descobrir Grupos com busca e filtro por categoria
   - `GroupCard`: nome, descrição, contagem de membros, badge 'Privado/Público'
   - `GroupDetail`: feed de posts, composer com upload de imagem, botão 'Sair do Grupo'
   - Acessibilidade e mobile-first

ENTREGA:
- SQL de migração (create tables + RLS)
- Serviços TS: createGroup, joinGroup, leaveGroup, createGroupPost, listGroupPosts
- Componentes React: GroupsList.tsx, GroupCard.tsx, GroupDetail.tsx
- Integração Realtime + invalidation no React Query
- Testes (Vitest) para serviços e regras críticas de permissão

RESTRIÇÕES:
- Reutilizar design system existente
- Lazy loading para grupos com 100+ mensagens
- Zero `any`, tipos explícitos em serviços e props
```

---

### B) Implementar IA no Robô Nath com Memória de Contexto (Claude)

```
Você é especialista (Sonnet 4.5) em integração de LLMs (Claude/GPT) em PWAs.

OBJETIVO:
Adicionar memória conversacional ao Robô Nath para lembrar últimas 5 conversas por usuária e personalizar respostas.

REQUISITOS:
1) Supabase:
   - Tabela `chat_history` (id uuid, user_id uuid, message text, sender 'user'|'assistant', created_at timestamptz, session_id uuid)
   - Index por (user_id, created_at desc). Limitar armazenamento a 30 dias (cron/edge)

2) Prompt System do Robô Nath:
   - Personalidade: jovem, empática, cristã leve, usa “miga”, valida sentimento
   - Sempre reconhecer continuidade: “Oi de novo, miga! Na última vez você falou sobre [tema]. Como está isso hoje?”

3) Fluxo:
   - Usuária envia mensagem → buscar últimas 10 mensagens (5 user, 5 bot)
   - Montar prompt: [system] + [histórico resumido] + [mensagem atual]
   - Enviar para Claude → salvar pergunta e resposta em `chat_history`
   - Botão “Esquecer histórico” limpa dados da usuária

ENTREGA:
- Funções: getChatHistory(userId), buildPromptWithContext(message, history), saveMessage(userId, message, sender)
- Edge Function: /functions/v1/chat-ai com rate limit por user
- Testes de unidade do resumo de contexto
```

---

## 2) Conteúdo Editorial (ChatGPT/Claude)

### C) Gerar Estudos Bíblicos para Mães (JSON pronto)

```
Você é uma escritora cristã especializada em devocionais para mães, com tom acolhedor e sem julgamentos.

TAREFA:
Criar 7 estudos bíblicos (5 min) para a série “Fé na Maternidade Exausta” (pós-parto: cansaço, culpa, solidão).

ESTRUTURA DE CADA DEVOCIONAL:
1) Título inspirador
2) Versículo (Livro capítulo:versículo - NVI)
3) Reflexão (150-200 palavras) empática
4) Pergunta de reflexão
5) Oração curta (3 frases)
6) Dica prática

TEMAS (7 dias):
1) Exaustão  2) Culpa  3) Solidão  4) Medo  5) Raiva  6) Gratidão  7) Renovação

RESTRIÇÕES:
- Linguagem acessível, sem teologês, sem romantizar sofrimento
- Validar antes de propor esperança
- Preferir Salmos de lamento/encorajamento

SAÍDA: Array JSON conforme exemplo abaixo (1 objeto por dia).
```

---

### D) Criar Scripts de Reels para Lançamento (Tabela)

```
Você é roteirista de Reels (15-30s) para maternidade real e emocional.

OBJETIVO:
Criar 10 scripts com: Gancho, Problema, Solução (ClubNath), CTA, Tipo Visual, Áudio.

PÚBLICO: Mães 25-40, classe B/C, cristãs (ou simpáticas), dores: solidão, culpa, exaustão, medo de julgamento.

RESTRIÇÕES:
- Evitar clichês e “toxic positivity”
- Validar sentimento → oferecer saída concreta
- CTAs variados, não só “baixe o app”

ENTREGA:
Tabela markdown com 10 linhas e colunas: | Reel # | Gancho | Problema | Solução | CTA | Tipo Visual | Áudio |
```

---

## 3) Design e UX

### E) Gerar Avatares Emoji (SVG) para Perfis

```
Você é designer de UX/UI de avatares minimalistas.

TAREFA:
Criar 12 avatares em SVG, representando estágios e perfis de maternidade com diversidade.

ESPECIFICAÇÕES:
- Estilo flat minimalista
- Paleta ClubNath (#FF6B9D, #FFE5E5, #8B5CF6, #FFF8DC)
- 200x200, fundo transparente, <=20KB
- Temas: exausta, oração, radiante, chorando, pensativa, determinada, grávida, amamentando, hijab, black power, asiática, cadeirante.

ENTREGA:
12 SVG (ex.: avatar-01-exausta.svg) + guia rápido de uso com badges.
```

---

## 4) Marketing e Lançamento

### F) Sequência de E-mails de Onboarding (5 e-mails / 7 dias)

```
Você é copywriter de e-mail marketing para apps de assinatura, tom empático e conversacional.

OBJETIVO:
Sequência de 5 e-mails automáticos p/ primeiros 7 dias. Metas: completar perfil (80%), primeira postagem (50%), chat IA (60%), conversão premium (5%).

ESTRUTURA POR E-MAIL:
- Assunto (<=50c, com emoji), Pré-header, Saudação personalizada
- Corpo (150-200 palavras) validando sentimentos
- CTA único
- PS com dica ou depoimento

CRONOGRAMA:
Dia 0: Boas-vindas + completar perfil
Dia 1: Descubra a Frase do Dia
Dia 3: Conheça o Robô Nath
Dia 5: Faça sua primeira postagem
Dia 7: Convite Premium (trial 7 dias)

ENTREGA:
5 e-mails completos + ideias de A/B test de assunto.
```

---

## 5) Análise e Estratégia

### G) Matriz de Priorização RICE (Fase 2)

```
Você é PM sênior especialista em roadmap de apps de comunidade.

TAREFA:
Priorizar 15 features da Fase 2 usando RICE (Reach, Impact, Confidence, Effort). Gerar tabela markdown com score e prioridade.

CONTEXTOS:
- Meta: 5.000 usuárias em 3 meses, 2 devs full-time, budget limitado, foco retenção D30
- Considere dependências técnicas (push antes de direct messages)

ENTREGA:
1) Tabela RICE
2) Top 5 features c/ justificativa
3) Sequência recomendada
4) O que fica p/ Fase 3
```

---

## 6) IA e Personalização

### H) Recomendação Personalizada de Feed

```
Você é engenheiro de ML (Sonnet 4.5) especialista em ranking para apps sociais.

OBJETIVO:
Criar algoritmo de ranking híbrido (regras + conteúdo) para o feed do ClubNath usando objetivos do onboarding e engajamento.

REQUISITOS:
1) Regras de Negócio:
   - "Nathy Aprovou" sempre top 10
   - Interações prévias com autora: +20%
   - Diversificação: máx 3 posts seguidos da mesma categoria
   - Frescor: posts >24h penalidade -50%
2) Personalização por objetivo (
   - "Fortalecer fé" → priorizar Fé (peso 2x)
   - "Desabafo" → priorizar Desabafo (peso 2x)
3) Fallback: "best-of" p/ novas usuárias

ENTREGA:
- Pseudocódigo do ranking
- `getFeedForUser(userId)` em TypeScript
- Query SQL otimizada para candidatos (últimas 24h + badge)
- Métricas: tempo de sessão, scroll depth, CTR de like/comentário
```

---

## 7) Copywriting Específico

### I) Respostas do Robô Nath por Cenário

```
Você é a voz do Robô Nath (empática, jovem, cristã leve). Sempre: 1) Validação; 2) Empatia; 3) Insight; 4) Ação prática; 5) Pergunta aberta. Máx 100 palavras, usar “miga” 1x, emoji sutil (💜/🫂), sem conselhos médicos.

CENÁRIOS (10):
1) Exaustão com sono do bebê
2) Culpa por não amamentar
3) Medo de não ser boa mãe
4) Parceiro não ajuda
5) Raiva às vezes do bebê
6) Fé abalada
7) Não tem com quem desabafar
8) Inveja de quem tem ajuda
9) Suspeita de depressão pós-parto (sugerir ajuda profissional)
10) Querer desistir de tudo

ENTREGA:
Blocos separados com “CENÁRIO X” e resposta completa.
```

---

## Como usar

- Copie e cole o prompt desejado diretamente no Sonnet 4.5 (Claude) ou Cursor AI.
- Ajuste detalhes (nomes de tabelas, chaves, textos) conforme a sprint.
- Combine prompts: use a saída de um como entrada de outro (ex.: gerar SQL e depois componentes).
