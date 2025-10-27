import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installPrompt: any;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isInstalled = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setPwaState(prev => ({ ...prev, isInstalled }));
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Don't prevent default - let the browser show its own prompt
      // e.preventDefault(); // REMOVED - This was causing the banner not to show
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: true, 
        installPrompt: e 
      }));
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false, 
        installPrompt: null 
      }));
    };

    // Handle online/offline status
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Handle service worker updates
    const handleServiceWorkerUpdate = () => {
      setPwaState(prev => ({ ...prev, updateAvailable: true }));
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  handleServiceWorkerUpdate();
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Initial checks
    checkIfInstalled();
    registerServiceWorker();

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (pwaState.installPrompt) {
      const result = await pwaState.installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: false, 
        installPrompt: null 
      }));
    }
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
  };
};
