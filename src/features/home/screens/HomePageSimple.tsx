import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
// Importações otimizadas - apenas ícones necessários
import {
  Calendar, Users, Heart, Baby, BookOpen, Shield,
  Clock, CheckCircle, Plus, Bell, Sparkles, Target, Award,
  ChevronRight, Zap, Moon
} from 'lucide-react';

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

      <div className="max-w-full mx-auto px-4 py-4 mobile-bottom-nav">
        {/* Hero Card Melhorado - Hierarquia Visual Clara */}
        <div className="mb-6 group animate-fade-in-up">
          <div className="bg-gradient-to-br from-pink-300 via-rose-200 to-orange-200 rounded-3xl p-6 text-gray-800 shadow-2xl relative overflow-hidden border border-pink-200/50">
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
                    <h1 className="text-3xl font-bold text-gray-800 leading-tight tracking-tight">
                      Olá, {profile?.full_name?.split(' ')[0] || 'Mamãe'}! 👶
                    </h1>
                    <div className="text-sm text-pink-600 font-semibold bg-pink-100 px-3 py-1.5 rounded-full border border-pink-200">
                      {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Dados gestacionais com visual melhorado */}
                  {gestationalData && (
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="bg-pink-100 rounded-2xl px-4 py-2.5 border border-pink-200 shadow-lg">
                        <span className="text-sm font-bold text-pink-700 tracking-wide">
                          {gestationalData.weeks} semanas
                        </span>
                      </div>
                      <div className="bg-purple-100 rounded-2xl px-4 py-2.5 border border-purple-200 shadow-lg">
                        <span className="text-sm font-bold text-purple-700 tracking-wide">
                          {gestationalData.trimester}º trimestre
                        </span>
                      </div>
                      <div className="bg-orange-100 rounded-2xl px-4 py-2.5 border border-orange-200 shadow-lg flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                        <span className="text-sm font-bold text-orange-700 tracking-wide">
                          {todayProgress}% hoje
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notificações inteligentes */}
                <div className="relative">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setShowNotifications(!showNotifications);
                    }}
                    className="relative p-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 hover:scale-110 active:scale-95 transition-all duration-200 touch-target"
                    aria-label="Ver notificações"
                  >
                    <Bell className="w-5 h-5 text-white" aria-hidden="true" />
                    {smartNotifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{smartNotifications.length}</span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown de notificações */}
                  {showNotifications && (
                      <div
                        className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-50 animate-fade-in-up"
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
                      </div>
                    )}
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
                    <div
                      className="bg-white rounded-full h-2 shadow-lg transition-all duration-1000 ease-out"
                      style={{ width: `${(gestationalData.weeks / 40) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Mensagem personalizada e CTAs melhorados */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-gray-700 text-base font-medium flex-1 leading-relaxed">
                  🌸 {gestationalData?.personalizedMessage || "Aproveite cada momento especial da sua jornada"} 🌸
                </p>

                {/* CTAs com visual aprimorado */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                    }}
                    className="bg-pink-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg text-sm tracking-wide hover:bg-pink-600 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 touch-target"
                    aria-label="Compartilhar experiência"
                  >
                    <Heart className="w-4 h-4" aria-hidden="true" />
                    <span>Compartilhar</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      document.getElementById('dicas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/30 touch-target"
                    aria-label="Ver dicas personalizadas"
                  >
                    Dicas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas Personalizadas Melhoradas */}
        {gestationalData && (
          <div
            id="dicas-section"
            className="mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-5 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl">
                    <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl tracking-wide">
                      Dicas {gestationalData.trimester}º trimestre
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">Personalizadas para você</p>
                  </div>
                </div>
                <div className="text-sm text-pink-700 font-bold bg-pink-200 px-4 py-2 rounded-full border border-pink-300 shadow-md">
                  {gestationalData.weeks} semanas
                </div>
              </div>

              {/* Dicas com animação e visual melhorado */}
              <div className="space-y-3">
                {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200 group border border-pink-200 animate-fade-in-left"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="p-1.5 bg-green-400 rounded-full group-hover:bg-green-500 transition-colors">
                      <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed font-semibold flex-1">{tip}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
                className="w-full mt-4 bg-pink-500 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 hover:scale-102 active:scale-98 transition-all duration-200 shadow-md touch-target"
                aria-label="Ver todas as dicas personalizadas"
              >
                Ver todas as dicas
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Minha Rotina com Gamificação */}
        <div
          className="mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-5 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl tracking-wide">Minha Rotina</h3>
                  <p className="text-gray-600 text-sm font-medium">Sua jornada diária</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-blue-700 font-bold bg-blue-200 px-4 py-2 rounded-full border border-blue-300 shadow-md">
                  {streakCount} dias seguidos
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                  <span className="text-yellow-600 font-bold text-sm">{streakCount}</span>
                </div>
              </div>
            </div>

            {/* Progresso do dia */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progresso de hoje</span>
                <span className="text-sm font-bold text-blue-700">{todayProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full h-2 shadow-lg transition-all duration-1000 ease-out"
                  style={{ width: `${todayProgress}%` }}
                />
              </div>
            </div>

            {/* Atividades da rotina */}
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200 group border border-blue-200 animate-fade-in-left"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="p-1.5 bg-green-400 rounded-full group-hover:bg-green-500 transition-colors">
                  <CheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-700 font-semibold">Meditação matinal (5 min)</span>
                  <p className="text-xs text-gray-600 font-medium">Conecte-se com seu bebê</p>
                </div>
                <div className="text-xs text-green-600 font-bold">✓</div>
              </div>

              <div
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group animate-fade-in-left"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="p-1.5 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors">
                  <Clock className="w-4 h-4 text-yellow-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-pink-100 font-medium">Exercícios leves (15 min)</span>
                  <p className="text-xs text-pink-200">Próximo: 14:00</p>
                </div>
                <div className="text-xs text-yellow-300 font-bold">⏰</div>
              </div>

              <div
                className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200 group animate-fade-in-left"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="p-1.5 bg-purple-400/20 rounded-full group-hover:bg-purple-400/30 transition-colors">
                  <Moon className="w-4 h-4 text-purple-300" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-pink-100 font-medium">Relaxamento noturno (10 min)</span>
                  <p className="text-xs text-pink-200">Às 20:00</p>
                </div>
                <div className="text-xs text-purple-300 font-bold">🌙</div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
              }}
              className="w-full mt-4 bg-blue-500 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:scale-102 active:scale-98 transition-all duration-200 shadow-md touch-target"
              aria-label="Ver rotina completa e gerenciar atividades"
            >
              Ver rotina completa
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Quick Actions Grid Melhorado */}
        <div
          className="space-y-6 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          {/* Grid 2x2 - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} text-white p-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-103 hover:-translate-y-0.5 active:scale-97 transition-all duration-300 group relative overflow-hidden border border-white/20 animate-fade-in-up touch-target`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
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
                    <h3 className="font-bold text-base sm:text-lg mb-2 text-white tracking-wide mobile-text">
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium mobile-text-sm">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Seção de Estatísticas Rápidas */}
          <div
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="mobile-grid-2 sm:grid-cols-3 mobile-gap">
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
          </div>

          {/* Botão de Ação Principal Melhorado */}
          <div
            className="flex justify-center animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <button
              onClick={() => {
                triggerHaptic('medium');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
              }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-3 group relative overflow-hidden touch-target"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSimple;
