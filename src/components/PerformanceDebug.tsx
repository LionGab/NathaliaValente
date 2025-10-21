import { usePerformance } from '../hooks/usePerformance';
import { useState } from 'react';
import { Activity, X } from 'lucide-react';

export const PerformanceDebug = () => {
  const { metrics } = usePerformance();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-50 bg-claude-orange-500 hover:bg-claude-orange-600 text-white p-3 rounded-full shadow-claude-lg transition-all hover:scale-105"
        title="Performance Debug"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 bg-white dark:bg-claude-gray-800 rounded-2xl shadow-claude-lg p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-claude-gray-900 dark:text-white">
              Performance Debug
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-claude-gray-500 hover:text-claude-gray-700 dark:text-claude-gray-400 dark:hover:text-claude-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-claude-gray-600 dark:text-claude-gray-400">Load Time:</span>
              <span className={`font-mono ${
                metrics.loadTime > 3000 ? 'text-red-500' : 
                metrics.loadTime > 1500 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {metrics.loadTime}ms
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-claude-gray-600 dark:text-claude-gray-400">Memory Usage:</span>
              <span className={`font-mono ${
                metrics.memoryUsage > 100 ? 'text-red-500' : 
                metrics.memoryUsage > 50 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {metrics.memoryUsage}MB
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-claude-gray-600 dark:text-claude-gray-400">Network Requests:</span>
              <span className={`font-mono ${
                metrics.networkRequests > 50 ? 'text-red-500' : 
                metrics.networkRequests > 25 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {metrics.networkRequests}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-claude-gray-600 dark:text-claude-gray-400">Cache Hit Rate:</span>
              <span className={`font-mono ${
                metrics.cacheHitRate < 50 ? 'text-red-500' : 
                metrics.cacheHitRate < 80 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {metrics.cacheHitRate}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-claude-gray-600 dark:text-claude-gray-400">Render Time:</span>
              <span className={`font-mono ${
                metrics.renderTime > 16 ? 'text-red-500' : 
                metrics.renderTime > 8 ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {metrics.renderTime}ms
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-claude-gray-200 dark:border-claude-gray-700">
            <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">
              <p>• Load Time: &lt;1.5s (good), &lt;3s (ok), &gt;3s (slow)</p>
              <p>• Memory: &lt;50MB (good), &lt;100MB (ok), &gt;100MB (high)</p>
              <p>• Cache: &gt;80% (good), &gt;50% (ok), &lt;50% (poor)</p>
              <p>• Render: &lt;8ms (good), &lt;16ms (ok), &gt;16ms (slow)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
