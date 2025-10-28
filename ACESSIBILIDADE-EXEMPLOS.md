# 🎨 GUIA PRÁTICO DE CORREÇÕES DE ACESSIBILIDADE
## ClubNath VIP - Exemplos de Código

**Use este guia como referência rápida durante as correções.**

---

## 📑 ÍNDICE

1. [Botões com Ícones](#1-botões-com-ícones)
2. [Motion Buttons](#2-motion-buttons)
3. [Navegação (Tabs)](#3-navegação-tabs)
4. [Modais](#4-modais)
5. [Formulários](#5-formulários)
6. [Imagens](#6-imagens)
7. [Links](#7-links)
8. [Live Regions](#8-live-regions)
9. [Breadcrumbs](#9-breadcrumbs)
10. [Skip Links](#10-skip-links)

---

## 1. Botões com Ícones

### ❌ ERRADO
```tsx
<button onClick={handleClick}>
  <Search className="w-5 h-5" />
</button>
```

### ✅ CORRETO
```tsx
<button
  onClick={handleClick}
  aria-label="Buscar conteúdo"
>
  <Search className="w-5 h-5" aria-hidden="true" />
</button>
```

### 💡 QUANDO USAR

**USE `aria-label` quando:**
- Botão tem APENAS ícone (sem texto visível)
- Ação não é óbvia pela posição

**USE `aria-hidden="true"` quando:**
- Ícone é decorativo (tem texto adjacente)
- Ícone está dentro de botão com `aria-label`

---

## 2. Motion Buttons

### ❌ ERRADO
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  onClick={() => navigate('chat')}
  className="..."
>
  <MessageCircle className="w-6 h-6" />
  <div>
    <h3>NathIA</h3>
    <p>Sua assistente 24/7</p>
  </div>
</motion.button>
```

### ✅ CORRETO - Opção 1 (aria-label)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  onClick={() => navigate('chat')}
  aria-label="Conversar com NathIA, sua assistente disponível 24 horas por dia"
  className="..."
>
  <MessageCircle className="w-6 h-6" aria-hidden="true" />
  <div aria-hidden="true">
    <h3>NathIA</h3>
    <p>Sua assistente 24/7</p>
  </div>
</motion.button>
```

### ✅ CORRETO - Opção 2 (deixar texto visível)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  onClick={() => navigate('chat')}
  className="..."
>
  <MessageCircle className="w-6 h-6" aria-hidden="true" />
  <div>
    <h3>NathIA</h3>
    <p>Sua assistente 24/7</p>
  </div>
</motion.button>
```

**💡 Escolha a Opção 2 quando:** O texto já é descritivo o suficiente.

---

## 3. Navegação (Tabs)

### ❌ ERRADO
```tsx
<div className="flex">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={activeTab === tab.id ? 'active' : ''}
    >
      <Icon />
      <span>{tab.label}</span>
    </button>
  ))}
</div>
```

### ✅ CORRETO
```tsx
<nav aria-label="Navegação principal">
  <div
    role="tablist"
    aria-label="Menu de navegação"
    className="flex"
  >
    {tabs.map(tab => {
      const isActive = activeTab === tab.id;
      const Icon = tab.icon;

      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={isActive}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          tabIndex={isActive ? 0 : -1}
          onClick={() => setActiveTab(tab.id)}
          className={isActive ? 'active' : ''}
        >
          <Icon aria-hidden="true" />
          <span>{tab.label}</span>
        </button>
      );
    })}
  </div>
</nav>

{/* Painel do tab ativo */}
<div
  role="tabpanel"
  id={`${activeTab}-panel`}
  aria-labelledby={`${activeTab}-tab`}
  tabIndex={0}
>
  {/* Conteúdo */}
</div>
```

### 🎹 Navegação por Teclado

Adicionar handler para setas:
```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab);

  if (e.key === 'ArrowRight') {
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
  } else if (e.key === 'ArrowLeft') {
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIndex].id);
  }
};

// Adicionar ao container:
<div role="tablist" onKeyDown={handleKeyDown}>
```

---

## 4. Modais

### ❌ ERRADO
```tsx
<div className="fixed inset-0 bg-black/50 z-50">
  <div className="bg-white rounded-lg p-6">
    <button onClick={onClose}>
      <X />
    </button>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
</div>
```

### ✅ CORRETO
```tsx
import { useEffect, useRef } from 'react';

export const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!isOpen) return;

    // Salvar foco anterior
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focar no modal
    modalRef.current?.focus();

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    // Handler de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (!focusableElements || focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
        className="bg-white rounded-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label={`Fechar modal: ${title}`}
          className="absolute top-4 right-4"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        <h2 id="modal-title" className="text-2xl font-bold mb-4">
          {title}
        </h2>

        <div id="modal-description">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 🎣 Hook Reutilizável

Criar `hooks/useModalAccessibility.ts`:
```tsx
import { useEffect, useRef } from 'react';

export const useModalAccessibility = (isOpen: boolean, onClose: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // ... focus trap logic
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return { modalRef };
};

// Uso:
const { modalRef } = useModalAccessibility(isOpen, onClose);
```

---

## 5. Formulários

### ❌ ERRADO
```tsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Digite seu nome..."
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <button type="submit">Enviar</button>
</form>
```

### ✅ CORRETO
```tsx
<form onSubmit={handleSubmit} aria-label="Formulário de cadastro">
  <label htmlFor="name-input" className="block mb-2">
    Nome completo
  </label>
  <input
    id="name-input"
    type="text"
    placeholder="Ex: Maria Silva"
    value={name}
    onChange={(e) => setName(e.target.value)}
    aria-required="true"
    aria-invalid={!!errors.name}
    aria-describedby="name-hint name-error"
    className="..."
  />
  <span id="name-hint" className="text-sm text-gray-600">
    Informe seu nome completo como está no documento
  </span>
  {errors.name && (
    <span id="name-error" role="alert" className="text-red-600">
      {errors.name}
    </span>
  )}

  <button
    type="submit"
    disabled={loading}
    aria-busy={loading}
  >
    {loading ? 'Enviando...' : 'Enviar'}
  </button>
</form>
```

### 📝 Com Label Visual Oculto

Quando o design não permite label visível:
```tsx
<label htmlFor="search" className="sr-only">
  Buscar conteúdo
</label>
<input
  id="search"
  type="search"
  placeholder="Buscar..."
  aria-label="Campo de busca"
/>
```

```css
/* Adicionar ao CSS global */
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

---

## 6. Imagens

### ❌ ERRADO
```tsx
<img src={product.image} alt={product.name} />
// Alt text genérico
```

### ✅ CORRETO - Produto E-commerce
```tsx
<img
  src={product.image}
  alt="Berço infantil de madeira maciça cor natural com laterais ajustáveis, usado 6 meses, estrutura conservada e estável"
  loading="lazy"
/>
```

### ✅ CORRETO - Imagem Decorativa
```tsx
<img
  src="/decorative-pattern.png"
  alt=""
  role="presentation"
  aria-hidden="true"
/>
```

### ✅ CORRETO - Avatar
```tsx
<img
  src={user.avatar}
  alt={`Foto de perfil de ${user.name}`}
  className="rounded-full"
/>
```

### 🎨 Componente OptimizedImage

```tsx
<OptimizedImage
  src={product.image}
  alt={product.altText || `${product.name} - ${product.condition}`}
  width={300}
  height={300}
  priority={false}
/>
```

### 📋 Regras de Alt Text

| Tipo | Regra | Exemplo |
|------|-------|---------|
| **Produto** | Descrever cor, tamanho, estado | "Carrinho preto Galzerano com capota, usado 8 meses" |
| **Avatar** | Nome da pessoa | "Foto de perfil de Maria Silva" |
| **Ícone funcional** | Ação do botão | (usar aria-label no botão, não no ícone) |
| **Decorativo** | `alt=""` | `<img src="pattern.png" alt="">` |
| **Gráfico/Chart** | Resumo dos dados | "Gráfico de barras mostrando 70% de satisfação" |

---

## 7. Links

### ❌ ERRADO
```tsx
<a href="/loja">Clique aqui</a>

<a href="/produto/123">
  <img src="produto.jpg" />
</a>
```

### ✅ CORRETO
```tsx
<a href="/loja" aria-label="Ver produtos da loja">
  Clique aqui
</a>

<a href="/produto/123" aria-label="Ver detalhes do Berço de Madeira Maciça">
  <img src="produto.jpg" alt="Berço de Madeira Maciça" />
</a>
```

### 🔗 Link que Abre em Nova Aba
```tsx
<a
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visitar site externo (abre em nova aba)"
>
  Saiba mais
  <ExternalLink className="w-4 h-4" aria-hidden="true" />
</a>
```

---

## 8. Live Regions

### Chat - Anunciar Novas Mensagens

```tsx
export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveRegionMessage, setLiveRegionMessage] = useState('');

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && !lastMessage.isUser) {
      // Anunciar nova mensagem da IA
      const announcement = `Nova mensagem da NathIA: ${lastMessage.text.substring(0, 50)}`;
      setLiveRegionMessage(announcement);

      // Limpar após 1 segundo
      setTimeout(() => setLiveRegionMessage(''), 1000);
    }
  }, [messages]);

  return (
    <div>
      {/* Live region - invisível mas lido por leitores de tela */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegionMessage}
      </div>

      {/* Chat UI normal */}
      <div className="messages">
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>
    </div>
  );
};
```

### Notificações

```tsx
export const NotificationBadge = () => {
  const [count, setCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (count > 0) {
      setAnnouncement(`Você tem ${count} ${count === 1 ? 'notificação nova' : 'notificações novas'}`);
      setTimeout(() => setAnnouncement(''), 1000);
    }
  }, [count]);

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <button aria-label={`Notificações. ${count > 0 ? `${count} novas` : 'Nenhuma nova'}`}>
        <Bell aria-hidden="true" />
        {count > 0 && (
          <span className="badge" aria-hidden="true">
            {count}
          </span>
        )}
      </button>
    </>
  );
};
```

### Erros de Formulário

```tsx
const [error, setError] = useState('');

