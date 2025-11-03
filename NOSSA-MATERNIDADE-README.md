# Nossa Maternidade - Aplicativo de Apoio Materno

## 📋 Visão Geral

Sistema completo de apoio à maternidade com integração de múltiplos modelos de IA para análise emocional, suporte psicológico e recomendações personalizadas.

## 🤖 Integração de IA Multi-Modelo

### Modelos Implementados

1. **Claude Sonnet 4** - Análise Empática e Psicológica
   - Análise profunda do estado emocional
   - Identificação de sinais de depressão pós-parto
   - Recomendações empáticas personalizadas

2. **Gemini 2.5 Flash** (NathAI) - Análise Contextual
   - Análise de padrões de comportamento
   - Contextualização de fase gestacional/pós-parto
   - Recomendações baseadas em contexto

3. **GPT-4** - Conversação e Recomendações
   - Diálogos naturais e empáticos
   - Suporte emocional conversacional
   - Recomendações personalizadas

4. **Perplexity** - Pesquisa Médica
   - Informações médicas atualizadas
   - Fontes confiáveis
   - Práticas baseadas em evidências

## 📱 Funcionalidades Implementadas

### 1. Sistema de Triagem Pré-Acesso (ScreeningScreen)

**Localização:** `src/features/screening/screens/ScreeningScreen.tsx`

- 15 perguntas estruturadas de avaliação emocional e mental
- Categorias: Emocional, Física, Social, Rotina, Triagem Clínica
- Implementação da Escala de Depressão Pós-Parto de Edinburgh (EPDS)
- Análise automática com IA
- Recomendações personalizadas baseadas nas respostas
- Interface com animações suaves e progressão visual

**Perguntas Incluídas:**

- Estado de humor atual
- Níveis de ansiedade e preocupação
- Qualidade do sono
- Sistema de apoio social
- Sentimento de sobrecarga
- Níveis de energia
- Capacidade de autocuidado
- Sentimentos de alegria e prazer
- Frequência de choro
- Dificuldade de concentração

### 2. Login Minimalista (LoginScreen)

**Localização:** `src/features/maternidade/screens/LoginScreen.tsx`

**Características:**

- Design clean com tema lilás/roxo
- Gradientes suaves de fundo
- Animações em Framer Motion
- Campos de email e senha
- Link "Esqueci minha senha"
- Botão "Criar conta" discreto
- Elementos decorativos animados
- Totalmente responsivo

### 3. Dashboard Personalizado (DashboardScreen)

**Localização:** `src/features/maternidade/screens/DashboardScreen.tsx`

**Componentes:**

- Saudação personalizada com nome da usuária
- Indicação de fase gestacional ou pós-parto
- Cards de rotina diária (Alimentação, Sono, Atividades, Tarefas)
- Botão de acesso ao NathAI (integração com Gemini 2.5 Flash)
- "Dica do Dia" com sugestões personalizadas
- Ações rápidas (Perfil do Bebê, Cronograma, Dicas)
- Banner de conteúdo exclusivo Nath
- Registro de atividades recentes
- Progresso visual de tarefas

### 4. Exclusivo Nath (ExclusiveNathScreen)

**Localização:** `src/features/maternidade/screens/ExclusiveNathScreen.tsx`

**Conteúdos:**

- Vídeos do dia a dia da Nathalia Valente
- Artigos sobre maternidade
- Fotos exclusivas
- Dicas práticas
- Sistema de categorização (Tudo, Diário, Dicas, Vídeos, Artigos)
- Diferenciação de conteúdo premium/gratuito
- Tags para fácil navegação
- Sistema de favoritos
- Banner de upsell para assinatura premium

**Exemplos de Conteúdo:**

- "Minha Rotina Matinal com o Bebê"
- "5 Maneiras de Lidar com a Privação de Sono"
- "Voltando à Forma Após a Gestação"
- "Preparando Papinha Caseira"

### 5. Rotina Semanal Visual (WeeklyRoutineScreen)

**Localização:** `src/features/maternidade/screens/WeeklyRoutineScreen.tsx`

**Funcionalidades:**

- Visualização de 7 dias da semana
- Timeline de atividades por hora
- Categorias codificadas por cor:
  - 🍎 Alimentação (verde)
  - 🌙 Sono (azul)
  - 🎈 Brincadeiras (laranja/vermelho)
  - 💖 Cuidados (rosa)
  - ☕ Autocuidado (roxo/rosa)
