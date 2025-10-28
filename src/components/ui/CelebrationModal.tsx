import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown, Gift, X } from 'lucide-react';

interface CelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'streak' | 'task_complete' | 'level_up' | 'badge_earned';
    title: string;
    message: string;
    reward?: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    reward
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Save previously focused element
            previouslyFocusedElement.current = document.activeElement as HTMLElement;

            // Focus modal
            modalRef.current?.focus();

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Trigger haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }

            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            // Handle Escape key
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
                // Restore focus
                previouslyFocusedElement.current?.focus();
            };
        }
    }, [isOpen, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'streak':
                return <Trophy className="w-12 h-12 text-yellow-500" />;
            case 'task_complete':
                return <Star className="w-12 h-12 text-blue-500" />;
            case 'level_up':
                return <Crown className="w-12 h-12 text-purple-500" />;
            case 'badge_earned':
                return <Gift className="w-12 h-12 text-green-500" />;
            default:
                return <Star className="w-12 h-12 text-pink-500" />;
        }
    };

    const getBackgroundGradient = () => {
        switch (type) {
            case 'streak':
                return 'from-yellow-400 to-orange-500';
            case 'task_complete':
                return 'from-blue-400 to-cyan-500';
            case 'level_up':
                return 'from-purple-400 to-pink-500';
            case 'badge_earned':
                return 'from-green-400 to-emerald-500';
            default:
                return 'from-pink-400 to-rose-500';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                    role="presentation"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-3xl p-8 text-white text-center max-w-sm w-full relative overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="celebration-title"
                        aria-describedby="celebration-message"
                        tabIndex={-1}
                    >
                        {/* Confetti Animation */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                        y: [0, -100],
                                        x: [0, (Math.random() - 0.5) * 200]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                    }}
                                />
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            aria-label="Fechar celebração"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>

                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mb-4"
                            aria-hidden="true"
                        >
                            {getIcon()}
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            id="celebration-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold mb-2"
                        >
                            {title}
                        </motion.h2>

                        {/* Message */}
                        <motion.p
                            id="celebration-message"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 mb-4"
                        >
                            {message}
                        </motion.p>

                        {/* Reward */}
                        {reward && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                className="bg-white/20 rounded-2xl p-4 mb-4"
                            >
                                <p className="text-sm font-medium">Recompensa:</p>
                                <p className="text-lg font-bold">{reward}</p>
                            </motion.div>
                        )}

                        {/* Celebration Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-4xl"
                        >
                            🎉
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
