import { X, Sparkles } from 'lucide-react';

interface DemoBannerProps {
  onDisableDemo: () => void;
}

export default function DemoBanner({ onDisableDemo }: DemoBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 z-50 shadow-lg animate-slideDown">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Modo Demonstração Ativo</p>
            <p className="text-xs text-purple-100 hidden sm:block">
              Você está navegando com dados simulados por IA. Explore à vontade!
            </p>
          </div>
        </div>

        <button
          onClick={onDisableDemo}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Sair do Demo</span>
        </button>
      </div>
    </div>
  );
}
