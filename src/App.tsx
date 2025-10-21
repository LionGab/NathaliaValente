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
import DemoModeToggle from './components/DemoModeToggle';
import DemoBanner from './components/DemoBanner';
import DemoFeedPage from './components/DemoFeedPage';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import { useDemoMode } from './hooks/useDemoMode';

function AppContent() {
  const { user, loading, profile } = useAuth();
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();
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

  // Se não está autenticado e não está em modo demo, mostrar login
  if (!user && !isDemoMode) {
    return (
      <>
        <AuthPage />
        <DemoModeToggle onEnableDemo={enableDemoMode} />
      </>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderPage = () => {
    // Se está em modo demo, usar componente de feed demo
    if (isDemoMode && currentPage === 'feed') {
      return <DemoFeedPage />;
    }

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

  const handleDisableDemo = () => {
    disableDemoMode();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 transition-colors duration-300">
      {/* PWA Update Prompt */}
      <PWAUpdatePrompt />

      {/* Banner de modo demo */}
      {isDemoMode && <DemoBanner onDisableDemo={handleDisableDemo} />}

      {/* Header com margem extra se demo banner estiver ativo */}
      <div className={isDemoMode ? 'mt-16' : ''}>
        <Header onProfileClick={() => setCurrentPage('profile')} />
      </div>

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
