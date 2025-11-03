import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Zap, Heart } from 'lucide-react';

interface NathIACardProps {
  onClick: () => void;
  isActive?: boolean;
}

export const NathIACard: React.FC<NathIACardProps> = ({ onClick, isActive = false }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 },
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl p-6 transition-all duration-300
        col-span-2 shadow-xl hover:shadow-2xl
        focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:ring-offset-2
        ${isActive ? 'ring-4 ring-pink-500/50' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">NathIA</h3>
              <p className="text-pink-100 text-sm">Sua assistente pessoal</p>
            </div>
          </div>

          {/* Status indicator */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="w-3 h-3 rounded-full bg-green-400 shadow-lg"
          />
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-pink-100">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Chat personalizado</span>
          </div>
          <div className="flex items-center gap-2 text-pink-100">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Respostas instantâneas</span>
          </div>
          <div className="flex items-center gap-2 text-pink-100">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Suporte emocional</span>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <span className="text-white font-semibold">Conversar agora</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </motion.button>
  );
};
