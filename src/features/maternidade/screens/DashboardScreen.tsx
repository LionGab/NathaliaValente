import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Baby,
  Moon,
  Apple,
  Calendar,
  BookOpen,
  Sparkles,
  MessageCircle,
  Clock,
  Activity,
} from 'lucide-react';

interface DashboardScreenProps {
  userName: string;
  gestationalWeek?: number;
  isPostpartum?: boolean;
}

interface DailyCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  completed?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  gestationalWeek,
  isPostpartum,
}) => {
  const [dailyCards] = useState<DailyCard[]>([
    {
      id: 'feeding',
      title: 'Alimentação',
      description: '5 refeições hoje',
      icon: Apple,
      color: 'from-green-400 to-emerald-500',
      completed: true,
    },
    {
      id: 'sleep',
      title: 'Sono',
      description: '7h dormidas',
      icon: Moon,
      color: 'from-indigo-400 to-blue-500',
    },
    {
      id: 'activity',
      title: 'Atividades',
      description: '3 brincadeiras',
      icon: Activity,
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      description: '4 de 6 completas',
      icon: Calendar,
      color: 'from-purple-400 to-pink-500',
    },
  ]);

  const [tipOfDay] = useState({
    title: 'Dica do Dia',
    content:
      'Reserve 10 minutos hoje para respirar profundamente e relaxar. Seu bem-estar é essencial!',
    icon: '💜',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getStageMessage = () => {
    if (isPostpartum) {
      return 'Período Pós-Parto';
    }
    if (gestationalWeek) {
      return `${gestationalWeek}ª semana de gestação`;
    }
    return 'Jornada da Maternidade';
  };

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
              <p className="text-purple-100 text-sm mb-1">{getGreeting()},</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{userName}!</h1>
              <p className="text-purple-100 text-sm mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {getStageMessage()}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>

          {/* NathAI Integration Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/30 transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-semibold">NathAI</h3>
              <p className="text-purple-100 text-sm">Converse com sua assistente IA</p>
            </div>
            <Sparkles className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        {/* Daily Routine Cards */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            Rotina Diária
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {dailyCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="pt-8">
                  <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
                {card.completed && (
                  <div className="absolute bottom-3 right-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tip of the Day */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{tipOfDay.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-purple-900 mb-2">{tipOfDay.title}</h3>
                <p className="text-purple-700 leading-relaxed">{tipOfDay.content}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-3 gap-3">
            <QuickActionButton
              icon={Baby}
              label="Bebê"
              color="from-blue-400 to-cyan-500"
              onClick={() => console.log('Perfil do bebê')}
            />
            <QuickActionButton
              icon={Calendar}
              label="Cronograma"
              color="from-purple-400 to-pink-500"
              onClick={() => console.log('Cronograma')}
            />
            <QuickActionButton
              icon={BookOpen}
              label="Dicas"
              color="from-orange-400 to-red-500"
              onClick={() => console.log('Dicas')}
            />
          </div>
        </section>

        {/* Exclusive Content Teaser */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">Exclusivo Nath</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Conteúdo Especial</h3>
              <p className="text-white/90 text-sm mb-4">
                Acesse dicas exclusivas e o dia a dia da Nathalia Valente
              </p>
              <button className="px-5 py-2 bg-white text-purple-600 rounded-full font-semibold text-sm hover:bg-purple-50 transition-all">
                Ver Conteúdos
              </button>
            </div>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-500" />
            Atividade Recente
          </h2>
          <div className="space-y-3">
            <ActivityItem time="Há 2 horas" text="Você registrou uma mamada" icon="🍼" />
            <ActivityItem time="Há 5 horas" text="Nova dica de autocuidado disponível" icon="💆‍♀️" />
            <ActivityItem time="Ontem" text="Você completou seu check-in emocional" icon="💜" />
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper Components
interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  color,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
  >
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </motion.button>
);

interface ActivityItemProps {
  time: string;
  text: string;
  icon: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ time, text, icon }) => (
  <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
    <div className="text-2xl">{icon}</div>
    <div className="flex-1">
      <p className="text-gray-800 text-sm">{text}</p>
      <p className="text-gray-500 text-xs mt-1">{time}</p>
    </div>
  </div>
);
