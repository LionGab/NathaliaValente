// =====================================================
// CLUBNATH BIBLE STUDIES - ESTUDO DIÁRIO
// Sistema de Estudos Bíblicos Personalizados
// =====================================================

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  Trophy, 
  ArrowRight, 
  RefreshCw,
  BookOpen,
  Heart,
  Sparkles,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bibleStudiesService } from '../../services/bible-studies.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { BibleStudyCard } from './BibleStudyCard';
import type { BibleStudy, UserBibleProgress } from '../../types/bible-studies';
import { 
  formatStudyTime, 
  getStreakMessage,
  formatStudyDate
} from '../../types/bible-studies';

interface DailyStudyProps {
  userId: string;
  onComplete?: (study: BibleStudy, progress: Partial<UserBibleProgress>) => void;
  showProgress?: boolean;
  showNavigation?: boolean;
}

export const DailyStudy: React.FC<DailyStudyProps> = ({
  userId,
  onComplete,
  showProgress = true,
  showNavigation = true
}) => {
  const queryClient = useQueryClient();
  const [currentDay, setCurrentDay] = useState<number | undefined>(undefined);

  // Queries
  const { data: dailyStudy, isLoading, error, refetch } = useQuery({
    queryKey: ['daily-study', userId, currentDay],
    queryFn: () => bibleStudiesService.getDailyStudy(userId, currentDay),
    enabled: !!userId
  });

  const { data: streak } = useQuery({
    queryKey: ['study-streak', userId],
    queryFn: () => bibleStudiesService.getStudyStreak(userId),
    enabled: !!userId
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress', userId],
    queryFn: () => bibleStudiesService.getUserProgress(userId),
    enabled: !!userId && showProgress
  });

  // Mutations
  const completeStudyMutation = useMutation({
    mutationFn: async (data: {
      timeSpent: number;
      userReflection: string;
      prayerResponse: string;
      practicalApplication: string;
      rating: number;
    }) => {
      if (!dailyStudy) throw new Error('Estudo não encontrado');
      
      return bibleStudiesService.updateProgress({
        userId,
        studyId: dailyStudy.study.id,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['study-streak', userId] });
      queryClient.invalidateQueries({ queryKey: ['daily-study', userId] });
      refetch();
    }
  });

  const handleStudyComplete = async (study: BibleStudy, progress: Partial<UserBibleProgress>) => {
    if (onComplete) {
      onComplete(study, progress);
    }
  };

  const handleNextDay = () => {
    if (dailyStudy?.nextStudy) {
      setCurrentDay(dailyStudy.nextStudy.day);
    }
  };

  const handlePreviousDay = () => {
    if (currentDay && currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleRefresh = () => {
    setCurrentDay(undefined);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Carregando seu estudo do dia...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dailyStudy) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum estudo encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Não foi possível carregar seu estudo do dia.
        </p>
        <Button
          onClick={handleRefresh}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const { study, isCompleted, streakDays, nextStudy } = dailyStudy;
  const completedStudies = userProgress?.filter(p => p.completed_at).length || 0;
  const totalTimeSpent = userProgress?.reduce((sum, p) => sum + p.time_spent, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header com Progresso */}
      {showProgress && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Estudo Diário</h1>
              <p className="text-white/90">
                {isCompleted ? 'Estudo concluído! 🎉' : 'Seu momento de reflexão espiritual'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{streakDays}</div>
              <div className="text-sm text-white/80">dias seguidos</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">{completedStudies}</div>
              <div className="text-xs text-white/80">Estudos</div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">{formatStudyTime(totalTimeSpent)}</div>
              <div className="text-xs text-white/80">Tempo</div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">{streakDays}</div>
              <div className="text-xs text-white/80">Sequência</div>
            </div>
          </div>

          {streakDays > 0 && (
            <div className="mt-4 p-3 bg-white/20 rounded-lg">
              <p className="text-sm text-center">
                {getStreakMessage(streakDays)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navegação */}
      {showNavigation && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePreviousDay}
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              disabled={!currentDay || currentDay <= 1}
            >
              Anterior
            </Button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentDay ? `Dia ${currentDay}` : 'Estudo do Dia'}
            </span>
            
            <Button
              onClick={handleNextDay}
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              disabled={!nextStudy}
            >
              Próximo
            </Button>
          </div>

          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Atualizar
          </Button>
        </div>
      )}

      {/* Card do Estudo */}
      <BibleStudyCard
        study={study}
        progress={dailyStudy.userProgress}
        onComplete={handleStudyComplete}
        showActions={true}
      />

      {/* Próximo Estudo */}
      {nextStudy && !isCompleted && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Próximo Estudo
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Dia {nextStudy.day}: {nextStudy.title}
              </p>
            </div>
            <Button
              onClick={handleNextDay}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              Ver Próximo
            </Button>
          </div>
        </div>
      )}

      {/* Motivação */}
      {!isCompleted && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-pink-900 dark:text-pink-100">
              Momento de Conexão
            </h3>
          </div>
          <p className="text-pink-800 dark:text-pink-300 leading-relaxed">
            Este é seu momento especial para conectar com Deus e refletir sobre sua jornada como mãe. 
            Reserve alguns minutos para esta reflexão espiritual - é um presente que você dá a si mesma. 💜
          </p>
        </div>
      )}

      {/* Estatísticas */}
      {showProgress && userProgress && userProgress.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Sua Jornada Espiritual
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedStudies}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Estudos Concluídos
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatStudyTime(totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tempo Investido
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {streakDays}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Dias Seguidos
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {Math.round((completedStudies / (completedStudies + 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Taxa de Conclusão
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
