import React from 'react';
import { simpleTips } from '../data/simple-nath-tips';

export const SimpleNathTips: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">⭐</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Dicas da Nath</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Conteúdo exclusivo e acolhedor para sua jornada materna. Dicas práticas, orientações
          especializadas e muito apoio emocional.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👶</span>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Primeiros Cuidados com o Recém-Nascido
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Primeiros Cuidados</p>
              </div>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Tudo que você precisa saber para cuidar do seu bebê nos primeiros dias em casa.
            </p>
          </div>
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>👥</span>
                <span>Por Nathália Valente</span>
              </div>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                Ler mais
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤱</span>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Amamentação: Guia Completo para Mães
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Amamentação</p>
              </div>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Dicas práticas e apoio emocional para uma amamentação bem-sucedida e prazerosa.
            </p>
          </div>
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>👥</span>
                <span>Por Nathália Valente</span>
              </div>
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium">
                Ler mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
