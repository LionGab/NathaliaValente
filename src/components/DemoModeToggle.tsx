import { useState } from 'react';
import { Sparkles, X, Info } from 'lucide-react';

interface DemoModeToggleProps {
  onEnableDemo: () => void;
}

export default function DemoModeToggle({ onEnableDemo }: DemoModeToggleProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Botão para ativar modo demo */}
      <div className="fixed bottom-32 right-4 z-40">
        <button
          onClick={() => setShowInfo(true)}
          className="group relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center gap-2 animate-pulse"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold text-sm">Modo Demo</span>

          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl">
            Clique para ativar o modo demonstração com dados simulados
          </div>
        </button>
      </div>

      {/* Modal de informação */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modo Demonstração</h2>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      O que é o Modo Demo?
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Experiência completa do ClubNath com dados simulados por IA. Perfeito para explorar todas as
                      funcionalidades sem precisar criar conta!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Inclui:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>6 usuárias fictícias com perfis completos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>10+ posts autênticos em diversas categorias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Comentários e interações reais simuladas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Chat com IA responsiva (Robô Nath)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Frases diárias motivacionais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Sistema completo de likes e comentários</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInfo(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onEnableDemo();
                  setShowInfo(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Ativar Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
