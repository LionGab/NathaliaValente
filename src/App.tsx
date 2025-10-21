import { useState, useEffect } from 'react';
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
import OnboardingFlow from './components/OnboardingFlow';
import WelcomeTour from './components/WelcomeTour';

function AppContent() {
  const { user, loading, profile } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      // Verificar se o onboarding já foi completado
      const onboardingCompleted = localStorage.getItem('clubnath_onboarding_completed');
      const profileOnboardingCompleted = profile?.onboarding_completed;

      if (!onboardingCompleted && !profileOnboardingCompleted) {
        setShowOnboarding(true);
      } else {
        // Verificar se o tour já foi completado
        const tourCompleted = localStorage.getItem('clubnath_tour_completed');
        if (!tourCompleted) {
          setShowTour(true);
        }
      }
      setCheckingOnboarding(false);
    } else {
      setCheckingOnboarding(false);
    }
  }, [user, loading, profile]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Mostrar tour após onboarding
    const tourCompleted = localStorage.getItem('clubnath_tour_completed');
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 500);
    }
  };

  if (loading || checkingOnboarding) {
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

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
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

      {/* Tour de Boas-vindas */}
      {showTour && <WelcomeTour onComplete={() => setShowTour(false)} onSkip={() => setShowTour(false)} />}
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
