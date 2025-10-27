import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { RoutineCard } from './RoutineCard';
import { CreateRoutineModal } from './CreateRoutineModal';
import { useRoutines, useToggleRoutine } from '../hooks/useRoutines';
import { isRoutineActiveToday } from '../types/routine';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const RoutineCalendar: React.FC = () => {
  const { routines, loading, syncing } = useRoutines();
  const toggleMutation = useToggleRoutine();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const todayRoutines = routines.filter(r => isRoutineActiveToday(r));

  const handleToggle = (id: string, completed: boolean) => {
    toggleMutation.mutate({ id, completed });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Rotina de Hoje
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {DAYS_OF_WEEK[new Date().getDay()]}, {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        {syncing && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Sincronizando...
          </div>
        )}
      </div>

      {/* Grid de Atividades */}
      {todayRoutines.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nenhuma rotina agendada para hoje
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Rotina
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {todayRoutines.map((routine, index) => (
              <div
                key={routine.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoutineCard
                  routine={routine}
                  onToggle={handleToggle}
                />
              </div>
            ))}
          </div>

          {/* Botão Adicionar */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Atividade
          </button>
        </>
      )}

      {/* Modal para criar nova rotina */}
      <CreateRoutineModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
