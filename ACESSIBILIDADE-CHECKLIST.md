# ✅ CHECKLIST DE CORREÇÕES DE ACESSIBILIDADE
## ClubNath VIP - Plano de Ação Priorizado

**Data de Criação:** 27 de Outubro de 2025
**Responsável:** Equipe de Desenvolvimento
**Meta:** 100% de conformidade WCAG 2.1 AA
**Prazo:** 30 dias

---

## 📊 DASHBOARD DE PROGRESSO

| Prioridade | Total | Concluído | Pendente | % |
|------------|-------|-----------|----------|---|
| 🚨 **CRÍTICA** | 27 | 0 | 27 | 0% |
| ⚠️ **ALTA** | 15 | 0 | 15 | 0% |
| 🔵 **MÉDIA** | 8 | 0 | 8 | 0% |
| **TOTAL** | **50** | **0** | **50** | **0%** |

**Última Atualização:** 27/10/2025

---

## 🚨 PRIORIDADE CRÍTICA (Semana 1)

### ✅ TASK 1: Corrigir OptimizedBottomNav

**Arquivo:** `src/components/navigation/OptimizedBottomNav.tsx`
**Linhas:** 121-224
**Tempo Estimado:** 45 minutos
**Impacto:** 🔴 CRÍTICO - Navegação principal inacessível

**Problemas:**
- [ ] 9 botões sem `aria-label`
- [ ] Navegação de tabs sem `role="tablist"`
- [ ] Ícones sem `aria-hidden="true"`
- [ ] Indicador de notificação sem semântica

**Correção:**

```tsx
// ANTES (❌):
<button onClick={onSearch} className="...">
  <Search className="w-5 h-5" />
</button>

// DEPOIS (✅):
<button
  onClick={onSearch}
  aria-label="Buscar conteúdo"
  className="..."
>
  <Search className="w-5 h-5" aria-hidden="true" />
</button>
```

**Checklist de Verificação:**
- [ ] Adicionar `aria-label` em botão de Busca
- [ ] Adicionar `aria-label` em botão de Notificações
- [ ] Adicionar `aria-describedby` no badge de notificação
- [ ] Adicionar `aria-label` em botão Criar Post
- [ ] Adicionar `aria-label` em botão Menu
- [ ] Adicionar `aria-label` em botão Favoritos
- [ ] Adicionar `role="tablist"` na navegação de tabs
- [ ] Adicionar `role="tab"` em cada tab
- [ ] Adicionar `aria-selected` nos tabs (true/false)
- [ ] Adicionar `tabIndex={isActive ? 0 : -1}` em tabs inativos
- [ ] Adicionar `aria-hidden="true"` em TODOS os ícones
- [ ] Testar navegação por Tab (keyboard)
- [ ] Testar com leitor de tela (NVDA)

**Comando de teste:**
```bash
npm run check:a11y | grep "OptimizedBottomNav"
```

---

### ✅ TASK 2: Adicionar aria-label em motion.button (HomePage)

**Arquivo:** `src/features/home/screens/HomePage.tsx`
**Linhas:** Múltiplas (208, 232, etc.)
**Tempo Estimado:** 30 minutos
**Impacto:** 🔴 CRÍTICO - CTAs principais inacessíveis

**Problemas:**
- [ ] 6 `motion.button` sem `aria-label`
- [ ] Ícones decorativos sem `aria-hidden`

**Exemplo de Correção:**

```tsx
// ANTES (❌):
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => handleQuickAction('nathia')}
  className="..."
>
  <MessageCircle className="w-6 h-6" />
  <h3>NathIA</h3>
  <p>Sua assistente 24/7</p>
</motion.button>

// DEPOIS (✅):
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => handleQuickAction('nathia')}
  aria-label="Conversar com NathIA, sua assistente disponível 24 horas"
  className="..."
>
  <MessageCircle className="w-6 h-6" aria-hidden="true" />
  <h3 aria-hidden="true">NathIA</h3>
  <p aria-hidden="true">Sua assistente 24/7</p>
</motion.button>
```

**Checklist por Botão:**

