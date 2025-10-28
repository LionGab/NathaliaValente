import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useUserStats } from '../../../hooks/useUserStats';
import { CelebrationModal } from '../../../components/ui/CelebrationModal';
import { Header } from '../../../components/Header/Header';
import { ProgressRing } from '../../../components/HeroDashboard/ProgressRing';
import { StreakBadge } from '../../../components/HeroDashboard/StreakBadge';
import { ActionCard } from '../../../components/PrimaryActions/ActionCard';
import { NathIACard } from '../../../components/PrimaryActions/NathIACard';
import { HeroCard } from '../components/HeroCard';
import { QuickActions } from '../components/QuickActions';
import { CollapsibleVerse } from '../components/CollapsibleVerse';
import { RoutinePreview } from '../components/RoutinePreview';
import { ProductPreview } from '../components/ProductPreview';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import {
  Plus, Users, MessageCircle, Heart, Sparkles, Calculator, Droplets, Moon, Utensils,
  Trophy, Flame, Target, Zap, Star, Crown, Gift, Bell, TrendingUp, Clock, CheckCircle2,
  Calendar, ShoppingBag, HelpCircle, ArrowRight, ChevronRight, Play, Pause
} from 'lucide-react';

const HomePage = () => {
  const { user, profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { stats, tasks, completeTask, getProgressPercentage, getLevelProgress, getBadgeInfo } = useUserStats();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'streak' | 'task_complete' | 'level_up' | 'badge_earned'>('task_complete');
  const [celebrationTitle, setCelebrationTitle] = useState('');
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationReward, setCelebrationReward] = useState('');

  const handleCreatePost = useCallback(() => {
    triggerHaptic('medium');
    setShowCreatePost(true);
  }, [triggerHaptic]);

  const handleQuickAction = useCallback((action: string) => {
    triggerHaptic('light');
    console.log('Ação rápida:', action);

    // Navegação para outras páginas
    if (action === 'tools') {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
    } else if (action === 'community') {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
    } else if (action === 'nathia') {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'chat' } }));
    } else if (action === 'store') {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'store' } }));
    }
  }, [triggerHaptic]);

  const handleTaskComplete = useCallback((taskId: string) => {
    triggerHaptic('medium');
    const previousCompleted = stats.todayCompleted;
    completeTask(taskId);

    // Mostrar celebração baseada no tipo de conquista
    setTimeout(() => {
      if (previousCompleted + 1 === stats.totalTasks) {
        // Todas as tarefas completadas
        setCelebrationType('task_complete');
        setCelebrationTitle('Dia Completo! 🎉');
        setCelebrationMessage('Parabéns! Você completou todas as suas tarefas hoje!');
        setCelebrationReward('+50 XP');
        setShowCelebration(true);
      } else {
        // Tarefa individual completada
        setCelebrationType('task_complete');
        setCelebrationTitle('Tarefa Concluída! ⭐');
        setCelebrationMessage('Ótimo trabalho! Continue assim!');
        setCelebrationReward('+10 XP');
        setShowCelebration(true);
      }
    }, 100);
  }, [triggerHaptic, completeTask, stats.todayCompleted, stats.totalTasks]);

  // Hook Psychology - Primeiros 3 segundos
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      <div className="max-w-full mx-auto px-4 py-4 pb-24 mobile-padding">
        {/* Hero Card - Igual à imagem */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          {/* Personal Progress Hero - Substitui o hero genérico */}
          <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_center,_transparent_0%,_white_2px,_transparent_2px)] bg-[length:60px_60px]"></div>
            </div>

          <div className="relative z-10">
            {/* Greeting Personalizado */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Olá, {profile?.full_name?.split(' ')[0] || 'Mamãe'}! 👋
                </h1>
                <p className="text-pink-100 text-sm">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>

              {/* Streak Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center"
              >
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-xs font-medium">Streak</span>
                </div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-xs text-pink-100">dias</div>
              </motion.div>
            </div>

            {/* Progress Ring - Elemento visual impactante */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-white"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progressPercentage / 100 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{Math.round(progressPercentage)}%</span>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Seu Progresso Hoje</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tarefas concluídas</span>
                    <span className="font-bold">{stats.todayCompleted}/{stats.totalTasks}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-celebração */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"
                >
                  <Trophy className="w-4 h-4" />
                  Parabéns! 🎉
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

        {/* 🎯 HIERARCHY & PRIORITY - CTAs Primários */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* NathIA - CTA Principal */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('nathia')}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              aria-label="Conversar com NathIA - Sua assistente 24/7"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                    <MessageCircle className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">NathIA</h3>
                    <p className="text-sm text-purple-100">Sua assistente 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online agora</span>
                </div>
              </div>
            </motion.button>

            {/* Comunidade - CTA Secundário */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('community')}
              className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              aria-label="Acessar Comunidade - Conecte-se com outras mães"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                    <Users className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Comunidade</h3>
                    <p className="text-sm text-pink-100">Conecte-se</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                  <span>15K posts hoje</span>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* 🎯 GAMIFICATION - Daily Routine com Dopamina Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Minha Rotina</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.todayCompleted}/{stats.totalTasks} concluídas hoje
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleQuickAction('routine')}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

      {/* Progress Bar com Animação */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progresso diário</span>
          <span className="font-semibold">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Task List com Gamificação */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${task.completed
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <button
              onClick={() => !task.completed && handleTaskComplete(task.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${task.completed
                ? 'bg-green-500 text-white scale-110'
                : 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{task.icon}</span>
                <span className={`font-medium ${task.completed
                  ? 'text-green-700 dark:text-green-300 line-through'
                  : 'text-gray-800 dark:text-white'
                  }`}>
                  {task.title}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{task.time}</p>
            </div>

            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Star className="w-5 h-5" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>

  {/* 🎯 RETENTION MECHANICS - FOMO e Conteúdo Dinâmico */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="mb-6"
  >
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
          <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Comunidade Ativa</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Acontecendo agora</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 dark:text-gray-300">
            <strong>15 mães</strong> completaram suas rotinas hoje
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Maria</strong> compartilhou uma dica de amamentação
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Ana</strong> alcançou 30 dias de streak! 🔥
          </span>
        </div>
      </div>
    </div>
  </motion.div>

  {/* 🎯 CONVERSION OPTIMIZATION - Produtos Contextuais */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9 }}
    className="mb-6"
  >
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-pink-200 dark:border-pink-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Recomendado para Você</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Baseado na sua rotina</p>
          </div>
        </div>
        <button
          onClick={() => handleQuickAction('store')}
          className="text-pink-600 dark:text-pink-400 text-sm font-medium flex items-center gap-1 hover:text-pink-700 dark:hover:text-pink-300"
        >
          Ver loja
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="w-full h-24 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 rounded-xl mb-3"></div>
          <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-1">Kit NAVA</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">R$ 199,90</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">4.9 (85)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="w-full h-24 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-xl mb-3"></div>
          <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-1">Produto OLLIN</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">R$ 89,90</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">4.6 (200)</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>

  {/* Versículo do Dia - Mantido mas otimizado */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1 }}
    className="mb-6"
  >
    <CollapsibleVerse verse={{
      text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11",
      date: "27 de Janeiro, 2025"
    }} />
  </motion.div>

  {/* Ferramentas Práticas - Mantido mas otimizado */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.3 }}
    className="mb-6"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Ferramentas Práticas
      </h2>
      <button
        onClick={() => handleQuickAction('tools')}
        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-1"
      >
        Ver todas
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => handleQuickAction('tools')}
        className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-300 border border-pink-200 dark:border-pink-800 group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <Droplets className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Amamentação
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cronômetro e dicas
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => handleQuickAction('tools')}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-300 border border-indigo-200 dark:border-indigo-800 group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Sono do Bebê
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Acompanhe cochilos
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => handleQuickAction('tools')}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-800 group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Refeições
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Planeje o cardápio
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => handleQuickAction('tools')}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-300 border border-purple-200 dark:border-purple-800 group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Bem-estar
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Cuide de você
            </p>
          </div>
        </div>
      </button>
    </div>
  </motion.div>

  {/* Dica do Dia - Mantido mas otimizado */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5 }}
    className="mb-6"
  >
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-pink-200 dark:border-pink-800 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-800 dark:text-white">Dica do Dia</h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Com a Nathália</p>
        </div>
      </div>
      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium italic">
        "Lembre-se: você não precisa ser perfeita, apenas presente. Cada pequeno gesto de amor conta mais do que você imagina. 💕"
      </blockquote>
    </div>
  </motion.div>

  {/* FAB - Floating Action Button para NathIA */}
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => handleQuickAction('nathia')}
    className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 group"
    aria-label="Conversar com NathIA"
  >
    <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
  </motion.button>

        {/* Celebration Modal */}
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          type={celebrationType}
          title={celebrationTitle}
          message={celebrationMessage}
          reward={celebrationReward}
        />
      </div>
    </div>
  );
};

export default HomePage;