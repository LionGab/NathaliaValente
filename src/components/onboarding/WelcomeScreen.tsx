import { Heart, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export const WelcomeScreen = ({ onNext, onSkip }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-nath-pink-50 via-nath-lavender-50 to-nath-cream-50 dark:from-claude-gray-900 dark:via-claude-gray-800 dark:to-claude-gray-900 p-6 animate-fade-in">
      {/* Logo/Icon */}
      <div className="mb-8 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-nath-pink-400 to-nath-lavender-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-nath-pink-400 to-nath-lavender-500 p-6 rounded-3xl shadow-claude-lg">
            <Heart className="w-16 h-16 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center max-w-md space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-claude-gray-900 dark:text-white tracking-tight">
          Bem-vinda ao 💜
        </h1>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-nath-pink-500 to-nath-lavender-500 bg-clip-text text-transparent">
          NathClub
        </h2>

        <div className="pt-4 space-y-3">
          <p className="text-lg text-claude-gray-700 dark:text-claude-gray-300 font-medium">
            Criado pela Nath, para mães como você
          </p>
          <p className="text-base text-claude-gray-600 dark:text-claude-gray-400">
            Um espaço seguro de <span className="font-semibold text-nath-lavender-600 dark:text-nath-lavender-400">fé</span>, <span className="font-semibold text-nath-pink-600 dark:text-nath-pink-400">autenticidade</span> e <span className="font-semibold text-nath-peach-600 dark:text-nath-peach-400">sororidade</span>
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-md">
        <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-claude-gray-800/50 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl">💬</div>
          <p className="text-xs text-center text-claude-gray-600 dark:text-claude-gray-400 font-medium">
            Conecte-se
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-claude-gray-800/50 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl">🙏</div>
          <p className="text-xs text-center text-claude-gray-600 dark:text-claude-gray-400 font-medium">
            Fortaleça sua fé
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-claude-gray-800/50 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl">✨</div>
          <p className="text-xs text-center text-claude-gray-600 dark:text-claude-gray-400 font-medium">
            Seja você
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-nath-pink-400 to-nath-pink-500 hover:from-nath-pink-500 hover:to-nath-pink-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-claude-md hover:shadow-claude-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
        >
          Começar minha jornada
          <Sparkles className="w-5 h-5" />
        </button>

        <button
          onClick={onSkip}
          className="w-full text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-gray-900 dark:hover:text-claude-gray-200 font-medium py-3 px-6 rounded-2xl transition-colors duration-200"
        >
          Pular tour
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 dark:opacity-5 animate-pulse">
        💕
      </div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-10 dark:opacity-5 animate-pulse" style={{ animationDelay: '1s' }}>
        🌸
      </div>
    </div>
  );
};
