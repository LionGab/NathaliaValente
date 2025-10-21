import { useState } from 'react';
import { User, Smile } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';

interface QuickProfileProps {
  fullName: string;
  onNext: (data: { nickname: string; avatarEmoji: string }) => void;
  onBack: () => void;
}

const AVATAR_EMOJIS = ['💜', '💖', '🌸', '✨', '🌺', '🦋', '🌼', '💐', '🌷', '🌹', '💫', '⭐'];

export const QuickProfile = ({ fullName, onNext, onBack }: QuickProfileProps) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-nath-cream-50 via-white to-nath-pink-50 dark:from-claude-gray-950 dark:via-claude-gray-900 dark:to-claude-gray-950 p-6 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-gray-900 dark:hover:text-claude-gray-200 mb-4 transition-colors"
          >
            ← Voltar
          </button>

          <ProgressIndicator currentStep={0} totalSteps={3} />

          <h2 className="text-3xl font-bold text-claude-gray-900 dark:text-white mb-2">
            Vamos nos conhecer 🌸
          </h2>
          <p className="text-claude-gray-600 dark:text-claude-gray-400">
            Como você gostaria de ser chamada?
          </p>
        </div>

        <div className="card p-8 space-y-6 animate-slide-up">
          {/* Avatar Selection */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl bg-gradient-to-br from-nath-pink-100 to-nath-lavender-100 dark:from-nath-pink-900/20 dark:to-nath-lavender-900/20 w-24 h-24 rounded-full flex items-center justify-center shadow-claude">
              {selectedEmoji}
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-xs">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-3xl w-12 h-12 rounded-xl transition-all duration-200 ${
                    selectedEmoji === emoji
                      ? 'bg-gradient-to-br from-nath-pink-400 to-nath-lavender-400 scale-110 shadow-claude'
                      : 'bg-claude-gray-100 dark:bg-claude-gray-800 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname Options */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300">
              Como prefere ser chamada?
            </label>

            {/* First Name Option */}
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-nath-pink-50 dark:hover:bg-claude-gray-800 ${
              nicknameOption === 'first'
                ? 'border-nath-pink-400 bg-nath-pink-50 dark:bg-nath-pink-900/20'
                : 'border-claude-gray-200 dark:border-claude-gray-700'
            }">
              <input
                type="radio"
                name="nickname"
                checked={nicknameOption === 'first'}
                onChange={() => setNicknameOption('first')}
                className="w-5 h-5 text-nath-pink-500 focus:ring-nath-pink-400"
              />
              <div className="flex-1">
                <span className="font-medium text-claude-gray-900 dark:text-white">
                  {firstName}
                </span>
              </div>
            </label>

            {/* Custom Name Option */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-nath-pink-50 dark:hover:bg-claude-gray-800 ${
              nicknameOption === 'custom'
                ? 'border-nath-pink-400 bg-nath-pink-50 dark:bg-nath-pink-900/20'
                : 'border-claude-gray-200 dark:border-claude-gray-700'
            }`}>
              <input
                type="radio"
                name="nickname"
                checked={nicknameOption === 'custom'}
                onChange={() => setNicknameOption('custom')}
                className="w-5 h-5 text-nath-pink-500 focus:ring-nath-pink-400 mt-1"
              />
              <div className="flex-1 space-y-2">
                <span className="font-medium text-claude-gray-900 dark:text-white block">
                  Outro nome
                </span>
                <input
                  type="text"
                  value={customNickname}
                  onChange={(e) => {
                    setCustomNickname(e.target.value);
                    setNicknameOption('custom');
                  }}
                  placeholder="Digite seu apelido..."
                  className="input w-full text-sm"
                  onFocus={() => setNicknameOption('custom')}
                />
              </div>
            </label>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="btn-primary w-full py-4 text-base"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
};
