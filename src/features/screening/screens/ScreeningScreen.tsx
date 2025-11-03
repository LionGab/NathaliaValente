import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Sparkles, ChevronRight, Check } from 'lucide-react';
import { preScreeningQuestions, getScreeningRecommendations } from '../data/questions';
import { aiService } from '../../../lib/ai/aiService';

interface ScreeningScreenProps {
  onComplete: (results: {
    answers: Record<string, number | string>;
    recommendations: string[];
    emotionalScore: number;
  }) => void;
}

export const ScreeningScreen: React.FC<ScreeningScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQuestion = preScreeningQuestions[currentStep];
  const progress = ((currentStep + 1) / preScreeningQuestions.length) * 100;

  const handleAnswer = async (value: number | string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Move to next question or complete
    if (currentStep < preScreeningQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // All questions answered - analyze
      setIsAnalyzing(true);

      // Get AI analysis
      const analysisText = Object.entries(newAnswers)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');

      try {
        await aiService.analyzeEmotionalState(`Respostas do questionário: ${analysisText}`, {
          isPostpartum: true,
        });
      } catch (error) {
        console.error('Error analyzing:', error);
      }

      const recommendations = getScreeningRecommendations(newAnswers);
      const emotionalScore = calculateEmotionalScoreFromAnswers(newAnswers);

      setTimeout(() => {
        onComplete({
          answers: newAnswers,
          recommendations,
          emotionalScore,
        });
      }, 2000);
    }
  };

  const calculateEmotionalScoreFromAnswers = (ans: Record<string, number | string>): number => {
    // Simple calculation - can be enhanced
    const numericAnswers = Object.values(ans).filter((v) => typeof v === 'number') as number[];
    const avg = numericAnswers.reduce((sum, val) => sum + val, 0) / numericAnswers.length;
    return Math.min(10, Math.max(0, avg * 2));
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Brain className="w-full h-full text-purple-500" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Analisando suas respostas...
          </h2>
          <p className="text-gray-600">Preparando recomendações personalizadas para você</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bem-vinda ao Nossa Maternidade</h1>
              <p className="text-sm text-gray-600">Vamos conhecer você melhor</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">
            Pergunta {currentStep + 1} de {preScreeningQuestions.length}
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                  {currentQuestion.category === 'emotional' && 'Bem-estar Emocional'}
                  {currentQuestion.category === 'physical' && 'Saúde Física'}
                  {currentQuestion.category === 'social' && 'Suporte Social'}
                  {currentQuestion.category === 'routine' && 'Rotina e Autocuidado'}
                  {currentQuestion.category === 'screening' && 'Avaliação de Saúde Mental'}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
                {currentQuestion.text}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options?.map((option) => (
                  <motion.button
                    key={String(option.value)}
                    onClick={() => handleAnswer(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group
                      ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                  >
                    <span className="text-lg font-medium text-gray-700 group-hover:text-purple-700">
                      {option.label}
                    </span>
                    {answers[currentQuestion.id] === option.value ? (
                      <Check className="w-6 h-6 text-purple-500" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Helper Text */}
              {currentQuestion.required && (
                <p className="text-sm text-gray-500 mt-6 text-center">
                  Suas respostas são confidenciais e nos ajudam a personalizar sua experiência
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm p-4 text-center">
        <p className="text-xs text-gray-500">🔒 Suas informações são privadas e seguras</p>
      </div>
    </div>
  );
};
