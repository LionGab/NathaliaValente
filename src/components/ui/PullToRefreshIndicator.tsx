/**
 * Pull-to-refresh visual indicator component
 * Shows loading spinner when pulling/refreshing
 */

import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold?: number;
}

export default function PullToRefreshIndicator({
  isPulling,
  isRefreshing,
  pullDistance,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  if (!isPulling && !isRefreshing) {
    return null;
  }

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center bg-gradient-to-b from-claude-cream-50/95 to-transparent dark:from-claude-gray-950/95 pointer-events-none transition-all duration-200"
      style={{
        height: `${Math.min(pullDistance + 20, 100)}px`,
        opacity: isRefreshing ? 1 : Math.min(pullDistance / threshold, 1),
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`relative transition-all duration-200 ${
            isRefreshing ? 'animate-spin' : ''
          } ${shouldTrigger ? 'scale-110' : 'scale-100'}`}
          style={{
            transform: isRefreshing ? '' : `rotate(${progress * 3.6}deg)`,
          }}
        >
          <RefreshCw
            className={`w-6 h-6 ${
              shouldTrigger
                ? 'text-claude-orange-500'
                : 'text-claude-gray-400 dark:text-claude-gray-500'
            }`}
            strokeWidth={2.5}
          />
        </div>

        {isRefreshing && (
          <p className="text-xs font-medium text-claude-gray-600 dark:text-claude-gray-400 animate-pulse">
            Atualizando...
          </p>
        )}
      </div>
    </div>
  );
}
