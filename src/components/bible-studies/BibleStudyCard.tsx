// =====================================================
// CLUBNATH BIBLE STUDIES - CARD DE ESTUDO BÍBLICO
// Sistema de Estudos Bíblicos Personalizados
// =====================================================

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Heart, 
  CheckCircle, 
  PlayCircle,
  MessageCircle,
  Lightbulb,
  Prayer,
  Target,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bibleStudiesService } from '../../services/bible-studies.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { BibleStudy, UserBibleProgress } from '../../types/bible-studies';
import { 
  formatStudyTime, 
  getCategoryColor, 
  getDifficultyColor,
  getCategoryEmojis,
  STUDY_CATEGORIES,
  DIFFICULTY_LEVELS
} from '../../types/bible-studies';

interface BibleStudyCardProps {
  study: BibleStudy;
  progress?: UserBibleProgress;
  onStart?: (study: BibleStudy) => void;
  onComplete?: (study: BibleStudy, progress: Partial<UserBibleProgress>) => void;
  compact?: boolean;
  showActions?: boolean;
}

export const BibleStudyCard: React.FC<BibleStudyCardProps> = ({
  study,
  progress,
  onStart,
  onComplete,
  compact = false,
  showActions = true
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [prayerResponse, setPrayerResponse] = useState('');
  const [practicalApplication, setPracticalApplication] = useState('');
  const [rating, setRating] = useState(0);

  const isCompleted = !!progress?.completed_at;
  const timeSpent = progress?.time_spent || 0;

  const completeStudyMutation = useMutation({
    mutationFn: async (data: {
      timeSpent: number;
      userReflection: string;
      prayerResponse: string;
      practicalApplication: string;
      rating: number;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      return bibleStudiesService.updateProgress({
        userId: user.id,
        studyId: study.id,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['study-streak', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['daily-study', user?.id] });
      
      if (onComplete) {
        onComplete(study, {
          time_spent: timeSpent,
          user_reflection: userReflection,
          prayer_response: prayerResponse,
          practical_application: practicalApplication,
          rating: rating
        });
      }
      
      setIsCompleting(false);
      setIsExpanded(false);
    },
    onError: (error) => {
      console.error('Error completing study:', error);
    }
  });

  const handleStartStudy = () => {
    if (onStart) {
      onStart(study);
    }
    setIsExpanded(true);
  };

  const handleCompleteStudy = async () => {
    if (!userReflection.trim()) {
      alert('Por favor, escreva sua reflexão pessoal.');
      return;
    }

    setIsCompleting(true);
    await completeStudyMutation.mutateAsync({
      timeSpent: timeSpent || study.estimated_time,
      userReflection: userReflection.trim(),
      prayerResponse: prayerResponse.trim(),
      practicalApplication: practicalApplication.trim(),
      rating: rating || 5
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: study.title,
          text: `Estudo bíblico: ${study.title} - ${study.verse_reference}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar para clipboard
      const text = `Estudo bíblico: ${study.title}\n${study.verse_reference}\n${study.verse}`;
      await navigator.clipboard.writeText(text);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${
        isCompleted ? 'ring-2 ring-green-200 dark:ring-green-800' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getCategoryColor(study.category)}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Dia {study.day}: {study.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {study.verse_reference} • {formatStudyTime(study.estimated_time)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {showActions && (
              <Button
                onClick={handleStartStudy}
                variant="ghost"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {isCompleted ? 'Revisar' : 'Iniciar'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-200 dark:ring-green-800' : ''
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getCategoryColor(study.category)}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Dia {study.day}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(study.category)}`}>
                  {getCategoryEmojis[study.category]} {STUDY_CATEGORIES[study.category]}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(study.difficulty_level)}`}>
                  {DIFFICULTY_LEVELS[study.difficulty_level]}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {study.title}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Concluído</span>
              </div>
            )}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Compartilhar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatStudyTime(study.estimated_time)}</span>
          </div>
          {isCompleted && timeSpent > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Tempo gasto: {formatStudyTime(timeSpent)}</span>
            </div>
          )}
          {progress?.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{progress.rating}/5</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Versículo */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-pink-200 dark:border-pink-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-pink-700 dark:text-pink-400 mb-2">
                {study.verse_reference}
              </p>
              <p className="text-gray-800 dark:text-gray-200 italic leading-relaxed">
                "{study.verse}"
              </p>
            </div>
          </div>
        </div>

        {/* Reflexão */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Reflexão</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {study.reflection}
          </p>
        </div>

        {/* Pergunta */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Pergunta para Reflexão</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {study.question}
          </p>
        </div>

        {/* Oração */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Prayer className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Oração</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
            {study.prayer}
          </p>
        </div>

        {/* Dica Prática */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Dica Prática</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {study.practical_tip}
          </p>
        </div>

        {/* Formulário de Conclusão */}
        {!isCompleted && isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Sua Reflexão</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sua reflexão pessoal *
                </label>
                <textarea
                  value={userReflection}
                  onChange={(e) => setUserReflection(e.target.value)}
                  placeholder="Compartilhe seus pensamentos sobre este estudo..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sua resposta à oração (opcional)
                </label>
                <textarea
                  value={prayerResponse}
                  onChange={(e) => setPrayerResponse(e.target.value)}
                  placeholder="Como você se sentiu ao orar? O que Deus falou ao seu coração?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Como você aplicará a dica prática? (opcional)
                </label>
                <textarea
                  value={practicalApplication}
                  onChange={(e) => setPracticalApplication(e.target.value)}
                  placeholder="Como você pretende colocar em prática o que aprendeu?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avalie este estudo (1-5 estrelas)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating 
                          ? 'text-yellow-500' 
                          : 'text-gray-300 dark:text-gray-600'
                      } hover:text-yellow-500 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCompleteStudy}
                disabled={isCompleting || !userReflection.trim()}
                leftIcon={isCompleting ? <LoadingSpinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
                className="flex-1"
              >
                {isCompleting ? 'Concluindo...' : 'Concluir Estudo'}
              </Button>
              
              <Button
                onClick={() => setIsExpanded(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Progresso do Usuário */}
        {isCompleted && progress && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Sua Reflexão</h3>
            
            {progress.user_reflection && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{progress.user_reflection}"
                </p>
              </div>
            )}

            {progress.prayer_response && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Sua Oração:</h4>
                <p className="text-purple-700 dark:text-purple-400 italic">
                  {progress.prayer_response}
                </p>
              </div>
            )}

            {progress.practical_application && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Aplicação Prática:</h4>
                <p className="text-green-700 dark:text-green-400">
                  {progress.practical_application}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && !isExpanded && (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleStartStudy}
              leftIcon={isCompleted ? <BookOpen className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              className="flex-1"
            >
              {isCompleted ? 'Revisar Estudo' : 'Iniciar Estudo'}
            </Button>
            
            <Button
              onClick={() => bibleStudiesService.addFavoriteVerse({
                verseText: study.verse,
                verseReference: study.verse_reference,
                personalNote: `Do estudo: ${study.title}`
              })}
              variant="outline"
              leftIcon={<Bookmark className="w-4 h-4" />}
            >
              Salvar Versículo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
