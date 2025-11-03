/**
 * AI Interaction Flow Component
 * Sentiment analysis questions before main app
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, Baby, Moon } from 'lucide-react';
import type { SentimentQuestion, SentimentAnswer, SentimentAnalysis } from '../types';

interface AIInteractionFlowProps {
  onComplete: (analysis: SentimentAnalysis) => void;
  userId: string;
}

const QUESTIONS: SentimentQuestion[] = [
  {
    id: 1,
    question: 'Como você está se sentindo hoje?',
    type: 'choice',
    options: ['Tranquila', 'Cansada', 'Ansiosa', 'Feliz', 'Sobrecarregada'],
  },
  {
    id: 2,
    question: 'Sua rotina está tranquila ou precisa de um respiro?',
    type: 'choice',
    options: ['Tranquila', 'Um pouco agitada', 'Preciso de um respiro', 'Muito sobrecarregada'],
  },
  {
    id: 3,
    question: 'Há algo que te preocupa neste momento sobre a maternidade?',
    type: 'text',
  },
  {
    id: 4,
    question: 'O que você gostaria de melhorar no seu dia com o bebê?',
    type: 'text',
  },
  {
    id: 5,
    question: 'De 0 a 10, quanto você se sente descansada hoje?',
    type: 'scale',
    min: 0,
    max: 10,
  },
];

const ICONS = [Heart, Sparkles, MessageCircle, Baby, Moon];

export function AIInteractionFlow({ onComplete, userId }: AIInteractionFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SentimentAnswer[]>([]);
  const [textInput, setTextInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [scaleValue, setScaleValue] = useState(5);

  const question = QUESTIONS[currentQuestion];
  const Icon = ICONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  const handleNext = () => {
    // Save current answer
    let answerValue: string | number = '';

    if (question.type === 'text') {
      answerValue = textInput;
    } else if (question.type === 'choice') {
      answerValue = selectedChoice;
    } else if (question.type === 'scale') {
      answerValue = scaleValue;
    }

    const newAnswer: SentimentAnswer = {
      questionId: question.id,
      answer: answerValue,
      timestamp: new Date(),
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Reset inputs
    setTextInput('');
    setSelectedChoice('');
    setScaleValue(5);

    if (isLastQuestion) {
      // Complete and analyze
      const analysis = analyzeAnswers(updatedAnswers);
      onComplete(analysis);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const analyzeAnswers = (allAnswers: SentimentAnswer[]): SentimentAnalysis => {
    // Simple sentiment analysis based on answers
    const firstAnswer = allAnswers[0]?.answer as string;
    const restScore = allAnswers[4]?.answer as number;

    let emotionalState: SentimentAnalysis['emotionalState'] = 'calm';
    let needsSupport = false;

    if (
      firstAnswer?.toLowerCase().includes('ansios') ||
      firstAnswer?.toLowerCase().includes('sobrecarreg')
    ) {
      emotionalState = 'anxious';
      needsSupport = true;
    } else if (firstAnswer?.toLowerCase().includes('cansad')) {
      emotionalState = 'tired';
      needsSupport = restScore < 5;
    } else if (firstAnswer?.toLowerCase().includes('feliz')) {
      emotionalState = 'happy';
    } else if (firstAnswer?.toLowerCase().includes('tranquil')) {
      emotionalState = 'calm';
    }

    // Check if rest score indicates needs support
    if (restScore < 4) {
      needsSupport = true;
    }

    return {
      userId,
      answers: allAnswers,
      emotionalState,
      needsSupport,
      createdAt: new Date(),
    };
  };

  const canProceed = () => {
    if (question.type === 'text') return textInput.trim().length > 0;
    if (question.type === 'choice') return selectedChoice !== '';
    if (question.type === 'scale') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentQuestion
                    ? 'w-8 bg-primary-500'
                    : idx < currentQuestion
                      ? 'w-2 bg-primary-400'
                      : 'w-2 bg-neutral-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-neutral-600">
            Questão {currentQuestion + 1} de {QUESTIONS.length}
          </p>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl shadow-primary-200/50"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Question text */}
            <h2 className="text-2xl font-semibold text-neutral-800 text-center mb-8">
              {question.question}
            </h2>

            {/* Input based on type */}
            <div className="space-y-4 mb-8">
              {question.type === 'text' && (
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Compartilhe seus pensamentos aqui..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-primary-400 focus:outline-none resize-none h-32 transition-colors"
                />
              )}

              {question.type === 'choice' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedChoice(option)}
                      className={`w-full px-6 py-4 rounded-2xl text-left transition-all ${
                        selectedChoice === option
                          ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-white shadow-lg'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'scale' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Nada descansada</span>
                    <span className="text-sm text-neutral-600">Muito descansada</span>
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={scaleValue}
                    onChange={(e) => setScaleValue(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="text-center">
                    <span className="text-4xl font-bold text-primary-600">{scaleValue}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-semibold text-white transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg transform hover:scale-[1.02]'
                  : 'bg-neutral-300 cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? 'Começar' : 'Próxima'}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* NathAI branding */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Powered by NathAI + Gemini 2.5 Flash
          </p>
        </div>
      </div>
    </div>
  );
}
