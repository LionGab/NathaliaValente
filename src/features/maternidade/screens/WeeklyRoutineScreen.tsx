import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Baby,
  Moon,
  Apple,
  Heart,
  Coffee,
  Sun,
  Sunset,
  Plus,
  Check,
} from 'lucide-react';

interface RoutineActivity {
  id: string;
  time: string;
  title: string;
  category: 'feeding' | 'sleep' | 'play' | 'care' | 'selfcare';
  completed: boolean;
  notes?: string;
}

interface DaySchedule {
  day: string;
  date: string;
  activities: RoutineActivity[];
}

export const WeeklyRoutineScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const [weekSchedule] = useState<DaySchedule[]>([
    {
      day: 'Domingo',
      date: '03/11',
      activities: [
        {
          id: '1',
          time: '07:00',
          title: 'Mamada matinal',
          category: 'feeding',
          completed: true,
        },
        {
          id: '2',
          time: '08:30',
          title: 'Soneca da manhã',
          category: 'sleep',
          completed: true,
        },
        {
          id: '3',
          time: '10:00',
          title: 'Brincadeira sensorial',
          category: 'play',
          completed: false,
        },
        {
          id: '4',
          time: '12:00',
          title: 'Almoço',
          category: 'feeding',
          completed: false,
        },
        {
          id: '5',
          time: '14:00',
          title: 'Soneca da tarde',
          category: 'sleep',
          completed: false,
        },
        {
          id: '6',
          time: '16:00',
          title: 'Autocuidado - Meditação',
          category: 'selfcare',
          completed: false,
        },
        {
          id: '7',
          time: '18:00',
          title: 'Jantar',
          category: 'feeding',
          completed: false,
        },
        {
          id: '8',
          time: '19:30',
          title: 'Banho relaxante',
          category: 'care',
          completed: false,
        },
        {
          id: '9',
          time: '20:00',
          title: 'Rotina do sono',
          category: 'sleep',
          completed: false,
        },
      ],
    },
    // More days would be added here
  ]);

  const getCategoryConfig = (
    category: RoutineActivity['category']
  ): { icon: React.ComponentType<{ className?: string }>; color: string; label: string } => {
    switch (category) {
      case 'feeding':
        return { icon: Apple, color: 'from-green-400 to-emerald-500', label: 'Alimentação' };
      case 'sleep':
        return { icon: Moon, color: 'from-indigo-400 to-blue-500', label: 'Sono' };
      case 'play':
        return { icon: Baby, color: 'from-orange-400 to-red-500', label: 'Brincadeira' };
      case 'care':
        return { icon: Heart, color: 'from-pink-400 to-rose-500', label: 'Cuidados' };
      case 'selfcare':
        return { icon: Coffee, color: 'from-purple-400 to-pink-500', label: 'Autocuidado' };
    }
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 6) return Moon;
    if (hour < 12) return Sun;
    if (hour < 18) return Coffee;
    return Sunset;
  };

  const currentSchedule = weekSchedule[selectedDay];
  const completedCount = currentSchedule.activities.filter((a) => a.completed).length;
  const totalCount = currentSchedule.activities.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-6 h-6 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Rotina Semanal</h1>
              </div>
              <p className="text-purple-100 text-sm">Organize seu dia a dia</p>
            </div>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full p-1">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-white text-sm font-medium">Progresso do dia</span>
              <span className="text-white text-sm font-bold">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Week Day Selector */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {weekDays.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`flex flex-col items-center justify-center min-w-[60px] px-4 py-3 rounded-2xl transition-all ${
                  selectedDay === index
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="text-xs mb-1">
                  {index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : day}
                </span>
                <span className="text-lg font-bold">
                  {new Date(Date.now() + index * 24 * 60 * 60 * 1000).getDate()}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category Legend */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Categorias</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(['feeding', 'sleep', 'play', 'care', 'selfcare'] as const).map((category) => {
              const config = getCategoryConfig(category);
              const Icon = config.icon;
              return (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-700">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-6 space-y-3">
        {currentSchedule.activities.map((activity, index) => {
          const config = getCategoryConfig(activity.category);
          const Icon = config.icon;
          const TimeIcon = getTimeIcon(activity.time);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${
                activity.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Time */}
                <div className="flex flex-col items-center">
                  <TimeIcon className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-sm font-bold text-gray-700">{activity.time}</span>
                </div>

                {/* Activity Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-gray-800 ${activity.completed ? 'line-through' : ''}`}
                      >
                        {activity.title}
                      </h4>
                      <span className="text-xs text-gray-500">{config.label}</span>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-gray-600 mt-2 ml-12">{activity.notes}</p>
                  )}
                </div>

                {/* Check Button */}
                <button
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    activity.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {activity.completed && <Check className="w-5 h-5 text-white" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Activity Button */}
      <div className="fixed bottom-24 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        >
          <Plus className="w-7 h-7 text-white" />
        </motion.button>
      </div>
    </div>
  );
};