- [ ] **NathIA Button** (linha ~208)
  - Adicionar: `aria-label="Conversar com NathIA, sua assistente disponível 24 horas"`
  - Adicionar `aria-hidden="true"` no ícone MessageCircle

- [ ] **Comunidade Button** (linha ~232)
  - Adicionar: `aria-label="Acessar comunidade de mães, 15 mil posts hoje"`
  - Adicionar `aria-hidden="true"` no ícone Users

- [ ] **Ferramentas Buttons** (linhas ~492-567, 4 botões)
  - Amamentação: `aria-label="Ferramentas de amamentação com cronômetro e dicas"`
  - Sono do Bebê: `aria-label="Acompanhar sono e cochilos do bebê"`
  - Refeições: `aria-label="Planejamento de cardápio e refeições"`
  - Bem-estar: `aria-label="Ferramentas de bem-estar para cuidar de você"`

- [ ] **FAB NathIA** (linha ~594)
  - Adicionar: `aria-label="Conversar com NathIA - Botão de ação flutuante"`

**Comando de verificação:**
```bash
grep -n "motion.button" src/features/home/screens/HomePage.tsx | wc -l
# Deve retornar 0 após correções quando combinado com grep "aria-label"
```

---

### ✅ TASK 3: Adicionar aria-label em motion.button (HomePageSimple)

**Arquivo:** `src/features/home/screens/HomePageSimple.tsx`
**Linhas:** Múltiplas
**Tempo Estimado:** 30 minutos
**Impacto:** 🔴 CRÍTICO - Home alternativa inacessível

**Problemas:**
- [ ] 8 `motion.button` sem `aria-label`

**Botões a Corrigir:**

1. **Botão Favorite** (linha ~156)
```tsx
<motion.button
  aria-label="Adicionar aos favoritos"
  className="..."
>
  <Heart className="w-5 h-5" aria-hidden="true" />
</motion.button>
```

2. **Quick Actions** (verificar todas as ocorrências)
- [ ] Buscar padrão e aplicar correção similar ao Task 2

**Comando:**
```bash
node scripts/check-accessibility.cjs | grep "HomePageSimple"
```

---

### ✅ TASK 4: Corrigir Modais (CelebrationModal)

**Arquivo:** `src/components/ui/CelebrationModal.tsx`
**Linhas:** 68-90
**Tempo Estimado:** 45 minutos
**Impacto:** 🔴 CRÍTICO - Modais inacessíveis

**Problemas:**
- [ ] Sem `role="dialog"`
- [ ] Sem `aria-modal="true"`
- [ ] Sem `aria-labelledby`
- [ ] Sem `aria-describedby"`
- [ ] Botão fechar sem `aria-label`
- [ ] Foco não gerenciado

**Correção Completa:**

