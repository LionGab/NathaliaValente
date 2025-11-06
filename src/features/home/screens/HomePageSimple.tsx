import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar, Users, Heart, Baby, BookOpen, Shield,
  CheckCircle, Plus, Bell, Target, ChevronRight
} from 'lucide-react';

const HomePageSimple = () => {
  const { profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { gestationalData } = useGestationalPersonalization();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dados estáticos memoizados
  const quickActions = useMemo(() => [
    {
      id: 'routine',
      title: 'Minha Rotina',
      subtitle: 'Acompanhe sua gestação',
      icon: Calendar,
      bgColor: 'bg-blue-600'
    },
    {
      id: 'community',
      title: 'Comunidade',
      subtitle: 'Conecte-se com outras mães',
      icon: Users,
      bgColor: 'bg-blue-500'
    },
    {
      id: 'nathia',
      title: 'NathIA',
      subtitle: 'Sua assistente gestacional',
      icon: Baby,
      bgColor: 'bg-blue-700'
    },
    {
      id: 'support',
      title: 'Apoio',
      subtitle: 'Dicas e orientações',
      icon: Shield,
      bgColor: 'bg-cyan-500'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-full mx-auto px-4 py-6 pb-24">
        {/* Hero Card Simplificado */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-gray-900">
                  Olá, {userName}! 👶
                </CardTitle>
                {gestationalData && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      {gestationalData.weeks} semanas
                    </span>
                    <span className="text-sm font-semibold text-blue-800 bg-blue-200 px-3 py-1 rounded-full">
                      {gestationalData.trimester}º trimestre
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  triggerHaptic('light');
                  setShowNotifications(!showNotifications);
                }}
                className="relative"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {showNotifications && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {gestationalData && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-700 font-medium">Progresso da Gestação</span>
                  <span className="font-bold text-blue-700">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Heart className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Simplificado */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className={`${action.bgColor} hover:opacity-90 text-white h-auto p-4 flex-col gap-2`}
                aria-label={`${action.title} - ${action.subtitle}`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-left w-full">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.subtitle}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Dicas - Simplificado */}
        {gestationalData && gestationalData.healthTips && (
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Dicas {gestationalData.trimester}º trimestre
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {gestationalData.healthTips.slice(0, 2).map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => {
                  triggerHaptic('light');
                  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                }}
              >
                Ver todas as dicas
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Principal */}
        <Button
          onClick={() => {
            triggerHaptic('medium');
            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg font-semibold"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Compartilhar Experiência
        </Button>
      </div>
    </div>
  );
};

export default HomePageSimple;