return (
  <form>
    {error && (
      <div
        role="alert"
        aria-live="assertive"
        className="error-message"
      >
        {error}
      </div>
    )}
  </form>
);
```

---

## 9. Breadcrumbs

### ❌ ERRADO
```tsx
<div className="flex gap-2">
  <span>Loja</span>
  <span>›</span>
  <span>Produtos</span>
  <span>›</span>
  <span>Berço</span>
</div>
```

### ✅ CORRETO
```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex gap-2 items-center">
    <li>
      <a href="/loja" className="hover:underline">
        Loja
      </a>
    </li>
    <li aria-hidden="true">›</li>
    <li>
      <a href="/loja/produtos" className="hover:underline">
        Produtos
      </a>
    </li>
    <li aria-hidden="true">›</li>
    <li>
      <span aria-current="page" className="font-semibold">
        Berço
      </span>
    </li>
  </ol>
</nav>
```

---

## 10. Skip Links

Adicionar ao `App.tsx`:

```tsx
export default function App() {
  return (
    <>
      {/* Skip Links - primeiro elemento do DOM */}
      <a href="#main-content" className="skip-link">
        Pular para conteúdo principal
      </a>
      <a href="#main-nav" className="skip-link">
        Pular para navegação
      </a>

      <Header />

      <nav id="main-nav">
        {/* Navegação */}
      </nav>

      <main id="main-content" tabIndex={-1}>
        {/* Conteúdo principal */}
      </main>

      <Footer />
    </>
  );
}
```

CSS para skip links:
```css
/* src/index.css */
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

