# Biblioteca de Prompts Efetivos - ClubNath VIP

## 🎯 Prompt Master para Começar Conversas

```markdown
Você é um especialista em React Native com TypeScript, Expo, Supabase, React Query, React Hook Form + Zod, e NativeWind.

CONTEXTO DO PROJETO:
- App: ClubNath VIP - Comunidade exclusiva da Nathália Valente
- Influenciadora: 35M seguidores, CEO NAVA, R$3-4M receita anual
- Estratégia: Monetização passiva via licenciamento de imagem
- Target: Mães, zero fricção de download (PWA), experiência premium

ANTES de fazer qualquer mudança:
1. Analise o código existente em @Codebase
2. Verifique se funcionalidade similar já existe
3. Identifique padrões estabelecidos
4. Siga rigorosamente esses padrões

RESTRIÇÕES CRÍTICAS:
- NÃO adicione elementos de UI não solicitados
- NÃO crie arquivos duplicados (check @components/, @hooks/, @services/)
- NÃO use soluções complexas se simples funciona
- NÃO deixe placeholders ou TODOs
- SEMPRE inclua tipos TypeScript
- SEMPRE inclua error handling
- MANTENHA funcionalidades premium existentes

ESTILO DE CÓDIGO:
- TypeScript strict (zero 'any')
- Componentes funcionais
- Código modular
- Nomes descritivos
- Imports absolutos (@/)
```

## 🧩 Criação de Componente

```markdown
Crie componente [nome] que:
- É componente funcional React Native com TypeScript
- Usa NativeWind para styling
- Inclui interfaces TypeScript para todas as props
- Handle loading e error states
- Segue estrutura existente em @[arquivo-relacionado.tsx]
- Usa padrões de @[componente-similar.tsx]
- NÃO crie utilities ou helpers duplicados - referencie os existentes
- FOQUE em UX premium para influenciadora de 35M seguidores
```

## 🔗 Integração Supabase

```markdown
Crie screen [nome] que:
1. Busca dados da tabela Supabase: [nome_tabela]
2. Usa React Query com estes hooks:
   - useQuery para fetching
   - useMutation para updates
   - Cache invalidation adequado on success
3. Implementa error handling com mensagens amigáveis
4. Mostra loading states com skeleton UI
5. Segue políticas RLS em @supabase/schema.sql
6. NÃO crie funções de service se similares existem em @services/
7. INCLUA funcionalidades premium (badges VIP, animações, haptic feedback)
```

## 🐛 Debug

```markdown
Estou tendo este erro: [cole erro]

Contexto:
- Arquivo: @[filename]
- O que eu tentava fazer: [descrição]
- Mudanças recentes: [descrição breve]

Por favor:
1. Identifique a causa raiz
2. Explique POR QUÊ este erro ocorreu
3. Forneça o fix com mudanças mínimas
4. Mostre APENAS as linhas que precisam mudar
5. Explique potenciais side effects
6. MANTENHA funcionalidades premium existentes
```

## 🔄 Refactoring Seguro

```markdown
Quero refatorar @[arquivo] para [objetivo].

REQUISITOS:
1. Analise a estrutura atual primeiro
2. Liste todas as dependências e imports
3. Identifique código que será afetado
4. Crie plano de refactoring passo a passo
5. Mostre o plano e AGUARDE minha aprovação
6. Só prossiga quando eu digitar "next"
7. Implemente mudanças incrementalmente
8. Após cada passo, verifique compilação: tsc --noEmit
9. NÃO remova funcionalidade
10. NÃO crie arquivos ou funções duplicados
11. MANTENHA funcionalidades premium existentes
```

## 🚫 Anti-Duplicação

```markdown
ANTES de criar qualquer [tipo de arquivo], por favor:
1. Busque arquivos similares em @[diretório-relevante]/
2. Verifique se funcionalidade já existe
3. Se código similar existe, reutilize ou estenda
4. Se criar novo, explique por que código existente não pode ser reutilizado
5. Mostre ambas opções: A) Reutilizar existente, B) Criar novo
6. Aguarde minha decisão antes de prosseguir
7. PRIORIZE reutilização para manter consistência premium
```

## 🔍 Code Review

```markdown
Revise @[arquivo] para:
1. Vulnerabilidades de segurança (especialmente auth e data handling)
2. Problemas de performance (re-renders desnecessários, memory leaks)
3. Duplicação de código (check contra @[arquivos-relacionados])
4. Type safety issues
5. Error handling faltando
6. Problemas de acessibilidade
7. Funcionalidades premium mantidas
8. UX mobile-first para influenciadora

Para cada issue encontrado:
- Severidade: Critical/High/Medium/Low
- Localização: números de linha
- Explicação: Por que é um issue
- Fix: mudanças de código específicas necessárias
```

## 💎 Features Premium

```markdown
Implemente feature premium [nome] que:
1. INCLUA elementos visuais premium (gradientes, animações, badges VIP)
2. USE haptic feedback para interações
3. MANTENHA consistência com design existente
4. FOQUE em UX mobile-first
5. INCLUA loading states elegantes
6. HANDLE erros com mensagens amigáveis
7. SEGUE padrões de monetização passiva
8. INTEGRE com produtos NAVA quando relevante
9. USE personalidade da Nathália Valente
10. OTIMIZE para influenciadora de 35M seguidores
```

## 🎨 Design System

```markdown
Crie/atualize componente de design system [nome] que:
1. SEGUE padrões visuais premium existentes
2. USA cores: pink-500, purple-600, yellow-400 (VIP)
3. INCLUI animações suaves (fadeInUp, bounceGentle, glow)
4. SUPORTA dark mode
5. É responsivo para mobile
6. INCLUI acessibilidade (labels, roles)
7. TEM loading states elegantes
8. HANDLE estados de erro graciosamente
9. É reutilizável em todo o app
10. MANTÉM consistência com ClubNath VIP
```
