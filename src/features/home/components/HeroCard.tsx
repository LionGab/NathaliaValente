import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Share2, Heart } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <Card 
      className="h-32 bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex flex-col justify-between"
      data-testid="hero-card"
    >
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
