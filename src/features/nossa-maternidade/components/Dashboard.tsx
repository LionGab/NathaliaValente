/**
 * Personalized Dashboard
 * Main home screen with AI-powered recommendations
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Lightbulb, Baby, Heart, Sparkles, Clock, CheckCircle } from 'lucide-react';
import type { UserProfile, SentimentAnalysis } from '../types';

interface DashboardProps {
  user: UserProfile;
  sentimentAnalysis?: SentimentAnalysis;
  onNavigate: (page: string) => void;
}

export function Dashboard({ user, sentimentAnalysis, onNavigate }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getAISuggestion = () => {
    if (!sentimentAnalysis) {
      return 'Que tal começar registrando sua rotina de hoje?';
    }

    switch (sentimentAnalysis.emotionalState) {
      case 'tired':
        return 'Percebi que você está cansada. Que tal uma pausa de 10 minutos?';
      case 'anxious':
        return 'Respire fundo. Vamos juntas encontrar um momento de calma hoje?';
      case 'stressed':
        return 'Você merece um tempo para você. Veja nossas sugestões de autocuidado.';
      case 'happy':
        return 'Que alegria! Continue assim! Que tal compartilhar esse momento?';
      default:
        return 'Hoje é um novo dia. Vamos cuidar de você e do seu bebê juntas!';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-b-3xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {getGreeting()}, {user.name}! 🌸
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-800 mb-1">NathAI para você</p>
            <p className="text-sm text-neutral-700">{getAISuggestion()}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Daily Routine Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => onNavigate('routine')}
          className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">Rotina diária</h2>
                <p className="text-sm text-neutral-600">Organize seu dia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent-600">3/8</p>
              <p className="text-xs text-neutral-500">concluídas</p>
            </div>
          </div>

          {/* Sample tasks */}
          <div className="space-y-2">
            {[
              { title: 'Amamentação matinal', time: '07:00', done: true },
              { title: 'Momento de brincadeira', time: '10:00', done: true },
              { title: 'Hora da soneca', time: '14:00', done: true },
              { title: 'Banho relaxante', time: '18:00', done: false },
            ].map((task, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle
                  className={`w-5 h-5 ${task.done ? 'text-success-500' : 'text-neutral-300'}`}
                />
                <span
                  className={`text-sm flex-1 ${
                    task.done ? 'text-neutral-500 line-through' : 'text-neutral-700'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-xs text-neutral-500">{task.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Suggestion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => onNavigate('suggestions')}
          className="bg-gradient-to-br from-secondary-500 to-primary-500 rounded-3xl p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Sugestão do dia</h2>
          </div>
          <p className="text-white/90 mb-4">
            <strong>Atividade sensorial:</strong> Crie uma caixa de texturas com tecidos diferentes.
            Isso ajuda no desenvolvimento tátil do bebê e é super divertido!
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>10 minutos</span>
          </div>
        </motion.div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => onNavigate('selfcare')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-3 mx-auto">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-sm font-semibold text-neutral-800 text-center">Autocuidado</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => onNavigate('nath-exclusive')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center mb-3 mx-auto">
              <Sparkles className="w-6 h-6 text-secondary-600" />
            </div>
            <p className="text-sm font-semibold text-neutral-800 text-center">Exclusivo Nath</p>
          </motion.button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { icon: Home, label: 'Início', active: true, page: 'home' },
            { icon: Calendar, label: 'Cronograma', active: false, page: 'routine' },
            { icon: Lightbulb, label: 'Dicas', active: false, page: 'suggestions' },
            { icon: Baby, label: 'Perfil', active: false, page: 'baby-profile' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  item.active ? 'text-primary-600' : 'text-neutral-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
