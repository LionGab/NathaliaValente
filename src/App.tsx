import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { CartProvider } from './contexts/CartContext';
import { OptimizedBottomNav } from './components/navigation/OptimizedBottomNav';
// Removed SmartHeader - using only Header component
import { GestureNavigation } from './components/navigation/GestureNavigation';
import { ContextualNavigation } from './components/navigation/ContextualNavigation';
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
import { ToastContainer } from './components/Toast';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { LoadingScreen } from './components/LoadingScreen';
import { NotificationContainer } from './components/ErrorNotification';
import { useSupabaseNotifications } from './hooks/useSupabaseNotifications';
import {
  EssenceOnboardingProvider,
  useEssenceOnboarding,
} from './contexts/EssenceOnboardingContext';
import { EssenceOnboarding } from './components/onboarding/EssenceOnboarding';
import { FeedbackButton } from './components/FeedbackButton';
import { trackPageLoad } from './lib/performance';

// Import direto para evitar problemas de lazy loading
import HomePage from './features/home/screens/HomePageSimple';
import { FeedPage } from './features/feed/screens/FeedPage';
import { ChatPage } from './features/chat/screens/ChatPage';
import { StorePage } from './features/store/screens/StorePage';
import { ForumPage } from './components/ForumPage';
import { ProfilePage } from './features/profile/screens/ProfilePage';
import { ToolsPage } from './features/tools/screens/ToolsPage';

function AppContent() {
  const { user, loading } = useAuth();
  const { isOnboardingActive, isOnboardingComplete } = useEssenceOnboarding();
  const [currentPage, setCurrentPage] = useState('home');
  const [authState, setAuthState] = useState<'loading' | 'instagram' | 'onboarding' | 'app'>(
    'loading'
  );
  // Sistema de notificações via Supabase
  const { notifications, removeNotification } = useSupabaseNotifications();

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

  // Escutar eventos de navegação
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { page } = event.detail;
      if (page) {
        setCurrentPage(page);
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

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

  // Show Essence Onboarding
  if (isOnboardingActive && !isOnboardingComplete) {
    return <EssenceOnboarding />;
  }

  // Show main app
  if (authState === 'app' && user) {
    const renderPage = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        case 'home':
          trackPageLoad('home');
          return <HomePage />;
        case 'feed':
          trackPageLoad('feed');
          return (
            <FeedErrorBoundary>
              <FeedPage />
            </FeedErrorBoundary>
          );
        case 'chat':
          return (
            <ChatErrorBoundary>
              <ChatPage />
            </ChatErrorBoundary>
          );
        case 'store':
          return (
            <StoreErrorBoundary>
              <StorePage />
            </StoreErrorBoundary>
          );
        case 'profile':
          return (
            <ProfileErrorBoundary>
              <ProfilePage />
            </ProfileErrorBoundary>
          );
        case 'forum':
          return (
            <GroupsErrorBoundary>
              <ForumPage />
            </GroupsErrorBoundary>
          );
        case 'tools':
          return <ToolsPage />;
        default:
          return <HomePage />;
      }
    };

    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 mobile-content relative">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.03) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Header removido - cada página tem seu próprio header */}

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

          {/* Botão de Feedback Maternal */}
          <FeedbackButton userWeek={user?.gestational_week || 0} userId={user?.id} />

          {/* Toast Container */}
          <ToastContainer toasts={[]} onClose={() => {}} />
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
            <AuthProvider>
              <CartProvider>
                <EssenceOnboardingProvider>
                  <AppContent />
                </EssenceOnboardingProvider>
              </CartProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
