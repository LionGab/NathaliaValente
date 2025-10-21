import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { validateProfileUpdate } from '../../utils/validation';
import { WelcomeScreen } from './WelcomeScreen';
import { QuickProfile } from './QuickProfile';
import { GoalsSelection } from './GoalsSelection';
import { FeatureTour } from './FeatureTour';

type OnboardingStep = 'welcome' | 'profile' | 'goals' | 'tour';

interface OnboardingData {
  nickname: string;
  avatarEmoji: string;
  goals: string[];
}

export const OnboardingFlow = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const fullName = user?.user_metadata?.full_name || profile?.full_name || 'Amiga';

  const handleWelcomeNext = () => {
    setCurrentStep('profile');
  };

  const handleWelcomeSkip = async () => {
    // Skip onboarding - mark as completed with defaults
    await completeOnboarding({
      nickname: fullName.split(' ')[0],
      avatarEmoji: '💜',
      goals: [],
    });
  };

  const handleProfileNext = (data: { nickname: string; avatarEmoji: string }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCurrentStep('goals');
  };

  const handleGoalsNext = (goals: string[]) => {
    setOnboardingData((prev) => ({ ...prev, goals }));
    setCurrentStep('tour');
  };

  const handleTourComplete = async () => {
    await completeOnboarding(onboardingData as OnboardingData);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) return;

    setIsCompleting(true);

    try {
      // Prepare update data
      const updateData: any = {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };

      // Only add fields if they have values
      if (data.nickname) {
        updateData.preferred_nickname = data.nickname;
      }
      if (data.avatarEmoji) {
        updateData.avatar_emoji = data.avatarEmoji;
      }
      if (data.goals && data.goals.length > 0) {
        updateData.onboarding_goals = data.goals;
      }

      // Validate data before sending to Supabase
      const validation = validateProfileUpdate(updateData);
      
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        throw new Error('Invalid data: ' + validation.errors.join(', '));
      }

      const { error } = await supabase
        .from('profiles')
        .update(validation.cleanData)
        .eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        // Don't throw error, just log it and continue
        console.warn('Continuing without saving preferences due to error:', error.message);
      }

      // Refresh profile to trigger re-render in App.tsx
      await refreshProfile();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Even if there's an error, we'll allow them to proceed
      // They can always update their profile later
      alert('Houve um problema ao salvar suas preferências, mas você já pode começar a usar o app!');

      // Force a profile refresh anyway
      await refreshProfile();
    } finally {
      setIsCompleting(false);
    }
  };

  const goBack = () => {
    const stepOrder: OnboardingStep[] = ['welcome', 'profile', 'goals', 'tour'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nath-pink-50 via-nath-lavender-50 to-nath-cream-50 dark:from-claude-gray-950 dark:via-claude-gray-900 dark:to-claude-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-nath-pink-400 to-nath-lavender-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-nath-pink-400 to-nath-lavender-500 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          </div>
          <p className="text-lg font-medium text-claude-gray-700 dark:text-claude-gray-300">
            Preparando tudo para você...
          </p>
          <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400">
            Só mais um instante! ✨
          </p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onNext={handleWelcomeNext} onSkip={handleWelcomeSkip} />;
    case 'profile':
      return <QuickProfile fullName={fullName} onNext={handleProfileNext} onBack={goBack} />;
    case 'goals':
      return <GoalsSelection onNext={handleGoalsNext} onBack={goBack} />;
    case 'tour':
      return (
        <FeatureTour
          selectedGoals={onboardingData.goals || []}
          onComplete={handleTourComplete}
          onBack={goBack}
        />
      );
    default:
      return null;
  }
};