## 🎯 ATALHOS ÚTEIS

### VSCode Find & Replace

```regex
# Buscar motion.button sem aria-label
<motion\.button(?!.*aria-label)

# Buscar ícones sem aria-hidden
<(Home|Search|Bell|Heart|MessageCircle|User|Plus|Menu|Star|Users|Trophy|Flame)\s+className=(?!.*aria-hidden)

# Buscar inputs sem label
<input(?!.*aria-label)(?!.*id=)

# Buscar imagens sem alt
<img(?!.*alt=)
```

### Scripts Bash

```bash
# Contar problemas por tipo
echo "Motion buttons sem label:"
grep -r "motion.button" src/ -A 5 | grep -v "aria-label" | wc -l

echo "Ícones sem aria-hidden:"
grep -r "lucide-react" src/ | wc -l

echo "Inputs sem label:"
grep -r "<input" src/ | grep -v "aria-label" | wc -l
```

---

## 📚 RECURSOS RÁPIDOS

| Recurso | Link |
|---------|------|
| **WCAG Checklist** | https://www.w3.org/WAI/WCAG21/quickref/ |
| **ARIA Patterns** | https://www.w3.org/WAI/ARIA/apg/patterns/ |
| **Contrast Checker** | https://webaim.org/resources/contrastchecker/ |
| **NVDA (leitor de tela)** | https://www.nvaccess.org/download/ |
| **axe DevTools** | https://www.deque.com/axe/devtools/ |

---

## ✅ CHECKLIST ANTES DO PR

- [ ] Executei `npm run check:a11y`
- [ ] Testei com Tab (navegação por teclado)
- [ ] Testei com NVDA ou VoiceOver
- [ ] Verifiquei contraste de cores
- [ ] Todos os botões têm labels
- [ ] Todos os inputs têm labels
- [ ] Todas as imagens têm alt text
- [ ] Modais têm role="dialog"
- [ ] Ícones decorativos têm aria-hidden

---

**Dúvidas?** Consulte [ACESSIBILIDADE-AUDIT.md](./ACESSIBILIDADE-AUDIT.md) ou [ACESSIBILIDADE-CHECKLIST.md](./ACESSIBILIDADE-CHECKLIST.md)
