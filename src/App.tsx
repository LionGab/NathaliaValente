import { useState, Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { useMonetization } from './hooks/useMonetization';
import { SUPABASE_CONFIGURED } from './lib/supabase';
// import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PWANotifications } from './components/PWANotifications';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PerformanceDebug } from './components/PerformanceDebug';
import { MonetizationBanner } from './components/MonetizationBanner';
import { InstagramAuth } from './components/InstagramAuth';
import { ConversionOnboarding } from './components/ConversionOnboarding';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy load heavy components for better performance
const FeedPage = lazy(() => import('./components/FeedPage').then(module => ({ default: module.FeedPage })));
const ChatPage = lazy(() => import('./components/ChatPage').then(module => ({ default: module.ChatPage })));
const SearchPage = lazy(() => import('./components/SearchPage').then(module => ({ default: module.SearchPage })));
const DailyQuotePage = lazy(() => import('./components/DailyQuotePage').then(module => ({ default: module.DailyQuotePage })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(module => ({ default: module.ProfilePage })));
const GroupsList = lazy(() => import('./components/groups/GroupsList').then(module => ({ default: module.GroupsList })));
const GroupDetail = lazy(() => import('./components/groups/GroupDetail').then(module => ({ default: module.GroupDetail })));

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const { showBanner, bannerVariant, closeBanner } = useMonetization();
  const [authState, setAuthState] = useState<'loading' | 'instagram' | 'onboarding' | 'app'>('loading');

  // Control auth flow state
  useEffect(() => {
    
    if (loading) {
      setAuthState('loading');
    } else if (!user) {
      setAuthState('instagram');
    } else if (user && authState === 'instagram') {
      setAuthState('onboarding');
    } else if (user && authState === 'onboarding') {
      setAuthState('app');
    }
  }, [user, loading]); // ✅ CORREÇÃO: Removido authState das dependências

  // Show loading screen
  if (authState === 'loading') {
    return <LoadingScreen message="Carregando sua experiência..." />;
  }

  // Show Instagram Auth
  if (authState === 'instagram') {
    if (!SUPABASE_CONFIGURED) {
      // Supabase não configurado: seguir direto para app demo
      setAuthState('app');
      return <LoadingScreen message="Carregando..." />;
    }
    return (
      <InstagramAuth
        onSuccess={() => {
          setAuthState('onboarding');
        }}
      />
    );
  }

  // Show Conversion Onboarding
  if (authState === 'onboarding') {
    return (
      <ConversionOnboarding
        onComplete={() => {
          setAuthState('app');
        }}
        onSkip={() => {
          setAuthState('app');
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-claude-orange-500 border-t-transparent"></div>
          <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400 animate-pulse">
            Carregando...
          </p>
        </div>
      </div>
    );

    switch (currentPage) {
      case 'feed':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <FeedPage />
          </Suspense>
        );
      case 'chat':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ChatPage />
          </Suspense>
        );
      case 'search':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SearchPage />
          </Suspense>
        );
      case 'daily':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DailyQuotePage />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        );
      case 'groups':
        return selectedGroup ? (
          <Suspense fallback={<LoadingSpinner />}>
            <GroupDetail 
              groupId={selectedGroup.id} 
              onBack={() => setSelectedGroup(null)}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <GroupsList 
              onGroupSelect={setSelectedGroup}
            />
          </Suspense>
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
      <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 transition-colors duration-300 safe-area-inset">
        <PWANotifications />
        <PWAInstallPrompt />
        <Header onProfileClick={() => setCurrentPage('profile')} />
        <main className="pt-2 pb-20 animate-fade-in overscroll-none">{renderPage()}</main>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <PerformanceDebug />
        {showBanner && (
          <MonetizationBanner 
            variant={bannerVariant} 
            onClose={closeBanner} 
          />
        )}
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
                <AppContent />
              </AuthProvider>
            </ToastProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
