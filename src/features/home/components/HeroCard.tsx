import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Share2, Heart, Sparkles } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <Card 
      className="h-auto min-h-32 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-700 p-6 rounded-3xl shadow-glow hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
      data-testid="hero-card"
    >
      {/* Decoração com icon */}
      <Sparkles className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity" />
      
      <div>
        <h2 className="text-lg font-bold text-white mb-1">
          Bem-vinda à Nossa Maternidade!
        </h2>
        <p className="text-sm text-white/90">
          Compartilhe seus momentos especiais
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Compartilhar
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
