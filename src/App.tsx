import { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { CartProvider } from './contexts/CartContext';
import { OptimizedBottomNav } from './components/navigation/OptimizedBottomNav';
import { SmartHeader } from './components/navigation/SmartHeader';
import { GestureNavigation } from './components/navigation/GestureNavigation';
import { ContextualNavigation } from './components/navigation/ContextualNavigation';
import { PWANotifications } from './components/PWANotifications';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PerformanceDebug } from './components/PerformanceDebug';
import { InstagramAuth } from './components/InstagramAuth';
import {
  ErrorBoundary,
  FeedErrorBoundary,
  ChatErrorBoundary,
  GroupsErrorBoundary,
  ProfileErrorBoundary,
  StoreErrorBoundary,
} from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { LoadingScreen } from './components/LoadingScreen';
import { NotificationContainer } from './components/ErrorNotification';
import { useNotifications } from './hooks/useNotifications';

// Lazy load heavy components for better performance
const FeedPage = lazy(() =>
  import('./components/FeedPage').then((module) => ({ default: module.FeedPage }))
);
const ChatPage = lazy(() =>
  import('./components/ChatPage').then((module) => ({ default: module.ChatPage }))
);
const StorePage = lazy(() =>
  import('./components/StorePage').then((module) => ({ default: module.StorePage }))
);
const ForumPage = lazy(() =>
  import('./components/ForumPage').then((module) => ({ default: module.ForumPage }))
);
const ProfilePage = lazy(() =>
  import('./components/ProfilePage').then((module) => ({ default: module.ProfilePage }))
);

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');
  const [authState, setAuthState] = useState<'loading' | 'instagram' | 'onboarding' | 'app'>(
    'loading'
  );
  const { notifications, removeNotification } = useNotifications();

  // Estado para navegação otimizada
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [userBehavior] = useState({
    mostVisited: ['home', 'chat', 'groups'],
    recentActivity: ['chat', 'home'],
    timeOfDay:
      new Date().getHours() < 12
        ? 'morning'
        : new Date().getHours() < 18
          ? 'afternoon'
          : ('evening' as 'morning' | 'afternoon' | 'evening' | 'night'),
    isNewUser:
      !user?.created_at ||
      new Date(user.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
  });

  // Funções de navegação otimizada
  const handleCreatePost = () => {
    console.log('Criar post');
    // Implementar modal de criação de post
  };

  const handleSearch = (query?: string) => {
    if (query) {
      console.log('Buscar:', query);
      // Implementar busca
    } else {
      console.log('Abrir busca');
      // Implementar modal de busca
    }
  };

  const handleNotifications = () => {
    console.log('Abrir notificações');
    // Implementar modal de notificações
  };

  const handleQuickAction = (action: string) => {
    console.log('Ação rápida:', action);
    setCurrentPage(action);
  };

  const handleBack = () => {
    console.log('Voltar');
    // Implementar histórico de navegação
  };

  const handleForward = () => {
    console.log('Avançar');
    // Implementar histórico de navegação
  };

  const handleRefresh = () => {
    console.log('Atualizar');
    window.location.reload();
  };

  // Control auth flow state
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[AUTH] State change:', { loading, user: !!user, currentAuthState: authState });
    }

    if (loading) {
      setAuthState('loading');
    } else if (!user) {
      setAuthState('instagram');
    } else if (user && authState !== 'app') {
      // Se temos usuário e não estamos no app, ir direto para o app
      setAuthState('app');
    }
  }, [user, loading, authState]);

  // Show loading screen
  if (authState === 'loading') {
    return <LoadingScreen message="Carregando sua experiência..." />;
  }

  // Show Instagram Auth
  if (authState === 'instagram') {
    return (
      <InstagramAuth
        onSuccess={() => {
          // O AuthContext vai detectar o usuário e mudar para 'app' automaticamente
          console.log('Instagram login successful, waiting for auth state change...');
        }}
      />
    );
  }

  // Show main app
  if (authState === 'app' && user) {
    const renderPage = () => {
      const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="spinner-modern w-12 h-12"></div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">
              Carregando...
            </p>
          </div>
        </div>
      );

      switch (currentPage) {
        case 'feed':
          return (
            <FeedErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <FeedPage />
              </Suspense>
            </FeedErrorBoundary>
          );
        case 'chat':
          return (
            <ChatErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ChatPage />
              </Suspense>
            </ChatErrorBoundary>
          );
        case 'store':
          return (
            <StoreErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <StorePage />
              </Suspense>
            </StoreErrorBoundary>
          );
        case 'profile':
          return (
            <ProfileErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            </ProfileErrorBoundary>
          );
        case 'forum':
          return (
            <GroupsErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ForumPage />
              </Suspense>
            </GroupsErrorBoundary>
          );
        default:
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <FeedPage />
            </Suspense>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950 transition-colors duration-500 safe-area-inset relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '1s' }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <PWANotifications />
          <PWAInstallPrompt />

          {/* Header Inteligente */}
          <SmartHeader
            onProfileClick={() => setCurrentPage('profile')}
            onCreatePost={handleCreatePost}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            onQuickAction={handleQuickAction}
          />

          <main className="pt-2 pb-20 animate-fade-in overscroll-none">{renderPage()}</main>

          {/* Navegação Otimizada */}
          <OptimizedBottomNav
            currentTab={currentPage}
            onTabChange={setCurrentPage}
            onCreatePost={handleCreatePost}
            onSearch={() => handleSearch()}
            onNotifications={handleNotifications}
            onQuickMenu={() => setShowQuickActions(!showQuickActions)}
          />

          {/* Navegação por Gestos */}
          <GestureNavigation
            currentTab={currentPage}
            onTabChange={setCurrentPage}
            onBack={handleBack}
            onForward={handleForward}
            onCreatePost={handleCreatePost}
            onRefresh={handleRefresh}
          />

          {/* Navegação Contextual */}
          <ContextualNavigation
            currentTab={currentPage}
            userBehavior={userBehavior}
            onNavigate={setCurrentPage}
            onQuickAction={handleQuickAction}
          />

          <PerformanceDebug />
          <NotificationContainer notifications={notifications} onClose={removeNotification} />
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return <LoadingScreen message="Carregando..." />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AccessibilityProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