```tsx
import React, { useEffect, useRef } from 'react';

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  reward
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Gerenciar foco
  useEffect(() => {
    if (isOpen) {
      // Salvar elemento focado anteriormente
      const previouslyFocused = document.activeElement as HTMLElement;

      // Focar no modal
      modalRef.current?.focus();

      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';

      // Handler de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        // Trap focus dentro do modal
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previouslyFocused?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        role="presentation"
        aria-hidden="true"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
          aria-describedby="celebration-description"
          tabIndex={-1}
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            aria-label="Fechar modal de celebração"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Ícone */}
          <div className="flex justify-center mb-4" aria-hidden="true">
            {getIcon()}
          </div>

          {/* Título */}
          <h2
            id="celebration-title"
            className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4"
          >
            {title}
          </h2>

          {/* Mensagem */}
          <p
            id="celebration-description"
            className="text-gray-600 dark:text-gray-300 text-center mb-6"
          >
            {message}
          </p>

          {/* Recompensa */}
          {reward && (
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-center font-bold"
              role="status"
              aria-label={`Você ganhou ${reward}`}
            >
              {reward}
            </div>
          )}

          {/* Botão de Ação */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-colors"
            autoFocus
          >
            Continuar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

**Checklist de Verificação:**
- [ ] Adicionar `role="dialog"` e `aria-modal="true"`
- [ ] Adicionar `aria-labelledby` apontando para o título
- [ ] Adicionar `aria-describedby` apontando para descrição
- [ ] Adicionar `aria-label` no botão fechar
- [ ] Implementar focus trap (Tab não sai do modal)
- [ ] ESC fecha o modal
- [ ] Foco retorna ao elemento anterior ao fechar
- [ ] Testar navegação por Tab
- [ ] Testar com NVDA

---

### ✅ TASK 5: Corrigir Outros Modais

**Arquivos:**
- `src/components/CreatePostModal.tsx`
- `src/components/CreateRoutineModal.tsx`
- `src/components/journaling/CreateJournalModal.tsx`
- `src/components/prayers/CreatePrayerModal.tsx`
- `src/components/groups/CreateGroupModal.tsx`
- `src/components/ui/ProductDetailModal.tsx`

**Tempo Estimado:** 2 horas (20min por modal)
**Impacto:** 🔴 CRÍTICO

**Estratégia:**
1. Copiar a implementação de CelebrationModal (Task 4)
2. Adaptar para cada modal específico
3. Garantir consistência em todos

**Template Reutilizável:**
```tsx
// hooks/useModalAccessibility.ts
export const useModalAccessibility = (isOpen: boolean, onClose: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement;
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();

      // Focus trap logic...
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return { modalRef };
};
```

**Checklist por Modal:**
- [ ] CreatePostModal
- [ ] CreateRoutineModal
- [ ] CreateJournalModal
- [ ] CreatePrayerModal
- [ ] CreateGroupModal
- [ ] ProductDetailModal

---

### ✅ TASK 6: Corrigir Formulário de Chat

**Arquivo:** `src/features/chat/screens/ChatPage.tsx`
**Linhas:** ~115-180
**Tempo Estimado:** 30 minutos
**Impacto:** 🔴 CRÍTICO - Chat principal inacessível

**Problemas:**
- [ ] Input sem `<label>` associado
- [ ] Botão enviar sem `aria-label`
- [ ] Placeholder não substitui label

**Correção:**

```tsx
{/* ANTES (❌) */}
<form onSubmit={handleSubmit} className="...">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Digite sua mensagem..."
    className="..."
  />
  <button type="submit" disabled={loading}>
    <Send className="w-5 h-5" />
  </button>
</form>

{/* DEPOIS (✅) */}
<form
  onSubmit={handleSubmit}
  className="..."
  aria-label="Formulário de envio de mensagem"
>
  <label htmlFor="chat-input" className="sr-only">
    Digite sua mensagem para NathIA
  </label>
  <input
    id="chat-input"
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Digite sua mensagem..."
    aria-label="Campo de mensagem"
    aria-describedby="chat-hint"
    disabled={loading}
    className="..."
  />
  <span id="chat-hint" className="sr-only">
    Pressione Enter ou clique em enviar para mandar a mensagem
  </span>
  <button
    type="submit"
    disabled={!newMessage.trim() || loading}
    aria-label={loading ? "Enviando mensagem..." : "Enviar mensagem"}
  >
    {loading ? (
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
    ) : (
      <Send className="w-5 h-5" aria-hidden="true" />
    )}
  </button>
