/**
 * ClubNath VIP - Modern Profile Setup
 * Configuração de perfil moderna e intuitiva
 */

import { useState } from 'react';
import { User, Smile, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ModernProfileSetupProps {
  fullName: string;
  onNext: (data: { nickname: string; avatarEmoji: string }) => void;
  onBack: () => void;
}

const AVATAR_EMOJIS = [
  { emoji: '💜', name: 'Coração roxo' },
  { emoji: '💖', name: 'Coração rosa' },
  { emoji: '🌸', name: 'Flor de cerejeira' },
  { emoji: '✨', name: 'Brilho' },
  { emoji: '🌺', name: 'Hibisco' },
  { emoji: '🦋', name: 'Borboleta' },
  { emoji: '🌼', name: 'Margarida' },
  { emoji: '💐', name: 'Buquê' },
  { emoji: '🌷', name: 'Tulipa' },
  { emoji: '🌹', name: 'Rosa' },
  { emoji: '💫', name: 'Estrela cadente' },
  { emoji: '⭐', name: 'Estrela' },
];

export const ModernProfileSetup = ({ fullName, onNext, onBack }: ModernProfileSetupProps) => {
  const firstName = fullName.split(' ')[0] || '';
  const [nickname, setNickname] = useState(firstName);
  const [selectedEmoji, setSelectedEmoji] = useState('💜');
  const [customNickname, setCustomNickname] = useState('');
  const [nicknameOption, setNicknameOption] = useState<'first' | 'custom'>('first');

  const handleNext = () => {
    const finalNickname = nicknameOption === 'first' ? firstName : customNickname.trim() || firstName;
    onNext({
      nickname: finalNickname,
      avatarEmoji: selectedEmoji,
    });
  };

  const canProceed = nicknameOption === 'first' || (nicknameOption === 'custom' && customNickname.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vamos nos conhecer 🌸
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Como você gostaria de ser chamada na nossa comunidade?
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          {/* Avatar Selection */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center text-6xl shadow-lg">
                {selectedEmoji}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Escolha seu avatar
            </h3>
            
            <div className="grid grid-cols-6 gap-3 max-w-md mx-auto">
              {AVATAR_EMOJIS.map(({ emoji, name }) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`group relative w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 ${
                    selectedEmoji === emoji
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 scale-110 shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={name}
                >
                  <span className="text-2xl">{emoji}</span>
                  {selectedEmoji === emoji && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-pink-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Como prefere ser chamada?
            </h3>

            {/* First Name Option */}
            <label className={`group flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              nicknameOption === 'first'
                ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
            }`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                nicknameOption === 'first'
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {nicknameOption === 'first' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                  {firstName}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Usar meu primeiro nome
                </p>
              </div>
            </label>

            {/* Custom Name Option */}
            <label className={`group flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              nicknameOption === 'custom'
                ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
            }`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                nicknameOption === 'custom'
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {nicknameOption === 'custom' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg block">
                    Outro nome
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Escolher um apelido especial
                  </p>
                </div>
                <input
                  type="text"
                  value={customNickname}
                  onChange={(e) => {
                    setCustomNickname(e.target.value);
                    setNicknameOption('custom');
                  }}
                  placeholder="Digite seu apelido..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  onFocus={() => setNicknameOption('custom')}
                />
              </div>
            </label>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`group w-full mt-8 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              canProceed
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Continuar</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
