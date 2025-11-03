// =====================================================
// CLUBNATH CREATE JOURNAL MODAL
// Modal para Criar Nova Entrada de Journal
// =====================================================

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Heart, Send, Sparkles, Shuffle, Clock, Target } from 'lucide-react';
import { journalingService, JournalEntry, JournalPrompt } from '../../services/journaling.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CreateJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJournalCreated: (entry: JournalEntry) => void;
  initialPrompt?: JournalPrompt;
}

const moodOptions = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Feliz',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    id: 'grateful',
    emoji: '🙏',
    label: 'Grata',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    id: 'peaceful',
    emoji: '😌',
    label: 'Pacífica',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: 'Neutro',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Cansada',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Ansiosa',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    id: 'sad',
    emoji: '😢',
    label: 'Triste',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'overwhelmed',
    emoji: '😵',
    label: 'Sobrecarregada',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
];

const commonTags = [
  'Gratidão',
  'Reflexão',
  'Crescimento',
  'Fé',
  'Maternidade',
  'Desafios',
  'Alegria',
  'Esperança',
  'Paz',
  'Amor',
  'Família',
];

export const CreateJournalModal: React.FC<CreateJournalModalProps> = ({
  isOpen,
  onClose,
  onJournalCreated,
  initialPrompt,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(initialPrompt || null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [availablePrompts, setAvailablePrompts] = useState<JournalPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  useEffect(() => {
    if (isOpen && !initialPrompt) {
      loadPrompts();
    }
  }, [isOpen, initialPrompt]);

  const loadPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const prompts = await journalingService.getJournalPrompts({ limit: 20 });
      setAvailablePrompts(prompts);

      // Selecionar prompt aleatório se não houver um inicial
      if (!selectedPrompt && prompts.length > 0) {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        setSelectedPrompt(prompts[randomIndex]);
      }
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const getRandomPrompt = () => {
    if (availablePrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePrompts.length);
      setSelectedPrompt(availablePrompts[randomIndex]);
    }
  };

  const handleTagToggle = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Você precisa estar logada para criar uma entrada de journal');
      return;
    }

    if (content.length < 10) {
      setError('Sua entrada deve ter pelo menos 10 caracteres');
      return;
    }

    if (content.length > 5000) {
      setError('Sua entrada deve ter no máximo 5000 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newEntry = await journalingService.createJournalEntry({
        user_id: user.id,
        content: content.trim(),
        mood: mood as any,
        prompt_id: selectedPrompt?.id,
        tags,
        is_private: isPrivate,
      });

      if (newEntry) {
        onJournalCreated(newEntry);
        handleClose();
      } else {
        setError('Erro ao criar entrada de journal. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar entrada de journal:', error);
      setError('Erro ao criar entrada de journal. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setMood('neutral');
    setSelectedPrompt(initialPrompt || null);
    setTags([]);
    setIsPrivate(true);
    setError('');
    onClose();
  };

  const selectedMood = moodOptions.find((m) => m.id === mood) || moodOptions[3];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Escrever no Journal
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compartilhe seus pensamentos e reflexões
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Prompt Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prompt de Reflexão
              </label>
              <button
                type="button"
                onClick={getRandomPrompt}
                disabled={loadingPrompts}
                className="flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:underline"
              >
                <Shuffle className="w-3 h-3" />
                {loadingPrompts ? 'Carregando...' : 'Novo prompt'}
              </button>
            </div>

            {selectedPrompt ? (
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
                    <Target className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
                      {selectedPrompt.title}
                    </h3>
                    <p className="text-sm text-pink-800 dark:text-pink-300 mb-3">
                      {selectedPrompt.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-pink-700 dark:text-pink-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedPrompt.estimated_time} min
                      </span>
                      <span className="capitalize">{selectedPrompt.difficulty}</span>
                      <span className="capitalize">{selectedPrompt.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {loadingPrompts ? 'Carregando prompts...' : 'Nenhum prompt selecionado'}
                </p>
              </div>
            )}
          </div>

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Como você está se sentindo?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {moodOptions.map((moodOption) => (
                <button
                  key={moodOption.id}
                  type="button"
                  onClick={() => setMood(moodOption.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    mood === moodOption.id
                      ? `${moodOption.bgColor} ${moodOption.borderColor} border-2`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{moodOption.emoji}</div>
                  <div
                    className={`text-xs font-medium ${
                      mood === moodOption.id ? moodOption.color : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {moodOption.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Sua Reflexão
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sobre seus pensamentos, sentimentos e reflexões... (mínimo 10 caracteres)"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={8}
              maxLength={5000}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {content.length}/5000 caracteres
              </p>
              {content.length < 10 && content.length > 0 && (
                <p className="text-xs text-orange-500">Mínimo 10 caracteres</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tags (opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    tags.includes(tag)
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                  {isPrivate ? (
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {isPrivate ? 'Entrada Privada' : 'Entrada Pública'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isPrivate
                      ? 'Apenas você pode ver esta entrada'
                      : 'Outras mães podem ver esta entrada (sem identificação)'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!isPrivate}
                  onChange={(e) => setIsPrivate(!e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <Button type="button" onClick={handleClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || content.length < 10}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              leftIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Journal'}
            </Button>
          </div>
        </form>

        {/* Dica */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-1">
                💜 Dica do ClubNath
              </h3>
              <p className="text-sm text-pink-800 dark:text-pink-300">
                O journaling é uma prática poderosa de autocuidado. Não se preocupe com a perfeição
                - o importante é expressar seus sentimentos e refletir sobre sua jornada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
