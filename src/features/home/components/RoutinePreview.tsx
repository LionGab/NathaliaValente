import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Clock, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useRoutines } from '../../../hooks/useRoutines';
// import { getRoutineIconEmoji } from '../../../types/routine';

export const RoutinePreview: React.FC = () => {
  const { routines, isLoading } = useRoutines();
  const { toggleRoutine } = useRoutines();

  // Filtrar rotinas ativas para hoje
  const todayRoutines = routines
    .filter(routine => routine.active)
    .slice(0, 3); // Apenas as próximas 3

  if (isLoading) {
    return (
      <Card className="p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (todayRoutines.length === 0) {
    return (
      <Card className="p-4 mb-6 text-center">
        <div className="text-4xl mb-2">📅</div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          Nenhuma rotina hoje
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Que tal criar sua primeira rotina?
        </p>
        <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
          <Clock className="w-4 h-4 mr-1" />
          Criar Rotina
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Minha Rotina
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-600 hover:text-primary-700"
        >
          Ver todas
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {todayRoutines.map((routine) => (
          <div
            key={routine.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="text-2xl">
              {routine.icon === 'feeding' ? '🍼' : routine.icon === 'bathing' ? '🛁' : routine.icon === 'sleeping' ? '😴' : '🎯'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {routine.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {routine.time}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => toggleRoutine.mutate({ 
                id: routine.id, 
                completed: !routine.completed 
              })}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              data-testid={`toggle-routine-${routine.id}`}
            >
              {routine.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};
