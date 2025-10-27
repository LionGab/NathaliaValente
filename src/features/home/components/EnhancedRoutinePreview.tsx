import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  Plus, 
  Star, 
  Zap, 
  Trophy,
  Target,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useRoutines } from '../../../hooks/useRoutines';
import { useHapticFeedback } from '../../../hooks/useGestures';

interface EnhancedRoutinePreviewProps {
  onViewAll: () => void;
}

export const EnhancedRoutinePreview: React.FC<EnhancedRoutinePreviewProps> = ({ onViewAll }) => {
  const { routines, isLoading } = useRoutines();
  const { triggerHaptic } = useHapticFeedback();
  const [completedCount, setCompletedCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filtrar rotinas ativas para hoje
  const todayRoutines = routines
    .filter(routine => routine.active)
    .slice(0, 3); // Apenas as próximas 3

  const handleToggleRoutine = (id: string, completed: boolean) => {
    triggerHaptic('light');
    // Aqui você implementaria a lógica de toggle
    setCompletedCount(prev => completed ? prev - 1 : prev + 1);
  };

  const getCurrentGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia! ☀️';
    if (hour < 18) return 'Boa tarde! 🌤️';
    return 'Boa noite! 🌙';
  };

  const getMotivationalMessage = () => {
    const completionRate = todayRoutines.length > 0 ? (completedCount / todayRoutines.length) * 100 : 0;
    
    if (completionRate === 100) return 'Incrível! Você completou todas as atividades! 🎉';
    if (completionRate >= 75) return 'Você está indo muito bem! Continue assim! 💪';
    if (completionRate >= 50) return 'Ótimo progresso! Quase lá! ⭐';
    if (completedCount > 0) return 'Bom começo! Vamos continuar! 🌟';
    return 'Vamos começar o dia com energia! ✨';
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800/30">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/2" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-blue-200 dark:bg-blue-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800/30"
    >
      {/* Header com saudação e progresso */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
              Minha Rotina
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {getCurrentGreeting()}
            </p>
          </div>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-200 dark:text-blue-800"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${todayRoutines.length > 0 ? (completedCount / todayRoutines.length) * 100 : 0}, 100`}
              className="text-blue-500 dark:text-blue-400"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {todayRoutines.length > 0 ? Math.round((completedCount / todayRoutines.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Mensagem motivacional */}
      <motion.div
        key={completedCount}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4 p-3 bg-white/60 dark:bg-white/10 rounded-xl"
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          {getMotivationalMessage()}
        </p>
      </motion.div>

      {/* Lista de atividades */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {todayRoutines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                Nenhuma atividade agendada para hoje
              </p>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onViewAll();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Criar Rotina
              </button>
            </motion.div>
          ) : (
            todayRoutines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  routine.completed_at 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20'
                }`}
              >
                {/* Checkbox interativo */}
                <button
                  onClick={() => handleToggleRoutine(routine.id, !!routine.completed_at)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    routine.completed_at
                      ? 'bg-green-500 border-green-500 shadow-lg'
                      : 'border-gray-300 hover:border-green-500 hover:shadow-md'
                  }`}
                >
                  {routine.completed_at && <CheckCircle className="w-4 h-4 text-white" />}
                </button>

                {/* Conteúdo da atividade */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {routine.time}
                    </span>
                  </div>
                  <h4 className={`font-semibold text-sm ${
                    routine.completed_at 
                      ? 'text-green-700 dark:text-green-300 line-through' 
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {routine.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {routine.description || 'Atividade do dia'}
                  </p>
                </div>

                {/* Ícone de status */}
                <div className="flex-shrink-0">
                  {routine.completed_at ? (
                    <Trophy className="w-5 h-5 text-green-500" />
                  ) : (
                    <Target className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer com ação */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => {
            triggerHaptic('light');
            onViewAll();
          }}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>Ver todas as atividades</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {todayRoutines.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Star className="w-4 h-4" />
            <span>{completedCount}/{todayRoutines.length} concluídas</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
