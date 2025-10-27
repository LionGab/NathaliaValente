/**
 * Nossa Maternidade - Navegação por Gestos
 * Swipe, tap e hold para navegação rápida
 */

import { useEffect, useRef, useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  User, 
  Plus, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface GestureNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  onForward: () => void;
  onCreatePost: () => void;
  onRefresh: () => void;
}

export const GestureNavigation = ({
  currentTab,
  onTabChange,
  onBack,
  onForward,
  onCreatePost,
  onRefresh
}: GestureNavigationProps) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const lastTap = useRef<number>(0);

  // Configuração de gestos
  const SWIPE_THRESHOLD = 50;
  const DOUBLE_TAP_DELAY = 300;

  // Tabs para navegação por swipe
  const tabs = ['home', 'chat', 'profile'];
  const currentIndex = tabs.indexOf(currentTab);

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsGestureActive(true);
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    if (!isGestureActive) return;
    
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // Detecta swipe horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        setSwipeDirection('right');
      } else {
        setSwipeDirection('left');
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isGestureActive) return;
    
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // Swipe horizontal para mudar tabs
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - tab anterior
        onTabChange(tabs[currentIndex - 1]);
      } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
        // Swipe left - próximo tab
        onTabChange(tabs[currentIndex + 1]);
      }
    }
    
    setIsGestureActive(false);
    setSwipeDirection(null);
  };

  // Handle double tap
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap - criar post
      onCreatePost();
    }
    lastTap.current = now;
  };

  // Handle long press
  const handleLongPress = () => {
    // Long press - menu de ações rápidas
    onRefresh();
  };

  // Setup touch events
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainContent.addEventListener('touchmove', handleTouchMove, { passive: true });
    mainContent.addEventListener('touchend', handleTouchEnd, { passive: true });
    mainContent.addEventListener('touchend', handleDoubleTap, { passive: true });

    return () => {
      mainContent.removeEventListener('touchstart', handleTouchStart);
      mainContent.removeEventListener('touchmove', handleTouchMove);
      mainContent.removeEventListener('touchend', handleTouchEnd);
      mainContent.removeEventListener('touchend', handleDoubleTap);
    };
  }, [currentIndex]);

  // Visual feedback para gestos
  const getSwipeIndicator = () => {
    if (!isGestureActive || !swipeDirection) return null;

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 ${
          swipeDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'
        }`}>
          {swipeDirection === 'left' ? (
            <>
              <ArrowRight className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Próximo
              </span>
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Anterior
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Gesture Indicators */}
      {getSwipeIndicator()}

      {/* Gesture Help Overlay (apenas no primeiro uso) */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Swipe indicators */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xs">Swipe</span>
          </div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <ArrowRight className="w-6 h-6" />
            <span className="text-xs">Swipe</span>
          </div>
        </div>

        {/* Double tap indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-20">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs">Duplo toque</span>
          </div>
        </div>
      </div>

      {/* Gesture Status Bar */}
      {isGestureActive && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-medium">
            {swipeDirection === 'left' && 'Deslize para próxima aba'}
            {swipeDirection === 'right' && 'Deslize para aba anterior'}
            {!swipeDirection && 'Gesto ativo'}
          </div>
        </div>
      )}
    </>
  );
};
