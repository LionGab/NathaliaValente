import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import { 
  Calendar, Users, ShoppingBag, HelpCircle, Heart, Star, Baby, BookOpen, Shield, 
  Clock, TrendingUp, CheckCircle
} from 'lucide-react';

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
                {/* Hero Card - Igual à imagem */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-50" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>

                    {/* Star icon no canto superior direito */}
                    <div className="absolute top-4 right-4">
                        <Star className="w-6 h-6 text-white/60" />
                    </div>

            <div className="relative z-10">
              {/* Título principal personalizado */}
              <h1 className="text-2xl font-bold mb-2">
                {gestationalData?.personalizedMessage || "Bem-vinda à Nossa Maternidade!"}
              </h1>
              
              {/* Informações gestacionais */}
              {gestationalData && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {gestationalData.weeks} semanas
                      </span>
                    </div>
                    <div className="text-xs text-pink-100">
                      {gestationalData.trimester}º trimestre
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {gestationalData.phase === 'early' ? 'Início' : 
                         gestationalData.phase === 'mid' ? 'Meio' : 'Final'}
                      </span>
                    </div>
                    <div className="text-xs text-pink-100">
                      do trimestre
                    </div>
                  </div>
                </div>
              )}
              
              {/* Subtítulo */}
              <p className="text-pink-100 text-sm mb-6">
                Acompanhe cada momento especial da sua gestação
              </p>

                        {/* Botão de ação */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-pink-600 px-4 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                            >
                                <Heart className="w-4 h-4" />
                                Compartilhar memória
                            </motion.button>

                            {/* Ícone de coração */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <Heart className="w-5 h-5 text-white" />
                            </motion.button>
                        </div>
                    </div>
            </div>
        </motion.div>

        {/* Dicas Personalizadas por Trimestre */}
        {gestationalData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-100 rounded-xl">
                  <BookOpen className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-800">
                  Dicas para o {gestationalData.trimester}º trimestre
                </h3>
              </div>
              
              <div className="space-y-2">
                {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
              
              <button className="text-pink-600 text-sm font-medium mt-3 flex items-center gap-1">
                Ver todas as dicas
                <TrendingUp className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions Grid - Focado em saúde gestacional */ }
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
    >
        {quickActions.map((action, index) => (
            <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                    {/* Ícone */}
                    <div className="mb-4">
                        <action.icon className="w-8 h-8" />
                    </div>

                    {/* Texto */}
                    <div className="text-left">
                        <h3 className="font-bold text-lg mb-1">
                            {action.title}
                        </h3>
                        <p className="text-sm opacity-90">
                            {action.subtitle}
                        </p>
                    </div>
                </div>
            </motion.button>
        ))}
    </motion.div>
      </div >
    </div >
  );
};

export default HomePageSimple;
