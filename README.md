# ClubNath - Comunidade Exclusiva de M�es

[![Deploy Status](https://img.shields.io/badge/deploy-netlify-00C7B7?style=for-the-badge&logo=netlify)](https://clubnath.netlify.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.11-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **Comunidade exclusiva da Nath�lia Valente** - 35M+ seguidores, CEO da NAVA, especialista em maternidade consciente

## ?? Sobre o Projeto

O **ClubNath** � uma plataforma PWA (Progressive Web App) desenvolvida para conectar m�es atrav�s de uma experi�ncia premium, focada em autocuidado, maternidade consciente e produtos exclusivos da marca NAVA.

### ?? Caracter�sticas Principais

- **PWA Otimizado**: Zero fric��o de download, instala��o direta
- **Mobile-First**: Design responsivo otimizado para smartphones
- **NathIA**: Assistente IA personalizado com mem�ria conversacional
- **Loja Integrada**: Produtos NAVA e BabyTest by OLLIN
- **F�rum Comunit�rio**: Troca de experi�ncias entre m�es
- **Desapega das Mam�es**: Marketplace de produtos usados

## ??? Stack Tecnol�gica

### Frontend
- **React 18.3.1** - Framework principal
- **TypeScript 5.3** - Tipagem est�tica (strict mode)
- **Vite 7.1.11** - Build tool e dev server
- **Tailwind CSS** - Styling utility-first
- **Lucide React** - �cones modernos

### Backend & Servi�os
- **Supabase** - Backend-as-a-Service
  - Autentica��o social
  - Database PostgreSQL
  - Realtime subscriptions
  - Storage de imagens
- **React Query (TanStack)** - Data fetching e cache
- **PWA Vite Plugin** - Service Worker e Manifest

### Qualidade & Performance
- **ESLint** - Linting de c�digo
- **Prettier** - Formata��o autom�tica
- **Vitest** - Testes unit�rios
- **Playwright** - Testes E2E
- **TypeScript Strict** - Valida��es rigorosas

## ?? Funcionalidades Implementadas

### ?? **Feed Principal**
- Posts com categorias (Autocuidado, Maternidade Consciente, Bem-estar)
- Sistema de likes e coment�rios
- Produtos em destaque integrados
- Vers�culos di�rios inspiradores
- Design responsivo mobile-first

### ?? **NathIA - Assistente IA**
- **Interface mobile otimizada** com design limpo
- Mem�ria conversacional persistente
- Respostas personalizadas baseadas no contexto
- Suporte a estudos b�blicos e reflex�es espirituais
- Sugest�es r�pidas para d�vidas comuns
- Fallback responses da \ Nath\ em caso de erro

### ??? **Loja Integrada**
- **NAVA Beachwear**: Bikinis exclusivos da Nath�lia
  - Bikini Premium Nath�lia (R$ 165,00)
  - Conjunto Bikini Nathy (R$ 165,00)
  - Link direto: [navabeachwear.com.br](https://www.navabeachwear.com.br/)
- **BabyTest by OLLIN**: Teste de triagem neonatal
  - Investiga��o de 600+ doen�as gen�ticas
  - Timeline visual de quando fazer o teste
  - Link direto: [babytest.com.br](https://www.babytest.com.br/)

### ?? **Sistema de Carrinho**
- **CartContext**: Gerenciamento global de estado
- **ProductDetailModal**: Modal completo com galeria de imagens
- Sele��o de tamanhos e cores
- C�lculo autom�tico de totais
- Persist�ncia de dados

### ?? **F�rum Comunit�rio**
- **6 usu�rias com avatares reais** (fotos do Unsplash)
- Posts sobre temas relevantes de maternidade
- Sistema de likes e coment�rios
- Posts em alta (trending)
- Fallback elegante para avatares

### ??? **Desapega das Mam�es**
- Marketplace de produtos usados
- 8 produtos com imagens funcionais
- Sistema de vendedoras com avatares
- Categorias: carrinhos, ber�os, mamadeiras, etc.
- Pre�os competitivos

### ?? **Design System**
- **Cores**: Gradientes rosa-roxo-azul
- **Tipografia**: Inter (sans-serif)
- **Componentes**: Button, Card, Modal, Input
- **Anima��es**: Hover, scale, fade
- **Dark Mode**: Suporte completo

## ?? Instala��o e Desenvolvimento

### Pr�-requisitos
- Node.js >= 20.19.0
- npm >= 10.0.0

### Instala��o
`ash
# Clone o reposit�rio
git clone https://github.com/LionGab/NathaliaValente.git
cd NathaliaValente

# Instale as depend�ncias
npm install

# Configure as vari�veis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
`

### Scripts Dispon�veis
`ash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produ��o
npm run preview      # Preview do build

# Qualidade
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier

# Testes
npm run test         # Testes unit�rios
npm run test:ui      # Interface de testes
npm run test:e2e     # Testes E2E
npm run test:all     # Todos os testes
`

## ??? Arquitetura do Projeto

`
src/
+-- api/                    # React Query hooks
�   +-- posts/             # usePosts, useLikePost
�   +-- users/             # useUserProfile
+-- components/
�   +-- ui/                # Design system
�   �   +-- Button.tsx
�   �   +-- ProductDetailModal.tsx
�   �   +-- OptimizedImage.tsx
�   +-- FeedPage.tsx       # P�gina principal
�   +-- ChatPage.tsx       # NathIA
�   +-- StorePage.tsx      # Loja integrada
�   +-- ForumPage.tsx      # F�rum comunit�rio
�   +-- ErrorBoundary.tsx  # Error handling
+-- contexts/
�   +-- AuthContext.tsx    # Autentica��o
�   +-- CartContext.tsx    # Carrinho de compras
�   +-- ThemeContext.tsx   # Tema dark/light
+-- data/
�   +-- products.ts        # Dados dos produtos
�   +-- mockData.ts        # Dados de desenvolvimento
+-- hooks/
�   +-- useQueries.ts      # React Query hooks
�   +-- useMockData.ts     # Dados mock
+-- lib/
�   +-- supabase.ts        # Cliente Supabase
�   +-- utils.ts           # Utilit�rios
+-- types/
    +-- products.ts        # TypeScript types
`

## ?? Configura��es Importantes

### TypeScript Strict Mode
`json
{
  \noUnusedLocals\: true,
  \noUnusedParameters\: true,
  \strict\: true
}
`

### Vite Build Otimizado
- **Console.logs removidos** em produ��o
- **Code splitting** autom�tico
- **Compress�o Gzip/Brotli**
- **Service Worker** para cache

### PWA Configuration
- **Manifest** completo
- **Icons** em m�ltiplos tamanhos
- **Offline support**
- **Install prompt**

## ?? Performance e Otimiza��es

### M�tricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Otimiza��es Implementadas
- **Lazy loading** de componentes pesados
- **Image optimization** com fallbacks
- **Code splitting** por rotas
- **React Query** para cache inteligente
- **Service Worker** para cache offline

## ?? Testes

### Cobertura de Testes
- **Unit�rios**: Vitest + React Testing Library
- **E2E**: Playwright
- **Cobertura m�nima**: 80%

### Comandos de Teste
`ash
npm run test:coverage    # Cobertura de testes
npm run test:e2e:ui      # Interface E2E
npm run test:debug       # Debug de testes
`

## ?? Deploy e Produ��o

### Deploy Autom�tico
- **GitHub Actions** para CI/CD
- **Netlify** para hosting
- **URL de produ��o**: [clubnath.netlify.app](https://clubnath.netlify.app/)

### Vari�veis de Ambiente
`nv
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=production
`

## ?? Roadmap e Pr�ximas Funcionalidades

### ? Implementado (v1.0)
- [x] NathIA mobile otimizada
- [x] Sistema de carrinho funcional
- [x] Modal de produtos detalhado
- [x] F�rum com avatares reais
- [x] Links externos NAVA/BabyTest
- [x] Error boundaries melhorados
- [x] TypeScript strict mode

### ?? Em Desenvolvimento (v1.1)
- [ ] Sistema de notifica��es push
- [ ] Chat em tempo real no f�rum
- [ ] Integra��o com pagamentos
- [ ] Sistema de avalia��es de produtos
- [ ] Modo offline completo

### ?? Planejado (v1.2+)
- [ ] App nativo (React Native)
- [ ] Integra��o com redes sociais
- [ ] Sistema de gamifica��o
- [ ] Lives exclusivas da Nath
- [ ] Marketplace expandido

## ?? Contribui��o

### Como Contribuir
1. Fork o projeto
2. Crie uma branch: git checkout -b feature/nova-funcionalidade
3. Commit suas mudan�as: git commit -m 'feat: adiciona nova funcionalidade'
4. Push para a branch: git push origin feature/nova-funcionalidade
5. Abra um Pull Request

### Padr�es de C�digo
- **ESLint** configurado
- **Prettier** para formata��o
- **Conventional Commits**
- **TypeScript strict**
- **Testes obrigat�rios**

## ?? Suporte e Contato

- **Website**: [clubnath.netlify.app](https://clubnath.netlify.app/)
- **Issues**: [GitHub Issues](https://github.com/LionGab/NathaliaValente/issues)
- **Email**: contato@clubnath.com

## ?? Licen�a

Este projeto est� sob a licen�a MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ?? Agradecimentos

- **Nath�lia Valente** - Inspira��o e vis�o do projeto
- **Comunidade de M�es** - Feedback e sugest�es
- **Equipe de Desenvolvimento** - Implementa��o t�cnica
- **Contribuidores** - Melhorias e corre��es

---

**Desenvolvido com ?? para a comunidade de m�es brasileiras**

*�ltima atualiza��o: Dezembro 2024*
