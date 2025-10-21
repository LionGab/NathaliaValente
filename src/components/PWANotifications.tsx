import { useEffect, useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Download, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';

export const PWANotifications = () => {
  const { 
    canInstall, 
    isInstalled, 
    isOnline, 
    updateAvailable, 
    installApp, 
    updateApp 
  } = usePWA();
  
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Show install banner if app can be installed and isn't already installed
    if (canInstall && !isInstalled) {
      setShowInstallBanner(true);
    }
  }, [canInstall, isInstalled]);

  useEffect(() => {
    // Show update banner if update is available
    if (updateAvailable) {
      setShowUpdateBanner(true);
    }
  }, [updateAvailable]);

  useEffect(() => {
    // Show offline banner when going offline
    if (!isOnline) {
      setShowOfflineBanner(true);
    } else {
      setShowOfflineBanner(false);
    }
  }, [isOnline]);

  const handleInstall = async () => {
    await installApp();
    setShowInstallBanner(false);
  };

  const handleUpdate = () => {
    updateApp();
    setShowUpdateBanner(false);
  };

  if (!showInstallBanner && !showUpdateBanner && !showOfflineBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-4">
      {/* Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white rounded-2xl shadow-claude-lg p-4 mx-auto max-w-md animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <div>
                <p className="font-semibold text-sm">Instalar ClubNath</p>
                <p className="text-xs opacity-90">Acesse mais rápido pelo seu celular</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-claude-blue-500 to-claude-blue-600 text-white rounded-2xl shadow-claude-lg p-4 mx-auto max-w-md animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6" />
              <div>
                <p className="font-semibold text-sm">Atualização Disponível</p>
                <p className="text-xs opacity-90">Nova versão do ClubNath disponível</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              >
                Atualizar
              </button>
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="bg-gradient-to-r from-claude-gray-600 to-claude-gray-700 text-white rounded-2xl shadow-claude-lg p-4 mx-auto max-w-md animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-6 h-6" />
              <div>
                <p className="font-semibold text-sm">Modo Offline</p>
                <p className="text-xs opacity-90">Algumas funcionalidades podem estar limitadas</p>
              </div>
            </div>
            <button
              onClick={() => setShowOfflineBanner(false)}
              className="text-white/70 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
