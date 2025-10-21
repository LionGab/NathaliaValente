import { useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';
import { useMonetization } from './hooks/useMonetization';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PWANotifications } from './components/PWANotifications';
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

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');
  const { showBanner, bannerVariant, closeBanner } = useMonetization();
  const [showInstagramAuth, setShowInstagramAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mockUser, setMockUser] = useState(null);

  // Show Instagram Auth if no user
  if (showInstagramAuth) {
    return (
      <InstagramAuth 
        onSuccess={(user) => {
          setMockUser(user);
          setShowInstagramAuth(false);
          setShowOnboarding(true);
        }} 
      />
    );
  }

  // Show Conversion Onboarding after Instagram login
  if (showOnboarding) {
    return (
      <ConversionOnboarding 
        onComplete={() => {
          setShowOnboarding(false);
          // User is now "logged in" to the app
        }}
        onSkip={() => {
          setShowOnboarding(false);
          // User skipped onboarding
        }}
      />
    );
  }

  if (loading) {
    return <LoadingScreen message="Carregando sua experiência..." />;
  }

  if (!user && !mockUser) {
    // Auto-login for testing with mock data
    const testUser = {
      id: '2',
      full_name: 'Maria Silva',
      email: 'maria@teste.com',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Mãe de 2 filhos, empreendedora e apaixonada por finanças pessoais. Aprendendo com a Nath todos os dias! 💕',
      followers_count: 1250,
      following_count: 890,
      posts_count: 45,
      verified: false
    };
    setMockUser(testUser);
    return null; // Will re-render with mockUser
  }

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
