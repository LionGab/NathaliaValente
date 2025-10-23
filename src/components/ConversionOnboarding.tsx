import { useState } from 'react';
import { Check, Crown, Users, Heart, Star, ArrowRight } from 'lucide-react';

interface ConversionOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ConversionOnboarding = ({ onComplete, onSkip }: ConversionOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  const steps = [
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Bem-vinda ao Club Nath!",
      subtitle: "Sua comunidade exclusiva de bem-estar",
      description: "Conecte-se com outras mães e receba suporte da Nath"
    },
    {
      icon: <Heart className="w-12 h-12 text-pink-500" />,
      title: "Conteúdo Exclusivo",
      subtitle: "Acesso antecipado ao melhor conteúdo",
      description: "Lives privadas, dicas exclusivas e Q&A personalizado"
    },
    {
      icon: <Star className="w-12 h-12 text-purple-500" />,
      title: "Suporte Prioritário",
      subtitle: "Respostas diretas da Nath",
      description: "Sua mensagem será respondida em até 24h"
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      features: [
        'Acesso ao feed básico',
        'Comunidade limitada',
        'Conteúdo público'
      ],
      cta: 'Continuar Gratuito',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 39',
      period: 'por mês',
      features: [
        'Acesso total ao Club Nath',
        'Lives exclusivas da Nath',
        'Grupo VIP no WhatsApp',
        'Suporte prioritário 24/7',
        'Conteúdo antecipado',
        'Sem anúncios'
      ],
      cta: 'Assinar Premium',
      popular: true
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePlanSelect = (planId: 'free' | 'premium') => {
    setSelectedPlan(planId);
  };

  if (currentStep < steps.length) {
    const step = steps[currentStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              {step.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
            <h3 className="text-lg text-gray-700 mb-4">{step.subtitle}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors touch-target"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-target"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Plan Selection Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Plano</h2>
          <p className="text-gray-600">Comece grátis ou tenha acesso total</p>
        </div>

        <div className="space-y-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-pink-500 ring-opacity-50' : ''}`}
              onClick={() => handlePlanSelect(plan.id as 'free' | 'premium')}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.period}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id
                    ? 'border-pink-500 bg-pink-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 touch-target"
        >
          <span>{plans.find(p => p.id === selectedPlan)?.cta}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Pagamento seguro • ✅ Cancele quando quiser
        </p>
      </div>
    </div>
  );
};
