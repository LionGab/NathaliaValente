import React, { useState } from 'react';
import { CheckCircle, Star, Heart, BookOpen, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface WelcomeChallengeProps {
  onComplete: () => void;
  userGoals: string[];
  userName: string;
}

const challengeOptions = [
  {
    id: 'first_post',
    title: 'Faça sua primeira postagem',
    description: 'Compartilhe algo especial com a comunidade',
    icon: Heart,
    category: 'social',
    points: 20
  },
  {
    id: 'first_journal',
    title: 'Escreva sua primeira reflexão',
    description: 'Comece seu diário de gratidão e crescimento',
    icon: BookOpen,
    category: 'journal',
    points: 15
  },
  {
    id: 'first_habit',
    title: 'Crie seu primeiro hábito',
    description: 'Estabeleça uma rotina positiva',
    icon: Target,
    category: 'habits',
    points: 10
  },
  {
    id: 'complete_profile',
    title: 'Complete seu perfil',
    description: 'Adicione uma foto e bio para se conectar melhor',
    icon: Star,
    category: 'profile',
    points: 5
  }
];

export const WelcomeChallenge: React.FC<WelcomeChallengeProps> = ({
  onComplete,
  userGoals,
  userName
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useAuth();

  const getPersonalizedChallenges = () => {
    // Priorizar desafios baseados nos goals do usuário
    const goalPriorities = {
      'Bem-estar mental': ['first_journal', 'first_habit'],
      'Conexão social': ['first_post', 'complete_profile'],
      'Crescimento pessoal': ['first_journal', 'first_habit'],
      'Organização': ['first_habit', 'complete_profile'],
      'Fé e espiritualidade': ['first_journal', 'first_post']
    };

    const prioritizedIds = userGoals.flatMap(goal => goalPriorities[goal as keyof typeof goalPriorities] || []);
    const uniquePrioritized = [...new Set(prioritizedIds)];

    return challengeOptions.sort((a, b) => {
      const aIndex = uniquePrioritized.indexOf(a.id);
      const bIndex = uniquePrioritized.indexOf(b.id);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
  };

  const handleCompleteChallenge = async () => {
    if (!selectedChallenge || !user) return;

    setIsCompleting(true);
    try {
      // Marcar desafio como aceito no perfil
      const { error } = await supabase
        .from('profiles')
        .update({
          welcome_challenge: selectedChallenge,
          welcome_challenge_accepted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Conceder badge "Primeira vez" se for o primeiro desafio
      const challenge = challengeOptions.find(c => c.id === selectedChallenge);
      if (challenge) {
        // Aqui você integraria com o sistema de badges
        console.log(`Badge "Primeira vez" concedido por: ${challenge.title}`);
      }

      onComplete();
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const personalizedChallenges = getPersonalizedChallenges();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vinda, {userName}! 🌸
          </h1>
          <p className="text-gray-600 text-lg">
            Que tal começar sua jornada com um pequeno desafio personalizado?
          </p>
        </div>

        {/* Personalized Message */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Baseado nos seus objetivos:</h3>
          <div className="flex flex-wrap gap-2">
            {userGoals.map((goal, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/70 rounded-full text-sm font-medium text-gray-700"
              >
                {goal}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Selecionamos desafios que vão te ajudar a alcançar seus objetivos!
          </p>
        </div>

        {/* Challenge Options */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Escolha seu primeiro desafio:
          </h3>
          
          {personalizedChallenges.map((challenge) => {
            const Icon = challenge.icon;
            const isSelected = selectedChallenge === challenge.id;
            
            return (
              <button
                key={challenge.id}
                onClick={() => handleChallengeSelect(challenge.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-pink-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        +{challenge.points} pontos
                      </span>
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-pink-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onComplete}
            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Pular por enquanto
          </button>
          
          <button
            onClick={handleCompleteChallenge}
            disabled={!selectedChallenge || isCompleting}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Aceitando...
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Aceitar Desafio
              </>
            )}
          </button>
        </div>

        {/* Motivation */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Dica:</strong> Completar desafios te ajuda a ganhar badges e pontos!
          </p>
        </div>
      </div>
    </div>
  );
};
