import { useState } from 'react';
import { Crown, Sparkles, Heart, Users, ShoppingBag, Zap, Star } from 'lucide-react';

interface PremiumFeaturesProps {
  onUpgrade?: () => void;
}

export const PremiumFeatures = ({ onUpgrade }: PremiumFeaturesProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const features = [
    {
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      title: "Acesso VIP Exclusivo",
      description: "Conteúdo premium da Nathália Valente",
      benefit: "Lives privadas e materiais exclusivos"
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-pink-500" />,
      title: "Produtos NAVA Antecipados",
      description: "Primeiro acesso aos lançamentos",
      benefit: "Descontos exclusivos e pré-vendas"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: "IA Nath Personalizada",
      description: "Assistente com personalidade da Nath",
      benefit: "Dicas personalizadas e suporte 24/7"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Comunidade VIP",
      description: "Grupo seleto de mães",
      benefit: "Networking e conexões exclusivas"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6 border border-pink-200/50 dark:border-pink-800/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-claude-gray-900 dark:text-claude-gray-100">
            ClubNath VIP
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-claude-gray-400 hover:text-claude-gray-600 dark:hover:text-claude-gray-300"
        >
          ×
        </button>
      </div>

      <p className="text-claude-gray-600 dark:text-claude-gray-400 mb-4">
        Acesso exclusivo à Nathália Valente e produtos NAVA
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-claude-gray-800/50 rounded-xl">
            <div className="flex-shrink-0 mt-0.5">
              {feature.icon}
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-claude-gray-900 dark:text-claude-gray-100">
                {feature.title}
              </h4>
              <p className="text-xs text-claude-gray-600 dark:text-claude-gray-400">
                {feature.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            R$ 39
            <span className="text-sm font-normal text-claude-gray-500 dark:text-claude-gray-400">/mês</span>
          </div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">
            Cancele quando quiser
          </div>
        </div>
        
        <button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Assinar VIP
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-pink-200/50 dark:border-pink-800/50">
        <div className="flex items-center justify-center gap-4 text-xs text-claude-gray-500 dark:text-claude-gray-400">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Cancelamento fácil</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>Suporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

