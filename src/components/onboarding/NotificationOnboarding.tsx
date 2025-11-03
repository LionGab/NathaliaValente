// =====================================================
// CLUBNATH NOTIFICATION ONBOARDING
// Onboarding para Notificações Push
// =====================================================

import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle,
  Heart,
  MessageCircle,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { notificationsService } from '../../services/notifications.service';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface NotificationOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  userName: string;
}

const notificationBenefits = [
  {
    icon: <Sun className="w-6 h-6" />,
    title: 'Frase do Dia',
    description: 'Sua dose diária de inspiração às 8h',
    color: 'text-yellow-500',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Conexões Sociais',
    description: 'Saiba quando alguém interage com você',
    color: 'text-blue-500',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Apoio Emocional',
    description: 'Lembretes gentis para seu bem-estar',
    color: 'text-pink-500',
  },
  {
    icon: <Moon className="w-6 h-6" />,
    title: 'Horário Silencioso',
    description: 'Não te incomodamos durante seu descanso',
    color: 'text-purple-500',
  },
];

export const NotificationOnboarding: React.FC<NotificationOnboardingProps> = ({
  onComplete,
  onSkip,
  userName,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showSuccess, setShowSuccess] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);

    try {
      const newPermission = await notificationsService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        setShowSuccess(true);

        // Agendar notificações diárias
        await notificationsService.scheduleDailyNotifications(userName);

        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Se negou, continuar mesmo assim
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      // Continuar mesmo com erro
      setTimeout(() => {
        onComplete();
      }, 1000);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Fique Conectada, {userName}! 💜
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Ative as notificações para não perder nenhum momento especial no ClubNath
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {notificationBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${benefit.color}`}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permission Status */}
        {permission !== 'default' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-3">
              {permission === 'granted' ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                      Notificações Ativadas! 🎉
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Você receberá notificações personalizadas
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <BellOff className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400">
                      Notificações Desativadas
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Você pode ativá-las depois nas configurações
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {permission === 'default' && (
            <Button
              onClick={requestPermission}
              disabled={isRequesting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg"
              leftIcon={isRequesting ? <LoadingSpinner size="sm" /> : <Bell className="w-5 h-5" />}
            >
              {isRequesting ? 'Ativando...' : 'Ativar Notificações'}
            </Button>
          )}

          {permission === 'denied' && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Para ativar as notificações, permita-as nas configurações do seu navegador
              </p>
              <Button
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg"
                leftIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continuar
              </Button>
            </div>
          )}

          {permission === 'granted' && showSuccess && (
            <div className="text-center">
              <div className="animate-pulse">
                <p className="text-green-600 dark:text-green-400 font-semibold mb-4">
                  Configurando suas notificações personalizadas...
                </p>
              </div>
            </div>
          )}

          {permission === 'default' && (
            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full py-3 text-gray-600 dark:text-gray-400"
            >
              Pular por enquanto
            </Button>
          )}
        </div>

        {/* Privacy Note */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔒 Sua Privacidade é Importante
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Respeitamos seu horário de descanso (22h às 7h)</li>
                <li>• Você pode desativar a qualquer momento</li>
                <li>• Não compartilhamos seus dados com terceiros</li>
                <li>• Notificações personalizadas e relevantes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
