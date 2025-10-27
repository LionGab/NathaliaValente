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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      <div className="max-w-full mx-auto px-4 py-4 pb-24">
        {/* Hero Card - Compacto e personalizado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative z-10">
              {/* Header com nome e progresso */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-lg font-bold">
                    Olá, {profile?.full_name?.split(' ')[0] || 'Mamãe'}! 👋
                  </h1>
                  {gestationalData && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-white/20 rounded-full px-2 py-1">
                        <span className="text-xs font-semibold">
                          {gestationalData.weeks} semanas
                        </span>
                      </div>
                      <div className="bg-white/20 rounded-full px-2 py-1">
                        <span className="text-xs font-semibold">
                          {gestationalData.trimester}º trimestre
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progresso gestacional com micrográfico */}
                {gestationalData && (
                  <div className="text-right">
                    <div className="w-12 h-12 relative">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
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
                        <span className="text-xs font-bold">
                          {Math.round((gestationalData.weeks / 40) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem personalizada compacta */}
              <p className="text-pink-100 text-sm mb-4">
                {gestationalData?.personalizedMessage || "Acompanhe cada momento especial da sua gestação"}
              </p>

              {/* CTAs com hierarquia visual clara */}
              <div className="flex items-center gap-2">
                {/* CTA Primário - Destaque */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    triggerHaptic('light');
                    window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                  }}
                  className="bg-white text-pink-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Compartilhar memória
                </motion.button>

                {/* CTA Secundário - Mais sutil */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('light');
                    // Scroll para seção de dicas ou navegar para tools
                    document.getElementById('dicas-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/20 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                >
                  Ver todas as dicas
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dicas Personalizadas por Trimestre - Compacta e visível */}
        {gestationalData && (
          <motion.div
            id="dicas-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="bg-white rounded-xl p-3 shadow-md border border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-pink-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Dicas {gestationalData.trimester}º trimestre
                  </h3>
                </div>
                <div className="text-xs text-gray-500">
                  {gestationalData.weeks} semanas
                </div>
              </div>

              <div className="space-y-1.5">
                {gestationalData.healthTips.slice(0, 3).map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
                className="text-pink-600 text-xs font-medium mt-2 flex items-center gap-1 hover:text-pink-700 transition-colors"
              >
                Ver todas as dicas
                <TrendingUp className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Minha Rotina - Seção Melhorada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <EnhancedRoutinePreview
            onViewAll={() => {
              triggerHaptic('light');
              window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
            }}
          />
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
              >
                {/* Background pattern sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Ícone maior */}
                  <div className="mb-4">
                    <action.icon className="w-8 h-8" />
                  </div>

                  {/* Texto mais legível */}
                  <div className="text-left">
                    <h3 className="font-bold text-base mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
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
              aria-label="Criar nova publicação"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-lg">Compartilhar Experiência</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageSimple;
