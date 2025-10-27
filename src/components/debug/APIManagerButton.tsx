/**
 * ClubNath VIP - API Manager Button
 * Botão flutuante para acessar o gerenciador de APIs
 */

import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { APIManager } from './APIManager';
import { useAPIManager } from '../../hooks/useAPIManager';

export const APIManagerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConfigured, debugInfo } = useAPIManager();

  // Só mostra o botão em desenvolvimento
  if (!debugInfo?.isDevelopment) {
    return null;
  }

  const hasErrors = !isConfigured.supabase || !isConfigured.ai || !isConfigured.payments;
  const hasWarnings = Object.values(debugInfo?.features || {}).some(feature => !feature);

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
          hasErrors
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : hasWarnings
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        title="Gerenciador de APIs"
      >
        <Settings className="w-6 h-6 mx-auto" />
        
        {/* Indicador de Status */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">
          {hasErrors ? (
            <span className="text-red-100">!</span>
          ) : hasWarnings ? (
            <span className="text-yellow-100">!</span>
          ) : (
            <span className="text-green-100">✓</span>
          )}
        </div>
      </button>

      {/* Modal do Gerenciador */}
      <APIManager isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
