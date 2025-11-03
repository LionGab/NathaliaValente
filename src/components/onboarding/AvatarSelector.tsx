// =====================================================
// CLUBNATH AVATAR SELECTOR - ONBOARDING
// Seletor de Avatar para Onboarding
// =====================================================

import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, CheckCircle, Users, Palette, Smile } from 'lucide-react';
import { Avatar, AvatarGrid, AvatarPreview, AvatarType, useAvatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AvatarSelectorProps {
  onSelect: (avatar: AvatarType) => void;
  onComplete: (avatar: AvatarType) => void;
  initialAvatar?: AvatarType;
  userName?: string;
}

const avatarCategories = {
  'Estados Emocionais': [
    {
      type: 'exausta' as AvatarType,
      label: 'Exausta',
      description: 'Para quando você está cansada',
    },
    { type: 'oracao' as AvatarType, label: 'Em Oração', description: 'Para momentos de fé' },
    { type: 'radiante' as AvatarType, label: 'Radiante', description: 'Para dias de alegria' },
    {
      type: 'vulneravel' as AvatarType,
      label: 'Vulnerável',
      description: 'Para momentos difíceis',
    },
    { type: 'pensativa' as AvatarType, label: 'Pensativa', description: 'Para reflexões' },
    { type: 'determinada' as AvatarType, label: 'Determinada', description: 'Para dias de força' },
  ],
  'Fases da Maternidade': [
    { type: 'gravida' as AvatarType, label: 'Grávida', description: 'Para a gestação' },
    { type: 'amamentando' as AvatarType, label: 'Amamentando', description: 'Para a amamentação' },
  ],
  Diversidade: [
    {
      type: 'hijab' as AvatarType,
      label: 'Com Hijab',
      description: 'Representatividade muçulmana',
    },
    { type: 'blackpower' as AvatarType, label: 'Black Power', description: 'Empoderamento negro' },
    { type: 'asiatica' as AvatarType, label: 'Asiática', description: 'Diversidade asiática' },
    { type: 'cadeirante' as AvatarType, label: 'Cadeirante', description: 'Inclusão PCD' },
  ],
};

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  onSelect,
  onComplete,
  initialAvatar,
  userName = 'Miga',
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(initialAvatar || null);
  const [activeCategory, setActiveCategory] = useState<string>('Estados Emocionais');
  const [isCompleting, setIsCompleting] = useState(false);
  const { getRandomAvatar } = useAvatar();

  const handleAvatarSelect = (avatar: AvatarType) => {
    setSelectedAvatar(avatar);
    onSelect(avatar);
  };

  const handleComplete = async () => {
    if (!selectedAvatar) return;

    setIsCompleting(true);

    // Simular delay para UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onComplete(selectedAvatar);
    setIsCompleting(false);
  };

  const handleRandomSelect = () => {
    const randomAvatar = getRandomAvatar();
    setSelectedAvatar(randomAvatar);
    onSelect(randomAvatar);
  };

  const currentCategoryAvatars = avatarCategories[activeCategory as keyof typeof avatarCategories];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <Palette className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Escolha Seu Avatar</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Olá, {userName}! Escolha um avatar que represente você e sua jornada como mãe. Você pode
            mudar a qualquer momento! 💜
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categorias */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Categorias
              </h2>

              <div className="space-y-2">
                {Object.keys(avatarCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeCategory === category
                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{category}</div>
                    <div className="text-sm opacity-75">
                      {avatarCategories[category as keyof typeof avatarCategories].length} avatares
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleRandomSelect}
                  variant="outline"
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Surpreenda-me
                </Button>
              </div>
            </div>
          </div>

          {/* Grid de Avatares */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5 text-purple-500" />
                {activeCategory}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {currentCategoryAvatars.map((avatar) => (
                  <div
                    key={avatar.type}
                    className={`relative cursor-pointer transition-all duration-200 rounded-2xl p-4 ${
                      selectedAvatar === avatar.type
                        ? 'ring-4 ring-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleAvatarSelect(avatar.type)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Avatar type={avatar.type} size="md" aria-label={avatar.label} />
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                          {avatar.label}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {avatar.description}
                        </p>
                      </div>
                    </div>

                    {selectedAvatar === avatar.type && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview e Ações */}
        {selectedAvatar && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AvatarPreview type={selectedAvatar} name={userName} size="lg" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Perfeito, {userName}! 💜
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Este avatar representa você no ClubNath. Você pode mudá-lo a qualquer momento
                      nas configurações.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  leftIcon={
                    isCompleting ? <LoadingSpinner size="sm" /> : <ArrowRight className="w-4 h-4" />
                  }
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isCompleting ? 'Finalizando...' : 'Continuar'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
                💡 Dica do ClubNath
              </h3>
              <p className="text-pink-800 dark:text-pink-300">
                Seus avatares representam diferentes momentos da sua jornada como mãe. Escolha
                aquele que mais se conecta com você agora, ou que representa como você gostaria de
                se sentir!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
