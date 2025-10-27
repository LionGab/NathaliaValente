import React, { useState, useEffect } from 'react';
import { X, Crown, Heart, Users, Star } from 'lucide-react';

interface MonetizationBannerProps {
  onClose: () => void;
  variant?: 'premium' | 'community' | 'exclusive';
}

export const MonetizationBanner = ({
  onClose,
  variant = 'premium'
}: MonetizationBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getBannerContent = () => {
    switch (variant) {
      case 'premium':
        return {
          icon: <Crown className="w-6 h-6 text-yellow-500" />,
          title: "✨ Conteúdo Exclusivo",
          subtitle: "Acesso antecipado a materiais especiais",
          features: ["Vídeos privados", "Dicas exclusivas", "Q&A personalizado"],
          cta: "Ver conteúdo",
          gradient: "from-purple-500 to-pink-600"
        };
      case 'community':
        return {
          icon: <Users className="w-6 h-6 text-blue-500" />,
          title: "💬 Comunidade Exclusiva",
          subtitle: "Conecte-se com outras mães",
          features: ["Chat privado", "Suporte 24/7", "Eventos exclusivos"],
          cta: "Entrar no grupo",
          gradient: "from-blue-500 to-cyan-600"
        };
      case 'exclusive':
        return {
          icon: <Star className="w-6 h-6 text-purple-500" />,
          title: "✨ Conteúdo Exclusivo",
          subtitle: "Acesso antecipado",
          features: ["Vídeos privados", "Dicas exclusivas", "Q&A personalizado"],
          cta: "Ver conteúdo",
          gradient: "from-purple-500 to-pink-600"
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className={`bg-gradient-to-r ${content.gradient} rounded-2xl p-4 shadow-2xl text-white`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {content.icon}
            <div>
              <h3 className="font-bold text-lg">{content.title}</h3>
              <p className="text-sm opacity-90">{content.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-pink-200" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors touch-target">
          {content.cta}
        </button>
      </div>
    </div>
  );
};
