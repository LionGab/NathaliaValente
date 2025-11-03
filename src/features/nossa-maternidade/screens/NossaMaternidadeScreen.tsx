/**
 * Nossa Maternidade Main Screen
 * Main entry point for the maternal wellness app
 */

import { useState } from 'react';
import { AIInteractionFlow } from '../components/AIInteractionFlow';
import { LoginScreen } from '../components/LoginScreen';
import { Dashboard } from '../components/Dashboard';
import { ExclusivoNath } from '../components/ExclusivoNath';
import { WeeklyRoutine } from '../components/WeeklyRoutine';
import { SelfCareScreen } from '../components/SelfCareScreen';
import { ThemedSuggestions } from '../components/ThemedSuggestions';
import type { UserProfile, SentimentAnalysis } from '../types';

type AppState = 'login' | 'ai-interaction' | 'app';
type AppPage = 'home' | 'nath-exclusive' | 'routine' | 'selfcare' | 'suggestions' | 'baby-profile';

export function NossaMaternidadeScreen() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);

  // Mock user for demo
  const mockUser: UserProfile = {
    id: '1',
    name: 'Maria',
    babyName: 'Sofia',
    babyAge: 8,
    isPregnant: false,
    preferences: {
      favoriteActivities: [],
      notifications: true,
      dailySuggestions: true,
    },
  };

  const handleLogin = async () => {
    // Mock login - in production this would call Supabase Auth
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(mockUser);
        setAppState('ai-interaction');
        resolve();
      }, 1000);
    });
  };

  const handleAIComplete = (analysis: SentimentAnalysis) => {
    setSentimentAnalysis(analysis);
    setAppState('app');
  };

  const handlePasswordReset = () => {
    console.log('Password reset clicked');
    // Implement password reset flow
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
    // Implement signup flow
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
  };

  // Render based on app state
  if (appState === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onPasswordReset={handlePasswordReset}
        onCreateAccount={handleCreateAccount}
      />
    );
  }

  if (appState === 'ai-interaction' && user) {
    return <AIInteractionFlow onComplete={handleAIComplete} userId={user.id} />;
  }

  if (appState === 'app' && user) {
    // Render current page
    switch (currentPage) {
      case 'home':
        return (
          <Dashboard
            user={user}
            sentimentAnalysis={sentimentAnalysis || undefined}
            onNavigate={handleNavigate}
          />
        );
      case 'nath-exclusive':
        return <ExclusivoNath onNavigate={handleNavigate} />;
      case 'routine':
        return <WeeklyRoutine onNavigate={handleNavigate} />;
      case 'selfcare':
        return <SelfCareScreen onNavigate={handleNavigate} />;
      case 'suggestions':
        return <ThemedSuggestions onNavigate={handleNavigate} />;
      case 'baby-profile':
        return (
          <Dashboard
            user={user}
            sentimentAnalysis={sentimentAnalysis || undefined}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <Dashboard
            user={user}
            sentimentAnalysis={sentimentAnalysis || undefined}
            onNavigate={handleNavigate}
          />
        );
    }
  }

  return null;
}
