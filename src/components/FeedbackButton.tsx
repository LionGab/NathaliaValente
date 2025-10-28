import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Send, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackEvent, trackUserJourney } from '../lib/analytics';

interface FeedbackButtonProps {
    userWeek?: number;
    userId?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
    userWeek = 0,
    userId
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim() || rating === 0) return;

        setIsSubmitting(true);

        try {
            // Salvar no Supabase
            const { error } = await supabase
                .from('user_feedback')
                .insert({
                    user_id: userId,
                    feedback_text: feedback,
                    rating: rating,
                    user_week: userWeek,
                    feature_used: window.location.pathname,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            // Track analytics
            trackEvent('feedback_submitted', {
                rating: rating,
                feedback_length: feedback.length,
                user_week: userWeek
            });

            setSubmitted(true);

            // Fechar modal após 2 segundos
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setRating(0);
                setFeedback('');
            }, 2000);

        } catch (error) {
            console.error('Erro ao salvar feedback:', error);
            alert('Ops! Algo deu errado. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        trackEvent('feedback_modal_opened', {
            user_week: userWeek
        });
    };

    return (
        <>
            {/* Botão Flutuante Maternal */}
            <motion.button
                onClick={handleOpen}
                className="fixed bottom-20 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-3xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, type: "spring", stiffness: 200 }}
            >
                <Heart className="w-6 h-6" />
            </motion.button>

            {/* Modal de Feedback */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            {!submitted ? (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-100 rounded-full">
                                                <Heart className="w-5 h-5 text-pink-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Sua opinião importa! 💗
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <p className="text-gray-700 font-medium mb-3">
                                            De 0 a 10, quanto você recomendaria o app para outras mães?
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <motion.button
                                                    key={num}
                                                    onClick={() => setRating(num)}
                                                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-200 ${rating === num
                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110 shadow-lg'
                                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                        }`}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {num}
                                                </motion.button>
                                            ))}
                                        </div>
                                        {rating > 0 && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-gray-600 mt-2"
                                            >
                                                {rating <= 3 && '😔 Vamos melhorar isso!'}
                                                {rating >= 4 && rating <= 6 && '😊 Obrigada pelo feedback!'}
                                                {rating >= 7 && rating <= 8 && '😍 Que bom que está gostando!'}
                                                {rating >= 9 && '🥰 Você é demais! Obrigada!'}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Feedback Text */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2">
                                            O que poderíamos melhorar? (opcional)
                                        </label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Conte-nos sua experiência, sugestões, ou o que mais te incomoda..."
                                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                                            rows={4}
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {feedback.length}/500 caracteres
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        onClick={handleSubmit}
                                        disabled={rating === 0 || isSubmitting}
                                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${rating === 0 || isSubmitting
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                                            }`}
                                        whileHover={rating > 0 && !isSubmitting ? { scale: 1.02 } : {}}
                                        whileTap={rating > 0 && !isSubmitting ? { scale: 0.98 } : {}}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Enviar Feedback
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            ) : (
                                /* Success State */
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Heart className="w-8 h-8 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Obrigada! 💗
                                    </h3>
                                    <p className="text-gray-600">
                                        Seu feedback é muito importante para nós. Vamos usar sua sugestão para melhorar o app!
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
