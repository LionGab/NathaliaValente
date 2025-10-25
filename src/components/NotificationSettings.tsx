// =====================================================
// CLUBNATH NOTIFICATION SETTINGS
// Configurações de Notificações Push
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Clock,
  Heart,
  MessageCircle,
  BookOpen,
  Crown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { notificationsService, NotificationPreferences } from '../services/notifications.service';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
      checkPermission();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const prefs = await notificationsService.getNotificationPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    try {
      const newPermission = await notificationsService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: any) => {
    if (!preferences || !user) return;

    const updatedPreferences = {
      ...preferences,
      [key]: value
    };

    setPreferences(updatedPreferences);

    try {
      setSaving(true);
      await notificationsService.updateNotificationPreferences({
        user_id: user.id,
        [key]: value
      });
    } catch (error) {
      console.error('Erro ao atualizar preferência:', error);
      // Reverter mudança em caso de erro
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  const updateQuietHours = (start: string, end: string) => {
    updatePreference('quiet_hours_start', start);
    updatePreference('quiet_hours_end', end);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar configurações
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Não foi possível carregar suas preferências de notificação.
        </p>
        <Button onClick={loadPreferences} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const notificationTypes = [
    {
      key: 'daily_quotes' as keyof NotificationPreferences,
      title: 'Frase do Dia',
      description: 'Receba sua dose diária de inspiração às 8h',
      icon: <Sun className="w-5 h-5" />,
      color: 'text-yellow-500'
    },
    {
      key: 'feed_highlights' as keyof NotificationPreferences,
      title: 'Destaques do Feed',
      description: 'Veja o que está rolando no ClubNath às 20h',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      key: 'social_interactions' as keyof NotificationPreferences,
      title: 'Interações Sociais',
      description: 'Curtidas, comentários e novas conexões',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-pink-500'
    },
    {
      key: 'prayer_notifications' as keyof NotificationPreferences,
      title: 'Orações Compartilhadas',
      description: 'Quando alguém compartilha um pedido de oração',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-purple-500'
    },
    {
      key: 'journal_reminders' as keyof NotificationPreferences,
      title: 'Lembretes de Journaling',
      description: 'Reflita sobre seu dia às 21h',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      key: 'engagement_reminders' as keyof NotificationPreferences,
      title: 'Lembretes de Engajamento',
      description: 'Sentimos sua falta quando você fica ausente',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-orange-500'
    },
    {
      key: 'sos_followup' as keyof NotificationPreferences,
      title: 'Follow-up SOS',
      description: 'Acompanhamento após usar o botão de crise',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-500'
    },
    {
      key: 'premium_offers' as keyof NotificationPreferences,
      title: 'Ofertas Premium',
      description: 'Promoções e benefícios exclusivos',
      icon: <Crown className="w-5 h-5" />,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <Settings className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notificações
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalize como você quer ser notificada
            </p>
          </div>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        )}
      </div>

      {/* Status da Permissão */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {permission === 'granted' ? 'Notificações Ativadas' : 'Notificações Desativadas'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {permission === 'granted'
                  ? 'Você receberá notificações personalizadas'
                  : 'Ative as notificações para não perder nada'
                }
              </p>
            </div>
          </div>

          {permission !== 'granted' && (
            <Button
              onClick={requestPermission}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Ativar
            </Button>
          )}
        </div>

        {showSuccess && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Notificações ativadas com sucesso! 🎉
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Configurações de Notificação */}
      <div className="space-y-4">
        {notificationTypes.map((type) => (
          <div
            key={type.key}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${type.color}`}>
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[type.key] as boolean}
                  onChange={(e) => updatePreference(type.key, e.target.checked)}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Horário Silencioso */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mt-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Horário Silencioso
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não receber notificações durante este período
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Início
            </label>
            <input
              type="time"
              value={preferences.quiet_hours_start}
              onChange={(e) => updateQuietHours(e.target.value, preferences.quiet_hours_end)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fim
            </label>
            <input
              type="time"
              value={preferences.quiet_hours_end}
              onChange={(e) => updateQuietHours(preferences.quiet_hours_start, e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-200 dark:bg-pink-800 rounded-lg">
            <Bell className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
              💡 Dicas do ClubNath
            </h3>
            <ul className="text-sm text-pink-800 dark:text-pink-300 space-y-1">
              <li>• As notificações são personalizadas e respeitam seu horário silencioso</li>
              <li>• Você pode alterar essas configurações a qualquer momento</li>
              <li>• As notificações ajudam você a se conectar com outras mães</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};