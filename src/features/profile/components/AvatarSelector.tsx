import React, { useState, useCallback } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { trackEngagement } from '../../../lib/analytics';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  onClose: () => void;
}

interface AvatarOption {
  id: string;
  name: string;
  url: string;
  category: 'real' | 'illustrated' | 'custom';
  isPremium?: boolean;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  // Real Photos - Mães diversas
  {
    id: 'mom-1',
    name: 'Mãe Radiante',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  {
    id: 'mom-2',
    name: 'Mãe Sorridente',
    url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  {
    id: 'mom-3',
    name: 'Mãe Carinhosa',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  {
    id: 'mom-4',
    name: 'Mãe Forte',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  {
    id: 'mom-5',
    name: 'Mãe Inspiradora',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  {
    id: 'mom-6',
    name: 'Mãe Sábia',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    category: 'real',
  },
  // Illustrated Avatars - Estilo Nathália
  {
    id: 'illustrated-1',
    name: 'Avatar Espiritual',
    url: '/avatars/avatar-01-exausta.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-2',
    name: 'Avatar em Oração',
    url: '/avatars/avatar-02-oracao.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-3',
    name: 'Avatar Radiante',
    url: '/avatars/avatar-03-radiante.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-4',
    name: 'Avatar Vulnerável',
    url: '/avatars/avatar-04-vulneravel.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-5',
    name: 'Avatar Pensativa',
    url: '/avatars/avatar-05-pensativa.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-6',
    name: 'Avatar Determinada',
    url: '/avatars/avatar-06-determinada.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-7',
    name: 'Avatar Grávida',
    url: '/avatars/avatar-07-gravida.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-8',
    name: 'Avatar Amamentando',
    url: '/avatars/avatar-08-amamentando.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-9',
    name: 'Avatar Hijab',
    url: '/avatars/avatar-09-hijab.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-10',
    name: 'Avatar Black Power',
    url: '/avatars/avatar-10-blackpower.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-11',
    name: 'Avatar Asiática',
    url: '/avatars/avatar-11-asiatica.svg',
    category: 'illustrated',
  },
  {
    id: 'illustrated-12',
    name: 'Avatar Cadeirante',
    url: '/avatars/avatar-12-cadeirante.svg',
    category: 'illustrated',
  },
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarChange,
  onClose,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '');
  const [activeCategory, setActiveCategory] = useState<'real' | 'illustrated' | 'custom'>('real');
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarSelect = useCallback((avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    trackEngagement('avatar_select', 'profile', avatarUrl);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedAvatar) {
      onAvatarChange(selectedAvatar);
      trackEngagement('avatar_confirm', 'profile', selectedAvatar);
      onClose();
    }
  }, [selectedAvatar, onAvatarChange, onClose]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    trackEngagement('avatar_upload', 'profile', 'custom');

    try {
      // Simulate upload - in real app, upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedAvatar(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setIsUploading(false);
    }
  }, []);

  const filteredAvatars = AVATAR_OPTIONS.filter((avatar) => avatar.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Escolha seu Avatar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          {[
            { key: 'real', label: 'Fotos Reais', icon: '📸' },
            { key: 'illustrated', label: 'Ilustrações', icon: '🎨' },
            { key: 'custom', label: 'Personalizado', icon: '📁' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors ${
                activeCategory === key
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeCategory === 'custom' ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-2xl flex items-center justify-center">
                  {isUploading ? (
                    <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Faça upload da sua foto
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Escolher Foto
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filteredAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.url)}
                  className={`relative group rounded-2xl overflow-hidden transition-all duration-200 ${
                    selectedAvatar === avatar.url
                      ? 'ring-4 ring-primary-500 scale-105'
                      : 'hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {selectedAvatar === avatar.url && (
                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{avatar.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-6 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAvatar}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
