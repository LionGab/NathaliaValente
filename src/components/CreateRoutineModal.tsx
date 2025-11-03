import React, { useState } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { RoutineIcon, RoutineFrequency, validateTime } from '../types/routine';
import { useCreateRoutine } from '../hooks/useRoutines';

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<RoutineIcon>(RoutineIcon.Feeding);
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<RoutineFrequency>(RoutineFrequency.Daily);
  const createRoutine = useCreateRoutine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !validateTime(time)) {
      return;
    }

    try {
      await createRoutine.mutateAsync({
        title: title.trim(),
        icon,
        time,
        frequency,
      });

      // Reset form
      setTitle('');
      setIcon(RoutineIcon.Feeding);
      setTime('08:00');
      setFrequency(RoutineFrequency.Daily);

      onClose();
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
    }
  };

  if (!isOpen) return null;

  const iconOptions = [
    { value: RoutineIcon.Feeding, emoji: '🍼', label: 'Alimentação' },
    { value: RoutineIcon.Bathing, emoji: '🛁', label: 'Banho' },
    { value: RoutineIcon.Sleeping, emoji: '😴', label: 'Sono' },
    { value: RoutineIcon.Activities, emoji: '🎨', label: 'Atividades' },
  ];

  const frequencyOptions = [
    { value: RoutineFrequency.Daily, label: 'Diário' },
    { value: RoutineFrequency.Weekdays, label: 'Segunda a Sexta' },
    { value: RoutineFrequency.Weekends, label: 'Fins de Semana' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Rotina</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Atividade
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Café da manhã"
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Atividade
            </label>
            <div className="grid grid-cols-2 gap-3">
              {iconOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIcon(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    icon === option.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horário
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequência
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RoutineFrequency)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || createRoutine.isPending}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {createRoutine.isPending ? 'Criando...' : 'Criar Rotina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
