import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import {
  Calendar, Users, ShoppingBag, HelpCircle, Heart, Star, Baby, BookOpen, Shield,
  Clock, TrendingUp, CheckCircle, Plus
} from 'lucide-react';
import { EnhancedRoutinePreview } from '../components/EnhancedRoutinePreview';
import { DynamicHeroBanner } from '../../../components/DynamicHeroBanner';

const HomePageSimple = () => {
  const { profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { gestationalData, isLoading: isLoadingGestational } = useGestationalPersonalization();

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
        {/* Hero Card - ULTRA COMPACTO (máx 128px) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-xl relative overflow-hidden h-28 sm:h-32">
            {/* Background Pattern Sutil */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Header compacto com hierarquia visual clara */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Título principal - Responsivo */}
                  <h1 className="text-lg sm:text-xl font-bold mb-1 text-white leading-tight">
                    Olá, {profile?.full_name?.split(' ')[0] || 'Mamãe'}! 👋
                  </h1>
                  {gestationalData && (
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <div className="bg-white/25 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
                        <span className="text-xs font-bold text-white tracking-wide">
                          {gestationalData.weeks} semanas
                        </span>
                      </div>
                      <div className="bg-white/25 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
                        <span className="text-xs font-bold text-white tracking-wide">
                          {gestationalData.trimester}º trimestre
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progresso gestacional responsivo */}
                {gestationalData && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray={`${(gestationalData.weeks / 40) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black text-white">
                        {Math.round((gestationalData.weeks / 40) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem e CTAs responsivos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <p className="text-pink-100 text-xs sm:text-sm font-medium flex-1 leading-relaxed">
                  {gestationalData?.personalizedMessage || "Aproveite cada momento especial"}
                </p>
                
                {/* CTAs responsivos */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic('light');
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                    }}
                    className="bg-white text-pink-600 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold flex items-center gap-1 sm:gap-1.5 shadow-lg text-xs tracking-wide min-h-[36px] sm:min-h-[40px]"
                    aria-label="Compartilhar memória"
                  >
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                    <span className="hidden xs:inline">Compartilhar</span>
                    <span className="xs:hidden">+</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic('light');
                      document.getElementById('dicas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/25 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs hover:bg-white/35 transition-colors tracking-wide min-h-[36px] sm:min-h-[40px]"
                    aria-label="Ver dicas"
                  >
                    Dicas
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dicas Personalizadas - ULTRA COMPACTA */}
        {gestationalData && (
          <motion.div
            id="dicas-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <BookOpen className="w-4 h-4 text-pink-300" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-white text-base tracking-wide">
                    Dicas {gestationalData.trimester}º trimestre
                  </h3>
                </div>
                <div className="text-xs text-pink-200 font-semibold bg-pink-500/20 px-2 py-1 rounded-full">
                  {gestationalData.weeks} semanas
                </div>
              </div>

              {/* Apenas 2 dicas visíveis sem scroll */}
              <div className="space-y-2">
                {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-pink-100 leading-relaxed font-medium">{tip}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
                className="text-pink-300 text-sm font-semibold mt-3 flex items-center gap-2 hover:text-pink-200 transition-colors"
              >
                Ver todas as dicas
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Minha Rotina - COMPACTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-300" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-white text-base tracking-wide">Minha Rotina</h3>
              </div>
              <div className="text-xs text-blue-200 font-semibold bg-blue-500/20 px-2 py-1 rounded-full">Hoje</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
                <span className="text-sm text-pink-100 font-medium">Meditação matinal (5 min)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span className="text-sm text-pink-100 font-medium">Exercícios leves (15 min)</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
              }}
              className="text-blue-300 text-sm font-semibold mt-3 flex items-center gap-2 hover:text-blue-200 transition-colors"
            >
              Ver rotina completa
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {/* Quick Actions Grid 2x2 - Layout Limpo e Funcional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Grid 2x2 Simples */}
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                aria-label={`${action.title} - ${action.subtitle}`}
              >
                {/* Background pattern sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Ícone maior */}
                  <div className="mb-4">
                    <action.icon className="w-8 h-8" aria-hidden="true" />
                  </div>

                  {/* Texto com hierarquia visual clara */}
                  <div className="text-left">
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

          {/* Botão de Ação Principal - Separado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('medium');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 group"
              aria-label="Criar nova publicação - Compartilhar Experiência"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
              <span className="font-bold text-lg tracking-wide">Compartilhar Experiência</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageSimple;
