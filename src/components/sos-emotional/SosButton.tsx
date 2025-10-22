// =====================================================
// CLUBNATH SOS EMOCIONAL BUTTON
// Botão de Crise Emocional
// =====================================================

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  Phone, 
  MessageCircle,
  Users,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sosEmotionalService, CrisisSession, EmergencyResource, CopingTechnique } from '../../services/sos-emotional.service';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SosButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline' | 'full';
  showResources?: boolean;
  showTechniques?: boolean;
}

export const SosButton: React.FC<SosButtonProps> = ({
  size = 'md',
  variant = 'floating',
  showResources = true,
  showTechniques = true
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high' | 'critical' | null>(null);
  const [activeSession, setActiveSession] = useState<CrisisSession | null>(null);
  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>([]);
  const [quickTechniques, setQuickTechniques] = useState<CopingTechnique[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTechnique, setCurrentTechnique] = useState<CopingTechnique | null>(null);
  const [techniqueStep, setTechniqueStep] = useState(0);
  const [techniqueTimer, setTechniqueTimer] = useState(0);

  useEffect(() => {
    if (isOpen && user) {
      loadResources();
      checkActiveSession();
    }
  }, [isOpen, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (techniqueTimer > 0) {
      interval = setInterval(() => {
        setTechniqueTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [techniqueTimer]);

  const loadResources = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [crisisResources, techniques] = await Promise.all([
        sosEmotionalService.getCrisisResources(),
        sosEmotionalService.getQuickTechniques()
      ]);

      setEmergencyResources(crisisResources);
      setQuickTechniques(techniques);
    } catch (error) {
      console.error('Erro ao carregar recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveSession = async () => {
    if (!user) return;

    const session = await sosEmotionalService.getActiveCrisisSession(user.id);
    setActiveSession(session);
  };

  const startCrisisSession = async (level: 'low' | 'medium' | 'high' | 'critical') => {
    if (!user) return;

    setLoading(true);
    try {
      const session = await sosEmotionalService.startCrisisSession(user.id, level);
      if (session) {
        setActiveSession(session);
        setCrisisLevel(level);
        
        // Enviar notificação
        await sosEmotionalService.sendCrisisNotification(user.id, level, session.id!);
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão de crise:', error);
    } finally {
      setLoading(false);
    }
  };

  const endCrisisSession = async (isResolved: boolean) => {
    if (!activeSession || !user) return;

    setLoading(true);
    try {
      await sosEmotionalService.endCrisisSession(activeSession.id!, undefined, isResolved);
      setActiveSession(null);
      setCrisisLevel(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao finalizar sessão de crise:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTechnique = (technique: CopingTechnique) => {
    setCurrentTechnique(technique);
    setTechniqueStep(0);
    setTechniqueTimer(technique.duration_minutes * 60);
  };

  const nextTechniqueStep = () => {
    if (!currentTechnique) return;
    
    if (techniqueStep < currentTechnique.instructions.steps.length - 1) {
      setTechniqueStep(prev => prev + 1);
    } else {
      // Técnica concluída
      if (activeSession && user) {
        sosEmotionalService.logTechniqueUsage(
          user.id,
          currentTechnique.id,
          activeSession.id!,
          5, // Rating padrão
          'Técnica concluída com sucesso'
        );
      }
      setCurrentTechnique(null);
      setTechniqueStep(0);
      setTechniqueTimer(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCrisisLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return {
          label: 'Baixo',
          color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
          icon: '💙'
        };
      case 'medium':
        return {
          label: 'Médio',
          color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
          icon: '💛'
        };
      case 'high':
        return {
          label: 'Alto',
          color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
          icon: '🧡'
        };
      case 'critical':
        return {
          label: 'Crítico',
          color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
          icon: '❤️'
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20',
          icon: '❓'
        };
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl'
  };

  const variantClasses = {
    floating: 'fixed bottom-6 right-6 z-50 shadow-2xl',
    inline: 'relative',
    full: 'w-full'
  };

  if (currentTechnique) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">
              {sosEmotionalService.getCategoryIcon(currentTechnique.category)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {currentTechnique.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentTechnique.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Passo {techniqueStep + 1} de {currentTechnique.instructions.steps.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(techniqueTimer)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${((techniqueStep + 1) / currentTechnique.instructions.steps.length) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
              <p className="text-gray-900 dark:text-white text-center leading-relaxed">
                {currentTechnique.instructions.steps[techniqueStep]}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentTechnique(null);
                setTechniqueStep(0);
                setTechniqueTimer(0);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={nextTechniqueStep}
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
            >
              {techniqueStep < currentTechnique.instructions.steps.length - 1 ? 'Próximo' : 'Concluir'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SOS Button */}
      <div className={`${variantClasses[variant]} ${variant === 'full' ? '' : sizeClasses[size]}`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`
            ${sizeClasses[size]} rounded-full bg-gradient-to-r from-red-500 to-pink-500 
            text-white shadow-lg hover:shadow-xl transform hover:scale-105 
            transition-all duration-300 flex items-center justify-center
            ${variant === 'full' ? 'w-full h-16' : ''}
          `}
        >
          <AlertTriangle className="w-6 h-6" />
        </button>
      </div>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      SOS Emocional
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Estamos aqui para te ajudar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {!loading && !activeSession && (
                <>
                  {/* Crisis Level Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Como você está se sentindo agora?
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(['low', 'medium', 'high', 'critical'] as const).map((level) => {
                        const config = getCrisisLevelConfig(level);
                        return (
                          <button
                            key={level}
                            onClick={() => startCrisisSession(level)}
                            className={`
                              p-4 rounded-xl border-2 transition-all hover:scale-105
                              ${config.color} border-current
                            `}
                          >
                            <div className="text-2xl mb-2">{config.icon}</div>
                            <div className="font-medium">{config.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Resources */}
                  {showResources && emergencyResources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recursos de Emergência
                      </h3>
                      <div className="space-y-3">
                        {emergencyResources.slice(0, 3).map((resource) => (
                          <div key={resource.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                  {resource.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {resource.description}
                                </p>
                                {resource.phone && (
                                  <a
                                    href={`tel:${resource.phone}`}
                                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
                                  >
                                    <Phone className="w-4 h-4" />
                                    {resource.phone}
                                  </a>
                                )}
                              </div>
                              {resource.is_24h && (
                                <div className="flex items-center gap-1 text-green-600 text-xs">
                                  <Clock className="w-3 h-3" />
                                  24h
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!loading && activeSession && (
                <>
                  {/* Active Session */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Sessão de Apoio Ativa
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Nível: {getCrisisLevelConfig(activeSession.crisis_level).label}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Você está em uma sessão de apoio. Use as técnicas abaixo para se acalmar.
                    </p>
                  </div>

                  {/* Quick Techniques */}
                  {showTechniques && quickTechniques.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Técnicas Rápidas
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickTechniques.slice(0, 4).map((technique) => (
                          <button
                            key={technique.id}
                            onClick={() => startTechnique(technique)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {sosEmotionalService.getCategoryIcon(technique.category)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                  {technique.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {technique.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {technique.duration_minutes} min
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* End Session */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => endCrisisSession(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      Continuar Depois
                    </button>
                    <button
                      onClick={() => endCrisisSession(true)}
                      className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Me Sinto Melhor
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
