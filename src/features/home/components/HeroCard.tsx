import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Share2, Heart, Sparkles, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card
        className="h-40 max-h-40 bg-primary-100 p-6 rounded-2xl border border-primary-200 hover:border-primary-300 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
        data-testid="hero-card"
      >
        {/* Subtle accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/30 rounded-full blur-3xl" />

        {/* Icon sutil */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary-400 opacity-60" />
        </motion.div>

        {/* Simplified icon */}
        <motion.div className="absolute top-4 left-4 w-10 h-10 bg-primary-200/50 rounded-xl flex items-center justify-center">
          <Camera className="w-5 h-5 text-primary-600" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center relative z-10 ml-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-xl font-semibold text-neutral-900 mb-1 leading-tight"
          >
            Bem-vinda à Nossa Maternidade!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-neutral-600"
          >
            Compartilhe seus momentos especiais
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 mt-3"
        >
          <Button
            size="sm"
            variant="primary"
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-neutral-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-xl transition-all duration-200"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};
