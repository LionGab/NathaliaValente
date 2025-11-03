# Sistema de Cores - Nossa Maternidade

## Visão Geral

Este documento descreve como o sistema de cores personalizado definido em `tailwind.config.js` está integrado ao sistema de onboarding e ao aplicativo.

## Paleta de Cores Maternal

### Cores Principais

#### Primary (Rosa Acolhedor)

- Uso: Elementos principais da marca, CTAs, elementos interativos
- Tons: `primary-50` a `primary-900`
- Gradiente característica: Rosa suave e acolhedor

#### Secondary (Lavanda)

- Uso: Elementos secundários, complementos visuais
- Tons: `secondary-50` a `secondary-900`
- Gradiente característica: Lavanda suave

#### Accent (Azul)

- Uso: Elementos de destaque, informações importantes
- Tons: `accent-50` a `accent-900`
- Gradiente característica: Azul serenidade

### Cores Especiais para Maternidade

#### Maternity Skin

- Uso: Elementos relacionados a cuidados pessoais e maternidade
- Tons: `maternity-skin-50` a `maternity-skin-500`
- Cor característica: Tom pele acolhedor

#### Maternity Baby

- Uso: Elementos relacionados a bebês e cuidados infantis
- Tons: `maternity-baby-50` a `maternity-baby-500`
- Cor característica: Rosa bebê suave

#### Maternity Nature

- Uso: Elementos relacionados a natureza e bem-estar
- Tons: `maternity-nature-50` a `maternity-nature-500`
- Cor característica: Verde natureza

### Cores de Estado

- **Success**: Verde para feedback positivo (`success-50` a `success-900`)
- **Warning**: Amarelo para avisos (`warning-50` a `warning-900`)
- **Error**: Vermelho para erros (`error-50` a `error-900`)
- **Neutral**: Tons neutros (`neutral-0` a `neutral-900`)

## Classes CSS Maternais

### Gradientes

- `.maternal-gradient`: Gradiente de fundo principal (rosa → lavanda → azul claro)

### Componentes

- `.maternal-card`: Card com backdrop blur e borda rosa suave
- `.maternal-button`: Botão com gradiente rosa vibrante
- `.maternal-input`: Input com borda rosa e foco suave

### Ícones e Sombras

- `.maternal-icon`: Ícone com cor rosa e sombra suave
- `.maternal-shadow`: Sombra suave com tom rosa
- `.maternal-shadow-lg`: Sombra grande com tom rosa

### Animações

- `.maternal-float`: Animação flutuante suave
- `.maternal-pulse`: Animação de pulso suave

## Integração no Sistema de Onboarding

### Telas Atualizadas

#### EmotionalStateScreen

- Ícone de coração: `from-primary-500 to-secondary-600`
- Sombra: `maternal-shadow-lg`
- Estados emocionais com cores personalizadas

#### DesireScreen

- Ícone de sparkles: `from-secondary-500 to-primary-600`
- Sombra: `maternal-shadow-lg`
- Desejos com cores maternais personalizadas

#### ArchetypeSelectionScreen

- Ícone de coroa: `from-accent-500 to-secondary-600`
- Sombra: `maternal-shadow-lg`
- Arquétipos com cores maternais específicas

#### PersonalizedWelcomeScreen

- Cores personalizadas por arquétipo:
  - Guerreira: `error-50` → `primary-100`
  - Resiliente: `secondary-50` → `maternity-baby-100`
  - Visionária: `accent-50` → `maternity-nature-100`
  - Cuidadora: `success-50` → `maternity-nature-100`

#### EssenceOnboarding

- Background: `maternal-gradient`
- Orbs flutuantes:
  - `primary-200/30` → `maternity-baby-300/20`
  - `secondary-200/30` → `maternity-nature-300/20`
  - `accent-200/20` → `maternity-skin-300/10`
- Indicador de progresso: `primary-500` → `secondary-600`

## Mapeamento de Tipos (essence-onboarding.ts)

### EMOTIONAL_STATES

- **Serena**: `success-50` → `maternity-nature-50`
- **Sobrecarregada**: `neutral-50` → `neutral-100`
- **Exausta**: `warning-50` → `error-50`
- **Inspirada**: `accent-50` → `maternity-skin-50`

### DESIRE_OPTIONS

- **Descanso**: `accent-50` → `secondary-50`
- **Orientação**: `warning-50` → `maternity-skin-50`
- **Fé**: `secondary-50` → `primary-50`
- **Força**: `error-50` → `primary-100`
- **Renovação**: `primary-50` → `maternity-baby-100`

### FEMININE_ARCHETYPES

- **Mãe Guerreira**: `error-50` → `primary-100`
- **Mãe Resiliente**: `secondary-50` → `maternity-baby-100`
- **Mãe Visionária**: `accent-50` → `maternity-nature-100`
- **Mãe Cuidadora**: `success-50` → `maternity-nature-100`

## Benefícios da Integração

1. **Consistência Visual**: Uso unificado da paleta de cores em todo o app
2. **Identidade de Marca**: Cores personalizadas refletem a essência maternal
3. **Acessibilidade**: Contrastes adequados para leitura
4. **Manutenibilidade**: Cores centralizadas em `tailwind.config.js`
5. **Tema Dark Mode**: Suporte completo para modo escuro

## Como Usar

### Aplicando Cores em Novos Componentes

```tsx
// Botão primário
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Clique aqui
</button>

// Card maternal
<div className="maternal-card p-6 rounded-2xl">
  Conteúdo do card
</div>

// Gradiente de fundo
<div className="maternal-gradient min-h-screen">
  Conteúdo da página
</div>

// Sombra maternal
<div className="maternal-shadow-lg rounded-xl p-4">
  Elemento com sombra
</div>
```

### Gradientes Personalizados

```tsx
// Gradiente rosa → lavanda
<div className="bg-gradient-to-br from-primary-200 to-secondary-300">
  Gradiente suave
</div>

// Gradiente com cores maternais especiais
<div className="bg-gradient-to-r from-maternity-baby-100 to-maternity-nature-100">
  Gradiente temático
</div>
```

## Referência Rápida

| Elemento           | Classe Principal     | Cores                 |
| ------------------ | -------------------- | --------------------- |
| Botões principais  | `bg-primary-*`       | Rosa acolhedor        |
| Botões secundários | `bg-secondary-*`     | Lavanda               |
| Links e destaques  | `text-accent-*`      | Azul                  |
| Cards              | `.maternal-card`     | Branco/Rosa suave     |
| Fundos             | `.maternal-gradient` | Rosa → Lavanda → Azul |
| Sombras            | `.maternal-shadow*`  | Rosa suave            |
| Ícones             | `.maternal-icon`     | Rosa com sombra       |
| Inputs             | `.maternal-input`    | Borda rosa            |

## Manutenção

Para adicionar ou modificar cores:

1. Edite `tailwind.config.js`
2. Execute `npm run build` para regenerar CSS
3. Teste em modo claro e escuro
4. Verifique contraste para acessibilidade
5. Documente as mudanças aqui

## Recursos

- [Tailwind Config](../tailwind.config.js)
- [CSS Principal](../src/index.css)
- [Tipos de Onboarding](../src/types/essence-onboarding.ts)
- [Componentes de Onboarding](../src/components/onboarding/)
