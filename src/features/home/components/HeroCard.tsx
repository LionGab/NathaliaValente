import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Share2, Heart, Sparkles } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <Card 
      className="h-32 max-h-32 bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
      data-testid="hero-card"
    >
      {/* Decoração com icon */}
      <Sparkles className="absolute top-3 right-3 w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity" />
      
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-lg font-bold text-white mb-1">
          Bem-vinda à Nossa Maternidade!
        </h2>
        <p className="text-sm text-white/90">
          Compartilhe seus momentos especiais
        </p>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-xs px-3 py-1.5"
        >
          <Share2 className="w-3 h-3 mr-1" />
          Compartilhar memória
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10 p-1.5"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
