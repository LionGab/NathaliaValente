import React, { useState, useEffect } from 'react';
import { Clock, Droplets, Baby, AlertCircle, CheckCircle } from 'lucide-react';

interface FeedingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // em minutos
  side: 'left' | 'right' | 'both';
  notes?: string;
}

export const BreastfeedingCalculator: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<FeedingSession | null>(null);
  const [sessions, setSessions] = useState<FeedingSession[]>([]);
  const [babyAge, setBabyAge] = useState<number>(0); // em dias
  const [isFeeding, setIsFeeding] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer para sessão atual
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFeeding && currentSession) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFeeding, currentSession]);

  const startFeeding = (side: 'left' | 'right' | 'both') => {
    const newSession: FeedingSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      side,
    };
    setCurrentSession(newSession);
    setIsFeeding(true);
    setTimer(0);
  };

  const endFeeding = () => {
    if (currentSession) {
      const endTime = new Date();
      const duration = Math.floor(timer / 60);

      const completedSession = {
        ...currentSession,
        endTime,
        duration,
      };

      setSessions((prev) => [completedSession, ...prev]);
      setCurrentSession(null);
      setIsFeeding(false);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFeedingRecommendations = () => {
    if (babyAge < 7) return 'Recém-nascido: 8-12 mamadas por dia, 10-15 min por lado';
    if (babyAge < 30) return 'Primeiro mês: 6-8 mamadas por dia, 15-20 min por lado';
    if (babyAge < 90) return '1-3 meses: 5-7 mamadas por dia, 20-30 min por lado';
    if (babyAge < 180) return '3-6 meses: 4-6 mamadas por dia, 20-40 min por lado';
    return '6+ meses: 3-4 mamadas por dia + introdução alimentar';
  };

  const getTotalFeedingTime = () => {
    return sessions.reduce((total, session) => total + (session.duration || 0), 0);
  };

  const getLastFeedingGap = () => {
    if (sessions.length === 0) return null;
    const lastSession = sessions[0];
    const now = new Date();
    const gap = Math.floor((now.getTime() - lastSession.startTime.getTime()) / (1000 * 60));
    return gap;
  };

  const getNextFeedingRecommendation = () => {
    const gap = getLastFeedingGap();
    if (!gap) return 'Inicie uma nova mamada';

    if (babyAge < 30) {
      if (gap < 60) return 'Aguarde mais um pouco (mínimo 1h)';
      if (gap > 180) return '⚠️ Muito tempo sem mamar - considere acordar o bebê';
      return '✅ Pode oferecer o peito';
    } else {
      if (gap < 90) return 'Aguarde mais um pouco (mínimo 1h30)';
      if (gap > 240) return '⚠️ Muito tempo sem mamar - considere acordar o bebê';
      return '✅ Pode oferecer o peito';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
          <Droplets className="w-6 h-6 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Calculadora de Amamentação
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe as mamadas do seu bebê</p>
        </div>
      </div>

      {/* Idade do bebê */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Idade do bebê (dias)
        </label>
        <input
          type="number"
          value={babyAge}
          onChange={(e) => setBabyAge(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ex: 15"
        />
      </div>

      {/* Recomendações */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Baby className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Recomendações para esta idade:
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {getFeedingRecommendations()}
            </p>
          </div>
        </div>
      </div>

      {/* Sessão atual */}
      {isFeeding && currentSession && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {formatTime(timer)}
            </div>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Mamando no lado {currentSession.side === 'both' ? 'ambos' : currentSession.side}
            </p>
            <button
              onClick={endFeeding}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Finalizar Mamada
            </button>
          </div>
        </div>
      )}

      {/* Controles */}
      {!isFeeding && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => startFeeding('left')}
            className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Lado Esquerdo
          </button>
          <button
            onClick={() => startFeeding('right')}
            className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Lado Direito
          </button>
          <button
            onClick={() => startFeeding('both')}
            className="bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Ambos
          </button>
        </div>
      )}

      {/* Status atual */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 className="font-semibold text-gray-800 dark:text-white">Status Atual</h4>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Última mamada:</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {sessions.length > 0 ? `${getLastFeedingGap()} min atrás` : 'Nenhuma registrada'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tempo total hoje:</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {getTotalFeedingTime()} min
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Próxima mamada:</span>
            <span
              className={`font-medium ${
                getNextFeedingRecommendation().includes('⚠️')
                  ? 'text-red-600 dark:text-red-400'
                  : getNextFeedingRecommendation().includes('✅')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-800 dark:text-white'
              }`}
            >
              {getNextFeedingRecommendation()}
            </span>
          </div>
        </div>
      </div>

      {/* Histórico recente */}
      {sessions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Histórico de Hoje</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.startTime.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {session.side === 'both' ? 'ambos' : session.side}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {session.duration} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
