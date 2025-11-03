// =====================================================
// CLUBNATH CREATE PRAYER MODAL
// Modal para Criar Nova Oração
// =====================================================

import React, { useState } from 'react';
import { X, Heart, AlertTriangle, Eye, EyeOff, Send, Sparkles } from 'lucide-react';
import { prayersService, PrayerPost } from '../../services/prayers.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CreatePrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrayerCreated: (prayer: PrayerPost) => void;
}

const prayerCategories = [
  {
    id: 'gratitude',
    label: 'Gratidão',
    icon: '🙏',
    description: 'Expressar gratidão e reconhecimento',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    id: 'request',
    label: 'Pedido',
    icon: '💜',
    description: 'Solicitar ajuda e orientação',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    id: 'intercession',
    label: 'Intercessão',
    icon: '🤲',
    description: 'Orar por outras pessoas',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    id: 'praise',
    label: 'Louvores',
    icon: '✨',
    description: 'Adorar e celebrar',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
];

export const CreatePrayerModal: React.FC<CreatePrayerModalProps> = ({
  isOpen,
  onClose,
  onPrayerCreated,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('request');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = prayerCategories.find((cat) => cat.id === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Você precisa estar logada para compartilhar uma oração');
      return;
    }

    if (content.length < 10) {
      setError('Sua oração deve ter pelo menos 10 caracteres');
      return;
    }

    if (content.length > 1000) {
      setError('Sua oração deve ter no máximo 1000 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newPrayer = await prayersService.createPrayer({
        user_id: user.id,
        content: content.trim(),
        category: category as any,
        is_anonymous: isAnonymous,
        is_urgent: isUrgent,
      });

      if (newPrayer) {
        onPrayerCreated(newPrayer);
        handleClose();
      } else {
        setError('Erro ao criar oração. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar oração:', error);
      setError('Erro ao criar oração. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setCategory('request');
    setIsAnonymous(false);
    setIsUrgent(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Compartilhar Oração
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sua oração será abraçada pela comunidade
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Categorias */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Oração
            </label>
            <div className="grid grid-cols-2 gap-3">
              {prayerCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    category === cat.id
                      ? `${cat.bgColor} ${cat.borderColor} border-2`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{cat.icon}</span>
                    <span
                      className={`font-medium ${
                        category === cat.id ? cat.color : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Sua Oração
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe sua oração com a comunidade... (mínimo 10 caracteres)"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={6}
              maxLength={1000}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {content.length}/1000 caracteres
              </p>
              {content.length < 10 && content.length > 0 && (
                <p className="text-xs text-orange-500">Mínimo 10 caracteres</p>
              )}
            </div>
          </div>

          {/* Opções */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {isAnonymous ? (
                    <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Oração Anônima</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sua identidade não será revelada
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Oração Urgente</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Para situações que precisam de oração imediata
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
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
              {isSubmitting ? 'Compartilhando...' : 'Compartilhar Oração'}
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
                Suas orações são abraçadas por toda a comunidade. Cada "Amém" é um abraço virtual de
                uma mãe que está orando com você.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
