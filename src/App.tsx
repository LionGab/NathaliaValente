import { useState, lazy, Suspense, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

// Lazy load pages for better performance
const AuthPage = lazy(() => import('./components/AuthPage').then(m => ({ default: m.AuthPage })));
const FeedPage = lazy(() => import('./components/FeedPage').then(m => ({ default: m.FeedPage })));
const ChatPage = lazy(() => import('./components/ChatPage').then(m => ({ default: m.ChatPage })));
const SearchPage = lazy(() => import('./components/SearchPage').then(m => ({ default: m.SearchPage })));
const DailyQuotePage = lazy(() => import('./components/DailyQuotePage').then(m => ({ default: m.DailyQuotePage })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-claude-orange-500 border-t-transparent"></div>
      <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400 animate-pulse">
        Carregando...
      </p>
    </div>
  </div>
);

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');

  const handleProfileClick = useCallback(() => setCurrentPage('profile'), []);
  const handleNavigate = useCallback((page: string) => setCurrentPage(page), []);

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
    return (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
      </Suspense>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <FeedPage />;
      case 'chat':
        return <ChatPage />;
      case 'search':
        return <SearchPage />;
      case 'daily':
        return <DailyQuotePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 transition-colors duration-300">
      <Header onProfileClick={handleProfileClick} />
      <Suspense fallback={<PageLoader />}>
        <main className="pt-4 pb-24 animate-fade-in">{renderPage()}</main>
      </Suspense>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
