/**
 * Visual Weekly Routine Screen
 * Interactive weekly schedule with categories
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Utensils,
  Moon,
  Baby,
  Heart,
  Plus,
  Bell,
  CheckCircle,
  Circle,
} from 'lucide-react';
import type { RoutineTask } from '../types';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CATEGORIES = [
  { id: 'feeding', label: 'Alimentação', icon: Utensils, color: 'accent' },
  { id: 'rest', label: 'Descanso', icon: Moon, color: 'secondary' },
  { id: 'play', label: 'Brincadeiras', icon: Baby, color: 'warning' },
  { id: 'selfcare', label: 'Autocuidado', icon: Heart, color: 'primary' },
] as const;

// Sample data
const SAMPLE_TASKS: Record<string, RoutineTask[]> = {
  feeding: [
    {
      id: '1',
      title: 'Amamentação matinal',
      category: 'feeding',
      completed: true,
      time: '07:00',
      reminder: true,
    },
    { id: '2', title: 'Lanche da manhã', category: 'feeding', completed: true, time: '10:00' },
    { id: '3', title: 'Almoço', category: 'feeding', completed: false, time: '12:00' },
    { id: '4', title: 'Lanche da tarde', category: 'feeding', completed: false, time: '15:00' },
  ],
  rest: [
    {
      id: '5',
      title: 'Soneca da manhã',
      category: 'rest',
      completed: true,
      time: '09:00',
      reminder: true,
    },
    {
      id: '6',
      title: 'Soneca da tarde',
      category: 'rest',
      completed: false,
      time: '14:00',
      reminder: true,
    },
    {
      id: '7',
      title: 'Hora de dormir',
      category: 'rest',
      completed: false,
      time: '20:00',
      reminder: true,
    },
  ],
  play: [
    { id: '8', title: 'Tempo de barriga', category: 'play', completed: true, time: '10:30' },
    { id: '9', title: 'Brincadeira sensorial', category: 'play', completed: false, time: '16:00' },
    {
      id: '10',
      title: 'Leitura antes de dormir',
      category: 'play',
      completed: false,
      time: '19:30',
    },
  ],
  selfcare: [
    { id: '11', title: 'Meditação matinal', category: 'selfcare', completed: false, time: '06:30' },
    { id: '12', title: 'Pausa para café', category: 'selfcare', completed: true, time: '11:00' },
    { id: '13', title: 'Alongamento', category: 'selfcare', completed: false, time: '17:00' },
  ],
};

export function WeeklyRoutine() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  const toggleTask = (categoryId: string, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const getCategoryStats = (categoryId: string) => {
    const categoryTasks = tasks[categoryId] || [];
    const completed = categoryTasks.filter((t) => t.completed).length;
    return { completed, total: categoryTasks.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 pb-24">
      {/* Header */}
      <div className="bg-white rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Rotina Semanal</h1>
              <p className="text-sm text-neutral-600">Organize sua semana</p>
            </div>
          </div>

          {/* Week selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {WEEKDAYS.map((day, idx) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + idx);
              const isToday = idx === new Date().getDay();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all ${
                    selectedDay === idx
                      ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span className="text-xs font-medium">{day}</span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                  {isToday && <div className="w-1 h-1 bg-current rounded-full" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Categories grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category, idx) => {
            const Icon = category.icon;
            const stats = getCategoryStats(category.id);
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                className={`bg-white rounded-3xl p-6 shadow-lg transition-all ${
                  isSelected ? 'ring-4 ring-' + category.color + '-300 shadow-xl' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 bg-${category.color}-100 rounded-2xl flex items-center justify-center mb-3 mx-auto`}
                >
                  <Icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <p className="text-sm font-semibold text-neutral-800 mb-2">{category.label}</p>
                <p className="text-xs text-neutral-600">
                  {stats.completed}/{stats.total} concluídas
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tasks list */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 space-y-3"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-xl text-sm font-medium hover:bg-accent-200 transition-colors">
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {tasks[selectedCategory]?.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(selectedCategory, task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-success-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-neutral-300" />
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      task.completed ? 'text-neutral-500 line-through' : 'text-neutral-800'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.time && <p className="text-sm text-neutral-600 mt-1">{task.time}</p>}
                </div>

                {task.reminder && <Bell className="w-5 h-5 text-accent-500" />}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI suggestion */}
      {!selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800 mb-1">Sugestão de lembrete</p>
              <p className="text-sm text-neutral-700">
                Que tal adicionar um lembrete para a soneca da tarde? Pesquisas mostram que uma
                rotina consistente ajuda o bebê a dormir melhor.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
