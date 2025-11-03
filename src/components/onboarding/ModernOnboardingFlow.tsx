/**
 * ClubNath VIP - Modern Onboarding Flow
 * Design moderno e hierárquico inspirado em apps populares para mulheres
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { validateProfileUpdate } from '../../utils/validation';
import { ModernWelcomeScreen } from './ModernWelcomeScreen';
import { ModernProfileSetup } from './ModernProfileSetup';
import { ModernGoalsSelection } from './ModernGoalsSelection';
import { ModernFeatureTour } from './ModernFeatureTour';
import { ModernProgressIndicator } from './ModernProgressIndicator';

type OnboardingStep = 'welcome' | 'profile' | 'goals' | 'tour';

interface OnboardingData {
  nickname: string;
  avatarEmoji: string;
  goals: string[];
}

export const ModernOnboardingFlow = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fullName = user?.user_metadata?.full_name || profile?.full_name || 'Amiga';

  // Smooth transitions between steps
  const transitionToStep = (step: OnboardingStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const handleWelcomeNext = () => {
    transitionToStep('profile');
  };

  const handleWelcomeSkip = async () => {
    await completeOnboarding({
      nickname: fullName.split(' ')[0],
      avatarEmoji: '💜',
      goals: [],
    });
  };

  const handleProfileNext = (data: { nickname: string; avatarEmoji: string }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    transitionToStep('goals');
  };

  const handleGoalsNext = (goals: string[]) => {
    setOnboardingData((prev) => ({ ...prev, goals }));
    transitionToStep('tour');
  };

  const handleTourComplete = async () => {
    await completeOnboarding(onboardingData as OnboardingData);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) return;

    setIsCompleting(true);

    try {
      const updateData = {
        preferred_nickname: data.nickname,
        avatar_emoji: data.avatarEmoji,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_goals: data.goals,
      };

      const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        return;
      }

      await refreshProfile();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const goBack = () => {
    switch (currentStep) {
      case 'profile':
        transitionToStep('welcome');
        break;
      case 'goals':
        transitionToStep('profile');
        break;
      case 'tour':
        transitionToStep('goals');
        break;
      default:
        break;
    }
  };

  const getCurrentStepIndex = () => {
    const steps: OnboardingStep[] = ['welcome', 'profile', 'goals', 'tour'];
    return steps.indexOf(currentStep);
  };

  const getTotalSteps = () => 4;

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quase lá! ✨</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparando sua experiência personalizada...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Progress Indicator */}
      {currentStep !== 'welcome' && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <ModernProgressIndicator
            currentStep={getCurrentStepIndex()}
            totalSteps={getTotalSteps()}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {currentStep === 'welcome' && (
          <ModernWelcomeScreen onNext={handleWelcomeNext} onSkip={handleWelcomeSkip} />
        )}
        {currentStep === 'profile' && (
          <ModernProfileSetup fullName={fullName} onNext={handleProfileNext} onBack={goBack} />
        )}
        {currentStep === 'goals' && (
          <ModernGoalsSelection onNext={handleGoalsNext} onBack={goBack} />
        )}
        {currentStep === 'tour' && (
          <ModernFeatureTour
            selectedGoals={onboardingData.goals || []}
            onComplete={handleTourComplete}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
};
