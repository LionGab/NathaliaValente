import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  showInstallPrompt: boolean;
  promptDismissed: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    installPrompt: null,
    showInstallPrompt: false,
    promptDismissed: false,
  });

  // Check if app is already installed
  const checkIfInstalled = useCallback(() => {
    const isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setPwaState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Handle install prompt with consolidated logic
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault(); // Prevent browser's default prompt
    
    const installEvent = e as BeforeInstallPromptEvent;
    
    setPwaState(prev => ({
      ...prev,
      canInstall: true,
      installPrompt: installEvent,
    }));

    // Show custom prompt after 2 seconds delay
    setTimeout(() => {
      setPwaState(prev => ({
        ...prev,
        showInstallPrompt: !prev.promptDismissed && !prev.isInstalled,
      }));
    }, 2000);
  }, []);

  // Handle app installed
  const handleAppInstalled = useCallback(() => {
    setPwaState(prev => ({
      ...prev,
      isInstalled: true,
      canInstall: false,
      installPrompt: null,
      showInstallPrompt: false,
    }));
  }, []);

  // Handle online/offline status
  const handleOnline = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: true }));
  }, []);

  const handleOffline = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: false }));
  }, []);

  // Handle service worker updates
  const handleServiceWorkerUpdate = useCallback(() => {
    setPwaState(prev => ({ ...prev, updateAvailable: true }));
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
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
  }, [handleServiceWorkerUpdate]);

  // Install app function
  const installApp = useCallback(async () => {
    if (pwaState.installPrompt) {
      try {
        await pwaState.installPrompt.prompt();
        const { outcome } = await pwaState.installPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setPwaState(prev => ({
            ...prev,
            showInstallPrompt: false,
            canInstall: false,
            installPrompt: null,
          }));
        }
      } catch (error) {
        console.error('Install prompt failed:', error);
      }
    }
  }, [pwaState.installPrompt]);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback(() => {
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: false,
      promptDismissed: true,
    }));
  }, []);

  // Update app function
  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }, []);

  // Reset prompt dismissed state (useful for testing)
  const resetPromptDismissed = useCallback(() => {
    setPwaState(prev => ({ ...prev, promptDismissed: false }));
  }, []);

  useEffect(() => {
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
  }, [checkIfInstalled, registerServiceWorker, handleBeforeInstallPrompt, handleAppInstalled, handleOnline, handleOffline]);

  return {
    ...pwaState,
    installApp,
    updateApp,
    dismissInstallPrompt,
    resetPromptDismissed,
  };
};