</form>
```

**Adicionar CSS .sr-only:**
```css
/* src/index.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Checklist:**
- [ ] Adicionar classe `.sr-only` ao CSS global
- [ ] Adicionar `<label>` com `.sr-only`
- [ ] Associar label ao input com `id` e `htmlFor`
- [ ] Adicionar `aria-label` ao botão enviar
- [ ] Adicionar `aria-describedby` com hint de uso
- [ ] Estado de loading acessível
- [ ] Testar com leitor de tela

---

## ⚠️ PRIORIDADE ALTA (Semana 2)

### ✅ TASK 7: Adicionar aria-hidden em Ícones Decorativos

**Escopo:** Todo o projeto
**Tempo Estimado:** 3-4 horas
**Impacto:** ⚠️ ALTA - 260+ ícones poluindo leitores de tela

**Estratégia:**

1. **Identificar Padrões:**
```bash
# Buscar todos os imports de lucide-react
grep -r "from 'lucide-react'" src/ | cut -d: -f1 | sort | uniq
```

2. **Aplicar Correção em Massa:**
```bash
# Usar find and replace com regex no VSCode
# Buscar: <(Home|Search|Bell|Heart|MessageCircle|User|Plus|Menu|Star) className=
# Substituir: <$1 className= aria-hidden="true"
```

3. **Exceções (NÃO adicionar aria-hidden):**
   - Ícones que são único identificador visual
   - Ícones sem texto adjacente
   - Ícones em botões sem aria-label

**Componentes Prioritários:**
- [ ] OptimizedBottomNav.tsx (9 ícones)
- [ ] HomePage.tsx (15+ ícones)
- [ ] HomePageSimple.tsx (12+ ícones)
- [ ] Header.tsx (3 ícones)
- [ ] StorePage.tsx (10+ ícones)

**Template de Correção:**
```tsx
// ANTES:
<Search className="w-5 h-5" />

// DEPOIS:
<Search className="w-5 h-5" aria-hidden="true" />
```

**Validação:**
```bash
npm run check:a11y | grep "decorativeIcons"
# Meta: 0 ocorrências
```

---

### ✅ TASK 8: Criar Alt Text Descritivo para Produtos

**Arquivo:** `src/features/store/screens/StorePage.tsx`
**Linhas:** 6-74
**Tempo Estimado:** 1 hora
**Impacto:** ⚠️ ALTA - E-commerce inacessível

**Problemas:**
- [ ] 6 produtos sem alt text descritivo
- [ ] Alt text genérico (apenas nome)

**Correção:**

```tsx
const desapegaProducts = [
  {
    id: 1,
    name: 'Berço de Madeira Maciça',
    price: 'R$ 450,00',
    originalPrice: 'R$ 800,00',
    image: 'https://i.imgur.com/pElL8zD.jpg',
    // ✅ ADICIONAR:
    altText: 'Berço infantil de madeira maciça cor natural com laterais fixas, usado por 6 meses, estrutura bem conservada e estável',
    author: 'Ana S.',
    avatar: 'AS',
    backgroundColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
    condition: 'Usado 6 meses, conservado'
  },
  {
    id: 2,
    name: 'Bebê Conforto Premium',
    price: 'R$ 320,00',
    originalPrice: 'R$ 600,00',
    image: 'https://i.imgur.com/gxOThQR.jpg',
    // ✅ ADICIONAR:
    altText: 'Bebê conforto modelo premium na cor preta com almofadas cinza, suporte ajustável para cabeça, indicado para crianças até 13kg, estado conservado',
    author: 'Mariana L.',
    avatar: 'ML',
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    condition: 'Até 13kg, conservado'
  },
  {
    id: 3,
    name: 'Carrinho Galzerano Preto',
    price: 'R$ 450,00',
    originalPrice: 'R$ 800,00',
    image: 'https://i.imgur.com/DLPkytI.jpg',
    // ✅ ADICIONAR:
    altText: 'Carrinho de bebê Galzerano modelo completo na cor preta, com capota protetora, cesto para compras embaixo, usado 8 meses em excelente estado',
    author: 'Julia C.',
    avatar: 'JC',
    backgroundColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
    condition: 'Usado 8 meses, excelente estado'
  },
  {
    id: 4,
    name: 'Ergo Baby Carrier',
    price: 'R$ 180,00',
    originalPrice: 'R$ 300,00',
    image: 'https://i.imgur.com/6AOi9vY.jpg',
    // ✅ ADICIONAR:
    altText: 'Canguru ergonômico Ergo Baby Carrier na cor cinza com detalhes em roxo, modelo com suporte lombar, usado poucas vezes e bem limpo',
    author: 'Carla D.',
    avatar: 'CD',
    backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
    condition: 'Pouco usado, limpo'
  },
  {
    id: 5,
    name: 'Enxoval de Berço Completo',
    price: 'R$ 280,00',
    originalPrice: 'R$ 450,00',
    image: 'https://i.imgur.com/76haTca.jpg',
    // ✅ ADICIONAR:
    altText: 'Conjunto completo de enxoval para berço incluindo lençol, fronha, protetor e edredom nas cores bege e branco com detalhes bordados, produto novo ainda lacrado',
    author: 'Patricia M.',
    avatar: 'PM',
    backgroundColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
    condition: 'Novo, lacrado'
  },
  {
    id: 6,
    name: 'Kit Baby o Boticário',
    price: 'R$ 120,00',
    originalPrice: 'R$ 200,00',
    image: 'https://i.imgur.com/tf0GHwz.jpg',
    // ✅ ADICIONAR:
    altText: 'Kit de higiene infantil O Boticário Baby contendo shampoo, condicionador, sabonete líquido e loção hidratante, frascos brancos e azuis, usado 3 meses com mais da metade do produto',
    author: 'Fernanda R.',
    avatar: 'FR',
    backgroundColor: 'bg-gradient-to-br from-rose-50 to-pink-100',
    condition: 'Usado 3 meses, conservado'
  },
];
```

**Renderização:**
```tsx
<OptimizedImage
  src={product.image}
  alt={product.altText}
  className="..."
/>
```

**Regras para Alt Text de E-commerce:**
1. ✅ Descrever cor, tamanho, formato
2. ✅ Mencionar marca se visível
3. ✅ Estado do produto (novo, usado X meses)
4. ✅ Características únicas visíveis
5. ❌ NÃO incluir preço ou promoção (está no contexto)
6. ❌ NÃO usar "imagem de..." ou "foto de..."

**Checklist:**
- [ ] Adicionar campo `altText` em todos os 6 produtos
- [ ] Atualizar componente de renderização para usar `altText`
- [ ] Testar com leitor de tela
- [ ] Validar com equipe de marketing

---

### ✅ TASK 9: Corrigir Breadcrumbs da StorePage

**Arquivo:** `src/features/store/screens/StorePage.tsx`
**Linhas:** 78-87
**Tempo Estimado:** 20 minutos
**Impacto:** ⚠️ ALTA

**Correção aplicar da seção 10 do AUDIT:**
```tsx
<nav aria-label="Breadcrumb" className="mb-4">
  <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <li>
      <a href="/loja" className="hover:text-pink-600 cursor-pointer">
        Loja
      </a>
    </li>
    <li aria-hidden="true">•</li>
    <li>
      <span className="text-pink-600 font-medium" aria-current="page">
        Acessórios
      </span>
    </li>
    {/* ... resto dos breadcrumbs */}
  </ol>
