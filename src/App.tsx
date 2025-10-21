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
import { ErrorBoundary } from './components/ErrorBoundary';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-claude-orange-500 border-t-transparent"></div>
          <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400 animate-pulse">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
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
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