- Barra de progresso do dia
- Sistema de check para atividades concluídas
- Ícones contextuais de horário (sol, lua, café, pôr do sol)
- Botão flutuante para adicionar atividades
- Legenda de categorias

### 6. Apoio Emocional e Autocuidado (SelfCareScreen)

**Localização:** `src/features/maternidade/screens/SelfCareScreen.tsx`

**10 Sugestões de Autocuidado < 10 Minutos:**

1. **Respiração Consciente** (5 min)
   - Técnica 4-4-6 para reduzir ansiedade
   - Categoria: Mental

2. **Alongamento Rápido** (7 min)
   - Exercícios suaves para relaxar
   - Categoria: Física

3. **Pausa para o Chá** (10 min)
   - Momento de mindfulness
   - Categoria: Emocional

4. **Escrita Terapêutica** (10 min)
   - Expressão livre de sentimentos
   - Categoria: Emocional

5. **Música Relaxante** (8 min)
   - Momento musical calmante
   - Categoria: Mental

6. **Hidratação Consciente** (3 min)
   - Beber água com atenção plena
   - Categoria: Física

7. **Gratidão Diária** (5 min)
   - Listar 3 coisas positivas
   - Categoria: Emocional

8. **Meditação Rápida** (5 min)
   - Silêncio e presença
   - Categoria: Espiritual

9. **Cuidado com a Pele** (10 min)
   - Ritual de skincare
   - Categoria: Física

10. **Olhar pela Janela** (5 min)
    - Conexão com ambiente externo
    - Categoria: Mental

**Características:**

- Passos detalhados para cada atividade
- Benefícios listados
- Sistema de favoritos
- Possibilidade de agendar
- Contador de atividades realizadas na semana
- Expansão/colapso de detalhes

### 7. Brincadeiras Sensoriais (SensoryActivitiesScreen)

**Localização:** `src/features/maternidade/screens/SensoryActivitiesScreen.tsx`

**Atividades para Bebês de até 1 Ano:**

1. **Caixa de Texturas** (15-20 min)
   - Exploração tátil com diferentes materiais
   - Idade: 6-12 meses
   - Dificuldade: Fácil

2. **Garrafas Sensoriais** (10-15 min)
   - Estimulação visual com movimento
   - Idade: 3-12 meses
   - Dificuldade: Fácil

3. **Música com Instrumentos Caseiros** (10-15 min)
   - Exploração sonora
   - Idade: 6-12 meses
   - Dificuldade: Fácil

4. **Pintura com Pudim** (15-20 min)
   - Arte sensorial comestível
   - Idade: 8-12 meses
   - Dificuldade: Médio

5. **Cesta de Descobertas** (15-20 min)
   - Exploração de objetos naturais
   - Idade: 6-12 meses
   - Dificuldade: Fácil

**Para Cada Atividade:**

- Lista de materiais necessários
- Passo a passo detalhado
- Benefícios do desenvolvimento
- Dicas práticas
- Avisos de segurança
- Indicação de tipo sensorial (visual, auditivo, tátil, múltiplo)
- Sistema de marcação de atividades concluídas

### 8. Receitas Infantis (ChildrenRecipesScreen)

**Localização:** `src/features/maternidade/screens/ChildrenRecipesScreen.tsx`

**Receitas com Ovos, Leite, Batata e Cenoura:**

1. **Omelete Nutritiva de Legumes**
   - Idade: 8+ meses
   - Tempo: 15 min
   - Porções: 2
   - Alergênicos: Ovos, Leite

2. **Purê Cremoso de Batata e Cenoura**
   - Idade: 6+ meses
   - Tempo: 20 min
   - Porções: 3
   - Alergênicos: Leite

3. **Mingau de Leite com Ovo**
   - Idade: 8+ meses
   - Tempo: 10 min
   - Porções: 1
   - Alergênicos: Leite, Ovos, Aveia

4. **Panqueca de Batata Doce**
   - Idade: 10+ meses
   - Tempo: 20 min
   - Porções: 4
   - Alergênicos: Ovos, Leite, Aveia

**Para Cada Receita:**

- Lista de ingredientes
- Modo de preparo passo a passo
- Dicas nutricionais
- Avisos de alergênicos
- Faixa etária recomendada
- Tempo de preparo
- Número de porções

## 🎨 Design System

### Paleta de Cores