</nav>
```

---

## 🔵 PRIORIDADE MÉDIA (Semana 3-4)

### ✅ TASK 10: Implementar Live Regions

**Arquivos:**
- `src/features/chat/screens/ChatPage.tsx`
- `src/components/navigation/OptimizedBottomNav.tsx` (notificações)

**Tempo Estimado:** 1 hora
**Impacto:** 🔵 MÉDIA

**Implementação:**
```tsx
// ChatPage.tsx
const [liveRegionMessage, setLiveRegionMessage] = useState('');

useEffect(() => {
  if (newAIMessage) {
    setLiveRegionMessage(`Nova mensagem da NathIA: ${newAIMessage.substring(0, 50)}...`);
    setTimeout(() => setLiveRegionMessage(''), 1000);
  }
}, [newAIMessage]);

return (
  <div>
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {liveRegionMessage}
    </div>
    {/* Resto do chat */}
  </div>
);
```

**Checklist:**
- [ ] ChatPage - anunciar novas mensagens
- [ ] BottomNav - anunciar novas notificações
- [ ] Formulários - anunciar erros de validação

---

### ✅ TASK 11: Adicionar Skip Links

**Arquivo:** `src/App.tsx`
**Tempo Estimado:** 30 minutos
**Impacto:** 🔵 MÉDIA

**Implementação:**
```tsx
// App.tsx
<div>
  <a href="#main-content" className="skip-link">
    Pular para conteúdo principal
  </a>

  <Header />

  <main id="main-content" tabIndex={-1}>
    {/* Conteúdo */}
  </main>

  <OptimizedBottomNav />
