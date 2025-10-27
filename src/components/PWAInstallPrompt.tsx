import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Wifi, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Don't prevent default - let the browser show its own prompt
      // e.preventDefault(); // REMOVED - This was causing the banner not to show
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show our custom prompt after 2 seconds (if browser doesn't show its own)
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 animate-fade-in-up">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-4 shadow-glow backdrop-blur-sm border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg mb-1">
              Instalar ClubNath
            </h3>
            <p className="text-white/90 text-sm mb-3">
              Acesso rápido, notificações e experiência nativa
            </p>

            <div className="flex items-center gap-4 text-white/80 text-xs mb-3">
              <div className="flex items-center gap-1">
                <Smartphone className="w-4 h-4" />
                <span>App nativo</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>Funciona offline</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Super rápido</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-pink-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition-colors"
              >
                Instalar Agora
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="px-3 py-2.5 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
