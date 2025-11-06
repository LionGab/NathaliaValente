import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar, Users, Heart, Baby, BookOpen, Shield,
  CheckCircle, Plus, Bell, Target, ChevronRight, Sparkles
} from 'lucide-react';

const HomePageSimple = () => {
  const { profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { gestationalData, isLoading } = useGestationalPersonalization();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dados estáticos memoizados
  const quickActions = useMemo(() => [
    {
      id: 'routine',
      title: 'Minha Rotina',
      subtitle: 'Acompanhe sua gestação',
      icon: Calendar,
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'community',
      title: 'Comunidade',
      subtitle: 'Conecte-se com outras mães',
      icon: Users,
      bgColor: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'nathia',
      title: 'NathIA',
      subtitle: 'Sua assistente gestacional',
      icon: Baby,
      bgColor: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      id: 'support',
      title: 'Apoio',
      subtitle: 'Dicas e orientações',
      icon: Shield,
      bgColor: 'bg-cyan-500 hover:bg-cyan-600'
    }
  ], []);

  const handleQuickAction = useCallback((action: string) => {
    triggerHaptic('light');
    const pageMap: Record<string, string> = {
      routine: 'tools',
      community: 'feed',
      nathia: 'chat',
      support: 'chat'
    };
    window.dispatchEvent(new CustomEvent('navigate', { detail: { page: pageMap[action] || 'home' } }));
  }, [triggerHaptic]);

  const userName = useMemo(() => profile?.full_name?.split(' ')[0] || 'Mamãe', [profile]);
  const progressPercentage = useMemo(() => 
    gestationalData ? Math.round((gestationalData.weeks / 40) * 100) : 0,
    [gestationalData]
  );

  // Notificações simplificadas
  const notifications = useMemo(() => [
    {
      id: 1,
      title: 'Dica do dia',
      message: 'Beba mais água! Hidratação é essencial na gestação',
      icon: Sparkles
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-safe">
      <Header />

      <div className="max-w-full mx-auto px-4 py-4 pb-24">
        {/* Hero Card - Mobile Optimized */}
        <Card className="mb-4 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl mb-2 text-gray-900 break-words">
                  Olá, {userName}! 👶
                </CardTitle>
                {isLoading ? (
                  <div className="h-6 w-32 bg-blue-200 rounded-full animate-pulse" />
                ) : gestationalData ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {gestationalData.weeks} semanas
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-blue-800 bg-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {gestationalData.trimester}º trimestre
                    </span>
                  </div>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  triggerHaptic('light');
                  setShowNotifications(!showNotifications);
                }}
                className="relative flex-shrink-0"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-2 bg-blue-200 rounded-full animate-pulse" />
              </div>
            ) : gestationalData ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
                    <span className="text-gray-700 font-medium">Progresso da Gestação</span>
                    <span className="font-bold text-blue-700">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 rounded-full h-2.5 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      triggerHaptic('light');
                      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                    size="default"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Compartilhar</span>
                    <span className="sm:hidden">Compartilhar</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">Complete seu perfil para ver informações personalizadas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificações Dropdown */}
        {showNotifications && (
          <Card className="mb-4 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{notification.title}</h4>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Mobile First Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} text-white h-auto min-h-[100px] p-4 flex-col gap-2 active:scale-[0.97] transition-all`}
                aria-label={`${action.title} - ${action.subtitle}`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                <div className="text-center w-full">
                  <div className="font-semibold text-sm sm:text-base mb-0.5">{action.title}</div>
                  <div className="text-xs sm:text-sm opacity-90 leading-tight">{action.subtitle}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Dicas - Mobile Optimized */}
        {!isLoading && gestationalData && gestationalData.healthTips && gestationalData.healthTips.length > 0 && (
          <Card className="mb-4 border-blue-200 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg break-words">
                    Dicas {gestationalData.trimester}º trimestre
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed break-words">{tip}</span>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
                size="default"
              >
                Ver todas as dicas
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Principal - Mobile Optimized */}
        <Button
          onClick={() => {
            triggerHaptic('medium');
            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg active:scale-[0.98]"
          size="lg"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          Compartilhar Experiência
        </Button>
      </div>
    </div>
  );
};

export default HomePageSimple;
