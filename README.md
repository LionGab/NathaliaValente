# ClubNath - Comunidade Exclusiva de Mães

[![Deploy Status](https://img.shields.io/badge/deploy-netlify-00C7B7?style=for-the-badge&logo=netlify)](https://clubnath.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.11-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **Comunidade exclusiva da Nathália Valente** - 35M+ seguidores, CEO da NAVA, especialista em maternidade consciente

## ?? Sobre o Projeto

O **ClubNath** é uma plataforma PWA (Progressive Web App) desenvolvida para conectar mães através de uma experiência premium, focada em autocuidado, maternidade consciente e produtos exclusivos da marca NAVA.

### ?? Características Principais

- **PWA Otimizado**: Zero fricção de download, instalação direta
- **Mobile-First**: Design responsivo otimizado para smartphones
- **NathIA**: Assistente IA personalizado com memória conversacional
- **Loja Integrada**: Produtos NAVA e BabyTest by OLLIN
- **Fórum Comunitário**: Troca de experiências entre mães
- **Desapega das Mamães**: Marketplace de produtos usados

## ??? Stack Tecnológica

### Frontend
- **React 18.3.1** - Framework principal
- **TypeScript 5.3** - Tipagem estática (strict mode)
- **Vite 7.1.11** - Build tool e dev server
- **Tailwind CSS** - Styling utility-first
- **Lucide React** - Ícones modernos

### Backend & Serviços
- **Supabase** - Backend-as-a-Service
  - Autenticação social
  - Database PostgreSQL
  - Realtime subscriptions
  - Storage de imagens
- **React Query (TanStack)** - Data fetching e cache
- **PWA Vite Plugin** - Service Worker e Manifest

### Qualidade & Performance
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E
- **TypeScript Strict** - Validações rigorosas

## ?? Funcionalidades Implementadas

### ?? **Feed Principal**
- Posts com categorias (Autocuidado, Maternidade Consciente, Bem-estar)
- Sistema de likes e comentários
- Produtos em destaque integrados
- Versículos diários inspiradores
- Design responsivo mobile-first

### ?? **NathIA - Assistente IA**
- **Interface mobile otimizada** com design limpo
- Memória conversacional persistente
- Respostas personalizadas baseadas no contexto
- Suporte a estudos bíblicos e reflexões espirituais
- Sugestões rápidas para dúvidas comuns
- Fallback responses da \ Nath\ em caso de erro

### ??? **Loja Integrada**
- **NAVA Beachwear**: Bikinis exclusivos da Nathália
  - Bikini Premium Nathália (R$ 165,00)
  - Conjunto Bikini Nathy (R$ 165,00)
  - Link direto: [navabeachwear.com.br](https://www.navabeachwear.com.br/)
- **BabyTest by OLLIN**: Teste de triagem neonatal
  - Investigação de 600+ doenças genéticas
  - Timeline visual de quando fazer o teste
  - Link direto: [babytest.com.br](https://www.babytest.com.br/)

### ?? **Sistema de Carrinho**
- **CartContext**: Gerenciamento global de estado
- **ProductDetailModal**: Modal completo com galeria de imagens
- Seleção de tamanhos e cores
- Cálculo automático de totais
- Persistência de dados

### ?? **Fórum Comunitário**
- **6 usuárias com avatares reais** (fotos do Unsplash)
- Posts sobre temas relevantes de maternidade
- Sistema de likes e comentários
- Posts em alta (trending)
- Fallback elegante para avatares

### ??? **Desapega das Mamães**
- Marketplace de produtos usados
- 8 produtos com imagens funcionais
- Sistema de vendedoras com avatares
- Categorias: carrinhos, berços, mamadeiras, etc.
- Preços competitivos

### ?? **Design System**
- **Cores**: Gradientes rosa-roxo-azul
- **Tipografia**: Inter (sans-serif)
- **Componentes**: Button, Card, Modal, Input
- **Animações**: Hover, scale, fade
- **Dark Mode**: Suporte completo

## ?? Instalação e Desenvolvimento

### Pré-requisitos
- Node.js >= 20.19.0
- npm >= 10.0.0

### Instalação
`ash
# Clone o repositório
git clone https://github.com/LionGab/NathaliaValente.git
cd NathaliaValente

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
`

### Scripts Disponíveis
`ash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build

# Qualidade
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier

# Testes
npm run test         # Testes unitários
npm run test:ui      # Interface de testes
npm run test:e2e     # Testes E2E
npm run test:all     # Todos os testes
`

## ??? Arquitetura do Projeto

`
src/
+-- api/                    # React Query hooks
¦   +-- posts/             # usePosts, useLikePost
¦   +-- users/             # useUserProfile
+-- components/
¦   +-- ui/                # Design system
¦   ¦   +-- Button.tsx
¦   ¦   +-- ProductDetailModal.tsx
¦   ¦   +-- OptimizedImage.tsx
¦   +-- FeedPage.tsx       # Página principal
¦   +-- ChatPage.tsx       # NathIA
¦   +-- StorePage.tsx      # Loja integrada
¦   +-- ForumPage.tsx      # Fórum comunitário
¦   +-- ErrorBoundary.tsx  # Error handling
+-- contexts/
¦   +-- AuthContext.tsx    # Autenticação
¦   +-- CartContext.tsx    # Carrinho de compras
¦   +-- ThemeContext.tsx   # Tema dark/light
+-- data/
¦   +-- products.ts        # Dados dos produtos
¦   +-- mockData.ts        # Dados de desenvolvimento
+-- hooks/
¦   +-- useQueries.ts      # React Query hooks
¦   +-- useMockData.ts     # Dados mock
+-- lib/
¦   +-- supabase.ts        # Cliente Supabase
¦   +-- utils.ts           # Utilitários
+-- types/
    +-- products.ts        # TypeScript types
`

## ?? Configurações Importantes

### TypeScript Strict Mode
`json
{
  \noUnusedLocals\: true,
  \noUnusedParameters\: true,
  \strict\: true
}
`

### Vite Build Otimizado
- **Console.logs removidos** em produção
- **Code splitting** automático
- **Compressão Gzip/Brotli**
- **Service Worker** para cache

### PWA Configuration
- **Manifest** completo
- **Icons** em múltiplos tamanhos
- **Offline support**
- **Install prompt**

## ?? Performance e Otimizações

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Otimizações Implementadas
- **Lazy loading** de componentes pesados
- **Image optimization** com fallbacks
- **Code splitting** por rotas
- **React Query** para cache inteligente
- **Service Worker** para cache offline

## ?? Testes

### Cobertura de Testes
- **Unitários**: Vitest + React Testing Library
- **E2E**: Playwright
- **Cobertura mínima**: 80%

### Comandos de Teste
`ash
npm run test:coverage    # Cobertura de testes
npm run test:e2e:ui      # Interface E2E
npm run test:debug       # Debug de testes
`

## ?? Deploy e Produção

### Deploy Automático
- **GitHub Actions** para CI/CD
- **Netlify** para hosting
- **URL de produção**: [clubnath.netlify.app](https://clubnath.netlify.app/)

### Variáveis de Ambiente
`nv
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=production
`

## ?? Roadmap e Próximas Funcionalidades

### ? Implementado (v1.0)
- [x] NathIA mobile otimizada
- [x] Sistema de carrinho funcional
- [x] Modal de produtos detalhado
- [x] Fórum com avatares reais
- [x] Links externos NAVA/BabyTest
- [x] Error boundaries melhorados
- [x] TypeScript strict mode

### ?? Em Desenvolvimento (v1.1)
- [ ] Sistema de notificações push
- [ ] Chat em tempo real no fórum
- [ ] Integração com pagamentos
- [ ] Sistema de avaliações de produtos
- [ ] Modo offline completo

### ?? Planejado (v1.2+)
- [ ] App nativo (React Native)
- [ ] Integração com redes sociais
- [ ] Sistema de gamificação
- [ ] Lives exclusivas da Nath
- [ ] Marketplace expandido

## ?? Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch: git checkout -b feature/nova-funcionalidade
3. Commit suas mudanças: git commit -m 'feat: adiciona nova funcionalidade'
4. Push para a branch: git push origin feature/nova-funcionalidade
5. Abra um Pull Request

### Padrões de Código
- **ESLint** configurado
- **Prettier** para formatação
- **Conventional Commits**
- **TypeScript strict**
- **Testes obrigatórios**

## ?? Suporte e Contato

- **Website**: [clubnath.netlify.app](https://clubnath.netlify.app/)
- **Issues**: [GitHub Issues](https://github.com/LionGab/NathaliaValente/issues)
- **Email**: contato@clubnath.com

## ?? Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ?? Agradecimentos

- **Nathália Valente** - Inspiração e visão do projeto
- **Comunidade de Mães** - Feedback e sugestões
- **Equipe de Desenvolvimento** - Implementação técnica
- **Contribuidores** - Melhorias e correções

---

**Desenvolvido com ?? para a comunidade de mães brasileiras**

*Última atualização: Dezembro 2024*
