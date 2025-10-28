import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import {
  Calendar, Users, ShoppingBag, HelpCircle, Heart, Star, Baby, BookOpen, Shield,
  Clock, TrendingUp, CheckCircle, Plus, Bell, Sparkles, Target, Award,
  ChevronRight, Activity, Zap, Moon, Sun
} from 'lucide-react';
import { EnhancedRoutinePreview } from '../components/EnhancedRoutinePreview';
import { DynamicHeroBanner } from '../../../components/DynamicHeroBanner';

const HomePageSimple = () => {
  const { profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { gestationalData, isLoading: isLoadingGestational } = useGestationalPersonalization();

  // Estados para melhorias de UX
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [streakCount, setStreakCount] = useState(7);
  const [todayProgress, setTodayProgress] = useState(65);

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Dados de notificações inteligentes
  const smartNotifications = [
    {
      id: 1,
      type: 'reminder',
      title: 'Hora da meditação',
      message: '5 minutos para relaxar e conectar com seu bebê',
      time: '09:00',
      icon: Moon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 2,
      type: 'tip',
      title: 'Dica do dia',
      message: 'Beba mais água! Hidratação é essencial na gestação',
      time: '10:30',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Parabéns!',
      message: 'Você completou 7 dias seguidos de exercícios',
      time: '14:00',
      icon: Award,
      color: 'from-green-500 to-green-600'
    }
  ];

  const handleQuickAction = useCallback((action: string) => {
    triggerHaptic('light');
    console.log('Ação rápida:', action);

    // Navegação para outras páginas
    switch (action) {
      case 'routine':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
        break;
      case 'community':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
        break;
      case 'nathia':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'chat' } }));
        break;
      case 'support':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'chat' } }));
        break;
      default:
        console.log('Ação não reconhecida:', action);
    }
  }, [triggerHaptic]);

  const quickActions = [
    {
      id: 'routine',
      title: 'Minha Rotina',
      subtitle: 'Acompanhe sua gestação',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'community',
      title: 'Comunidade',
      subtitle: 'Conecte-se com outras mães',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      id: 'nathia',
      title: 'NathIA',
      subtitle: 'Sua assistente gestacional',
      icon: Baby,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      id: 'support',
      title: 'Apoio',
      subtitle: 'Dicas e orientações',
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Header */}
      <Header />

      <div className="max-w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 pb-20 sm:pb-24">
        {/* Hero Card Melhorado - Hierarquia Visual Clara */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern Melhorado */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative z-10">
              {/* Header com informações contextuais */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Saudação personalizada com horário */}
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      Olá, {profile?.full_name?.split(' ')[0] || 'Mamãe'}! 👋
                    </h1>
                    <div className="text-sm text-white/80 font-medium">
                      {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Dados gestacionais com visual melhorado */}
                  {gestationalData && (
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
                        <span className="text-sm font-bold text-white tracking-wide">
                          {gestationalData.weeks} semanas
                        </span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
                        <span className="text-sm font-bold text-white tracking-wide">
                          {gestationalData.trimester}º trimestre
                        </span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30 flex items-center gap-1">
                        <Target className="w-3 h-3" aria-hidden="true" />
                        <span className="text-sm font-bold text-white tracking-wide">
                          {todayProgress}% hoje
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notificações inteligentes */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      triggerHaptic('light');
                      setShowNotifications(!showNotifications);
                    }}
                    className="relative p-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200"
                    aria-label="Ver notificações"
                  >
                    <Bell className="w-5 h-5 text-white" aria-hidden="true" />
                    {smartNotifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{smartNotifications.length}</span>
                      </div>
                    )}
                  </motion.button>

                  {/* Dropdown de notificações */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-50"
                      >
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4" aria-hidden="true" />
                            Notificações Inteligentes
                          </h3>
                          <div className="space-y-3">
                            {smartNotifications.map((notification) => (
                              <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${notification.color}`}>
                                  <notification.icon className="w-4 h-4 text-white" aria-hidden="true" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800 text-sm">{notification.title}</h4>
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progresso gestacional visual melhorado */}
              {gestationalData && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white/90">Progresso da Gestação</span>
                    <span className="text-sm font-bold text-white">
                      {Math.round((gestationalData.weeks / 40) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(gestationalData.weeks / 40) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-white rounded-full h-2 shadow-lg"
                    />
                  </div>
                </div>
              )}

              {/* Mensagem personalizada e CTAs melhorados */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-white/90 text-sm sm:text-base font-medium flex-1 leading-relaxed">
                  {gestationalData?.personalizedMessage || "Aproveite cada momento especial da sua jornada"}
                </p>

                {/* CTAs com visual aprimorado */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic('light');
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                    }}
                    className="bg-white text-pink-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg text-sm tracking-wide hover:shadow-xl transition-all duration-200"
                    aria-label="Compartilhar experiência"
                  >
                    <Heart className="w-4 h-4" aria-hidden="true" />
                    <span>Compartilhar</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic('light');
                      document.getElementById('dicas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
                    aria-label="Ver dicas personalizadas"
                  >
                    Dicas
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dicas Personalizadas Melhoradas */}
        {gestationalData && (
          <motion.div
            id="dicas-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl">
                    <BookOpen className="w-5 h-5 text-pink-200" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-wide">
                      Dicas {gestationalData.trimester}º trimestre
                    </h3>
                    <p className="text-pink-200 text-sm">Personalizadas para você</p>
                  </div>
                </div>
                <div className="text-sm text-pink-200 font-bold bg-pink-500/30 px-3 py-1.5 rounded-full border border-pink-400/30">
                  {gestationalData.weeks} semanas
                </div>
              </div>

              {/* Dicas com animação e visual melhorado */}
              <div className="space-y-3">
                {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group"
                  >
                    <div className="p-1.5 bg-green-400/20 rounded-full group-hover:bg-green-400/30 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-300" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-pink-100 leading-relaxed font-medium flex-1">{tip}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
                className="w-full mt-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-200 text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-200 border border-pink-400/30"
                aria-label="Ver todas as dicas personalizadas"
              >
                Ver todas as dicas
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Minha Rotina com Gamificação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-200" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-wide">Minha Rotina</h3>
                  <p className="text-blue-200 text-sm">Sua jornada diária</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-blue-200 font-bold bg-blue-500/30 px-3 py-1.5 rounded-full border border-blue-400/30">
                  {streakCount} dias seguidos
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                  <span className="text-yellow-400 font-bold text-sm">{streakCount}</span>
                </div>
              </div>
            </div>

            {/* Progresso do dia */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/90">Progresso de hoje</span>
                <span className="text-sm font-bold text-white">{todayProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full h-2 shadow-lg"
                />
              </div>
            </div>

            {/* Atividades da rotina */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group"
              >
                <div className="p-1.5 bg-green-400/20 rounded-full group-hover:bg-green-400/30 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-pink-100 font-medium">Meditação matinal (5 min)</span>
                  <p className="text-xs text-pink-200">Conecte-se com seu bebê</p>
                </div>
                <div className="text-xs text-green-300 font-bold">✓</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group"
              >
                <div className="p-1.5 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors">
                  <Clock className="w-4 h-4 text-yellow-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-pink-100 font-medium">Exercícios leves (15 min)</span>
                  <p className="text-xs text-pink-200">Próximo: 14:00</p>
                </div>
                <div className="text-xs text-yellow-300 font-bold">⏰</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group"
              >
                <div className="p-1.5 bg-purple-400/20 rounded-full group-hover:bg-purple-400/30 transition-colors">
                  <Moon className="w-4 h-4 text-purple-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-pink-100 font-medium">Relaxamento noturno (10 min)</span>
                  <p className="text-xs text-pink-200">Às 20:00</p>
                </div>
                <div className="text-xs text-purple-300 font-bold">🌙</div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHaptic('light');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
              }}
              className="w-full mt-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 border border-blue-400/30"
              aria-label="Ver rotina completa e gerenciar atividades"
            >
              Ver rotina completa
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions Grid Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Grid 2x2 com visual aprimorado */}
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} text-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border border-white/20`}
                aria-label={`${action.title} - ${action.subtitle}`}
              >
                {/* Background pattern animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Ícone com animação */}
                  <div className="mb-4 flex justify-between items-start">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-200">
                      <action.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
                  </div>

                  {/* Texto com hierarquia visual clara */}
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white tracking-wide">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Seção de Estatísticas Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{streakCount}</div>
                <div className="text-xs text-white/80 font-medium">Dias seguidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{todayProgress}%</div>
                <div className="text-xs text-white/80 font-medium">Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-white/80 font-medium">Conquistas</div>
              </div>
            </div>
          </motion.div>

          {/* Botão de Ação Principal Melhorado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('medium');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
              }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group relative overflow-hidden"
              aria-label="Criar nova publicação - Compartilhar Experiência"
            >
              {/* Background pattern animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-200">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                </div>
                <span className="font-bold text-lg tracking-wide">Compartilhar Experiência</span>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageSimple;
