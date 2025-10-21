import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthPage } from './components/AuthPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FeedPage } from './components/FeedPage';
import { ChatPage } from './components/ChatPage';
import { SearchPage } from './components/SearchPage';
import { DailyQuotePage } from './components/DailyQuotePage';
import { ProfilePage } from './components/ProfilePage';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');

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

  // Check if user needs onboarding
  const needsOnboarding = user && !profile?.onboarding_completed;

  if (needsOnboarding) {
    return <OnboardingFlow />;
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
      <Header onProfileClick={() => setCurrentPage('profile')} />
      <main className="pt-4 pb-24 animate-fade-in">{renderPage()}</main>
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