</div>
```

```css
/* index.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #ec4899;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}
```

---

### ✅ TASK 12: Verificar Contraste de Cores

**Ferramenta:** https://webaim.org/resources/contrastchecker/
**Tempo Estimado:** 2 horas
**Impacto:** 🔵 MÉDIA

**Áreas Críticas:**
- [ ] Texto cinza em fundo branco
- [ ] Links em hover
- [ ] Placeholders de inputs
- [ ] Badges e tags
- [ ] Textos em gradientes

**Critério:** Mínimo 4.5:1 para texto normal, 3:1 para texto grande (>18px)

**Checklist:**
- [ ] Auditar todas as cores do Tailwind CSS usadas
- [ ] Criar tabela de contraste
- [ ] Ajustar cores que não passam
- [ ] Documentar paleta acessível

---

## 🔧 FERRAMENTAS E VALIDAÇÃO

### Comandos de Teste

```bash
# 1. Executar validação automatizada
npm run check:a11y

# 2. Executar Lighthouse
npm run build
npm run preview
# Abrir DevTools > Lighthouse > Accessibility

# 3. Validar HTML
# https://validator.w3.org/

# 4. Testar com leitor de tela
# NVDA (Windows): https://www.nvaccess.org/download/
# VoiceOver (Mac): Cmd+F5
```

### Checklist de Teste Manual

- [ ] **Navegação por Teclado**
  - Tab percorre todos os elementos interativos
  - Enter ativa botões e links
  - Esc fecha modais
  - Setas navegam em tabs/listas
  - Foco sempre visível

- [ ] **Leitor de Tela (NVDA/VoiceOver)**
  - Todos os botões têm labels
  - Imagens têm alt text descritivo
  - Formulários têm labels associados
  - Modais são anunciados corretamente
  - Live regions funcionam

- [ ] **Zoom**
  - Testar 200% zoom sem quebra de layout
  - Testar 400% zoom (mobile)

- [ ] **Contraste**
  - Todos os textos legíveis
  - Estados de foco visíveis

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Meta | Atual | Status |
|---------|------|-------|--------|
| **Lighthouse Accessibility** | >95 | ? | ⏳ |
| **axe DevTools Errors** | 0 | ? | ⏳ |
| **WCAG 2.1 AA Conformidade** | 100% | 42% | ❌ |
| **Navegação por Teclado** | 100% | ? | ⏳ |
| **Leitor de Tela** | Sem bloqueadores | ? | ⏳ |

---

## 🚀 PLANO DE EXECUÇÃO

### Semana 1 (27/10 - 03/11)
- [ ] Tasks 1-6 (Prioridade CRÍTICA)
- [ ] Executar `npm run check:a11y` diariamente
- [ ] PR: "fix(a11y): Correções críticas de acessibilidade"

### Semana 2 (04/11 - 10/11)
- [ ] Tasks 7-9 (Prioridade ALTA)
- [ ] Lighthouse audit
- [ ] PR: "fix(a11y): Ícones, formulários e alt text"

### Semana 3-4 (11/11 - 24/11)
- [ ] Tasks 10-12 (Prioridade MÉDIA)
- [ ] Testes com usuários
- [ ] Documentação final
- [ ] PR: "feat(a11y): Live regions e melhorias finais"

---

## 👥 RESPONSABILIDADES

| Tarefa | Responsável | Revisor | Prazo |
|--------|-------------|---------|-------|
| Task 1-3 | Dev 1 | Dev 2 | 01/11 |
| Task 4-5 | Dev 2 | Dev 1 | 02/11 |
| Task 6 | Dev 3 | Dev 1 | 03/11 |
| Task 7 | Todos | Tech Lead | 08/11 |
| Task 8-9 | Designer + Dev | Tech Lead | 10/11 |
| Task 10-12 | Dev 1 | QA | 24/11 |

---

## 📝 NOTAS

- Fazer PRs pequenos (1-2 tasks por PR)
- Sempre incluir testes manuais
- Documentar decisões no PR
- Usar o script `check-accessibility.cjs` antes de commitar
- Pedir review de alguém que testou com leitor de tela

---

**Última Atualização:** 27/10/2025
**Próxima Revisão:** 10/11/2025