- **Primary:** Lilás/Roxo (#a855f7, #9333ea)
- **Secondary:** Rosa (#ec4899, #f472b6)
- **Accent:** Azul suave (#60a5fa)
- **Background:** Gradientes suaves (purple-50, pink-50, blue-50)

### Tipografia

- Font family: System fonts com fallback
- Tamanhos: 12px (xs) a 32px (3xl)
- Pesos: Regular (400), Medium (500), Semibold (600), Bold (700)
- Arredondamento: Elementos com border-radius generosos (xl, 2xl, 3xl)

### Componentes

- Cards brancos com shadow suave
- Botões com gradientes
- Ícones do Lucide React
- Animações com Framer Motion
- Layout mobile-first

## 📁 Estrutura de Arquivos

```
src/
├── features/
│   ├── maternidade/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ExclusiveNathScreen.tsx
│   │   │   ├── WeeklyRoutineScreen.tsx
│   │   │   ├── SelfCareScreen.tsx
│   │   │   ├── SensoryActivitiesScreen.tsx
│   │   │   └── ChildrenRecipesScreen.tsx
│   │   ├── components/
│   │   └── index.ts
│   └── screening/
│       ├── screens/
│       │   └── ScreeningScreen.tsx
│       ├── data/
│       │   └── questions.ts
│       └── index.ts
└── lib/
    └── ai/
        ├── aiService.ts
        ├── types.ts
        └── index.ts
```

## 🔧 Tecnologias Utilizadas

- **React 18.3** - Library principal
- **TypeScript 5.5** - Type safety
- **Framer Motion** - Animações suaves
- **Lucide React** - Ícones modernos
- **TailwindCSS** - Estilização utilitária
- **Vite** - Build tool

## 🚀 Como Usar

### Importar Componentes

```typescript
import {
  LoginScreen,
  DashboardScreen,
  ExclusiveNathScreen,
  WeeklyRoutineScreen,
  SelfCareScreen,
  SensoryActivitiesScreen,
  ChildrenRecipesScreen,
} from '@/features/maternidade';

import { ScreeningScreen } from '@/features/screening';
import { aiService } from '@/lib/ai';
```

### Exemplo de Uso do AI Service

```typescript
// Análise emocional
const analysis = await aiService.analyzeEmotionalState(
  'Estou me sentindo muito cansada e sobrecarregada',
  {
    gestationalWeek: 32,
    isPostpartum: false,
  }
);

// Conversação com NathAI
const response = await aiService.getContextualAnalysis(
  'Quais exercícios posso fazer na 35ª semana?'
);

// Triagem de depressão pós-parto
const screening = await aiService.screenPostpartumDepression([0, 1, 2, 3, 2, 1, 0, 2, 1, 0]);
```

## 🔐 Segurança e Privacidade

- Respostas do questionário são confidenciais
- Dados processados localmente quando possível
- Comunicação segura com APIs de IA
- Validação de dados sensíveis
- Conformidade com LGPD

## 📊 Próximos Passos

### Pendente de Implementação

1. **Configuração de APIs**
   - Integração real com Claude API
   - Integração real com Gemini API
   - Integração real com OpenAI API
   - Integração real com Perplexity API

2. **Funcionalidades Adicionais**
   - Histórias de sono com áudio
   - Cards para lidar com birras
   - Sistema de notificações de alertas de saúde mental
   - Análise temporal de padrões emocionais
   - Gráficos de evolução emocional

3. **Integrações**
   - Conectar com fluxo principal do app
   - Sistema de autenticação completo
   - Banco de dados para persistência
   - Sistema de notificações push

4. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes E2E
   - Validação de acessibilidade

## 📝 Notas de Desenvolvimento

### Boas Práticas Seguidas

✅ TypeScript strict mode  
✅ Componentização modular  
✅ Props tipadas  
✅ Código documentado  
✅ ESLint compliance  
✅ Prettier formatting  
✅ Mobile-first design  
✅ Acessibilidade considerada  
✅ Performance otimizada  
✅ Code splitting preparado

### Padrões de Código

- Componentes funcionais com hooks
- Props interfaces explícitas
- Estado local com useState
- Animações declarativas com Framer Motion
- Estilização com classes Tailwind
- Ícones consistentes do Lucide

## 🤝 Contribuindo

Para adicionar novas funcionalidades ao Nossa Maternidade:

1. Crie novos componentes em `features/maternidade/screens/`
2. Exporte no `index.ts`
3. Mantenha consistência de design
4. Adicione documentação
5. Teste em diferentes tamanhos de tela

## 📄 Licença

Propriedade de ClubNath VIP - Todos os direitos reservados.

---

**Made with 💜 for mothers everywhere**
