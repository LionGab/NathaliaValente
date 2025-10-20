import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FeedPage } from './components/FeedPage';
import { ChatPage } from './components/ChatPage';
import { SearchPage } from './components/SearchPage';
import { DailyQuotePage } from './components/DailyQuotePage';
import { ProfilePage } from './components/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');

  if (loading) {
    return (
      <div className="min-h-screen bg-peanut-cream dark:bg-peanut-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-peanut-coral border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
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
    <div className="min-h-screen bg-peanut-cream dark:bg-peanut-gray-900 transition-colors duration-300">
      <Header onProfileClick={() => setCurrentPage('profile')} />
      <main className="pt-2 pb-20">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
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
