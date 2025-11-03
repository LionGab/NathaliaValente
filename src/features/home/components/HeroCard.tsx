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
        className="h-40 max-h-40 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex flex-col justify-between group overflow-hidden relative"
        data-testid="hero-card"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

        {/* Decoração com icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <Sparkles className="absolute top-4 right-4 w-8 h-8 opacity-30 group-hover:opacity-60 transition-all duration-300 text-white" />
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
        >
          <Camera className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl font-bold text-white mb-2 leading-tight"
          >
            Bem-vinda à Nossa Maternidade!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm text-white/90 font-medium"
          >
            Compartilhe seus momentos especiais
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-3 mt-3"
        >
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/25 hover:bg-white/35 text-white border-white/40 backdrop-blur-md text-sm px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar memória
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};
