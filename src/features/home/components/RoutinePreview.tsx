import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Clock, ChevronRight, CheckCircle, Circle, Plus, Star, Zap } from 'lucide-react';
import { useRoutines } from '../../../hooks/useRoutines';
import { motion, AnimatePresence } from 'framer-motion';

export const RoutinePreview: React.FC = () => {
  const { routines, isLoading } = useRoutines();
  const { toggleRoutine } = useRoutines();
  const [completedCount, setCompletedCount] = useState(0);

  // Filtrar rotinas ativas para hoje
  const todayRoutines = routines
    .filter(routine => routine.active)
    .slice(0, 3); // Apenas as próximas 3

  const handleToggleRoutine = (id: string, completed: boolean) => {
    toggleRoutine.mutate({ id, completed: !completed });
    setCompletedCount(prev => completed ? prev - 1 : prev + 1);
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (todayRoutines.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 mb-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-dashed border-purple-200 dark:border-purple-800">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-4"
          >
            📅
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Nenhuma rotina hoje
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Que tal criar sua primeira rotina e organizar melhor seu dia?
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Rotina
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Minha Rotina
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedCount}/{todayRoutines.length} concluídas hoje
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-4 py-2 rounded-xl font-medium transition-all duration-300"
          >
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progresso do dia</span>
            <span>{Math.round((completedCount / todayRoutines.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / todayRoutines.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {todayRoutines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  routine.completed 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    routine.completed 
                      ? 'bg-green-100 dark:bg-green-900/40' 
                      : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40'
                  }`}
                >
                  {routine.icon === 'feeding' ? '🍼' : 
                   routine.icon === 'bathing' ? '🛁' : 
                   routine.icon === 'sleeping' ? '😴' : '🎯'}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-base font-semibold ${
                      routine.completed 
                        ? 'text-green-700 dark:text-green-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {routine.title}
                    </span>
                    {routine.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500"
                      >
                        <Star className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {routine.time}
                    </span>
                    {routine.priority === 'high' && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Zap className="w-3 h-3" />
                        <span className="text-xs font-medium">Prioridade</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleRoutine(routine.id, routine.completed)}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    routine.completed 
                      ? 'bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  data-testid={`toggle-routine-${routine.id}`}
                >
                  {routine.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </motion.div>
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Motivational Message */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl text-center"
          >
            <p className="text-green-700 dark:text-green-400 font-medium">
              🎉 Parabéns! Você está indo muito bem hoje!
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
