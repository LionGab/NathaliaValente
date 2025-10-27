import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface SleepSession {
    id: string;
    startTime: Date;
    endTime?: Date;
    duration?: number; // em minutos
    type: 'nap' | 'night';
    quality?: 'good' | 'restless' | 'poor';
    notes?: string;
}

export const SleepTracker: React.FC = () => {
    const [currentSleep, setCurrentSleep] = useState<SleepSession | null>(null);
    const [sessions, setSessions] = useState<SleepSession[]>([]);
    const [babyAge, setBabyAge] = useState<number>(0); // em dias
    const [isSleeping, setIsSleeping] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer para sono atual
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSleeping && currentSleep) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSleeping, currentSleep]);

    const startSleep = (type: 'nap' | 'night') => {
        const newSession: SleepSession = {
            id: Date.now().toString(),
            startTime: new Date(),
            type
        };
        setCurrentSleep(newSession);
        setIsSleeping(true);
        setTimer(0);
    };

    const endSleep = (quality: 'good' | 'restless' | 'poor') => {
        if (currentSleep) {
            const endTime = new Date();
            const duration = Math.floor(timer / 60);

            const completedSession = {
                ...currentSleep,
                endTime,
                duration,
                quality
            };

            setSessions(prev => [completedSession, ...prev]);
            setCurrentSleep(null);
            setIsSleeping(false);
            setTimer(0);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getSleepRecommendations = () => {
        if (babyAge < 30) return "Recém-nascido: 14-17h por dia, cochilos de 30min-3h";
        if (babyAge < 90) return "1-3 meses: 14-16h por dia, cochilos de 1-3h";
        if (babyAge < 180) return "3-6 meses: 12-15h por dia, 3-4 cochilos";
        if (babyAge < 365) return "6-12 meses: 11-14h por dia, 2-3 cochilos";
        return "1+ anos: 10-13h por dia, 1-2 cochilos";
    };

    const getTotalSleepToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return sessions
            .filter(session => session.startTime >= today)
            .reduce((total, session) => total + (session.duration || 0), 0);
    };

    const getNapCount = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return sessions
            .filter(session =>
                session.startTime >= today &&
                session.type === 'nap'
            ).length;
    };

    const getSleepQuality = () => {
        const recentSessions = sessions.slice(0, 5);
        if (recentSessions.length === 0) return null;

        const qualityCounts = recentSessions.reduce((acc, session) => {
            if (session.quality) {
                acc[session.quality] = (acc[session.quality] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(qualityCounts).reduce((sum, count) => sum + count, 0);
        const goodPercentage = ((qualityCounts.good || 0) / total) * 100;

        return Math.round(goodPercentage);
    };

    const getSleepStatus = () => {
        const totalSleep = getTotalSleepToday();
        const napCount = getNapCount();

        if (babyAge < 30) {
            if (totalSleep < 14 * 60) return { status: 'warning', message: 'Pouco sono para esta idade' };
            if (totalSleep > 18 * 60) return { status: 'info', message: 'Muito sono - verifique se está bem' };
            return { status: 'good', message: 'Sono adequado' };
        } else if (babyAge < 90) {
            if (totalSleep < 12 * 60) return { status: 'warning', message: 'Pouco sono para esta idade' };
            if (totalSleep > 16 * 60) return { status: 'info', message: 'Muito sono - verifique se está bem' };
            return { status: 'good', message: 'Sono adequado' };
        } else {
            if (totalSleep < 10 * 60) return { status: 'warning', message: 'Pouco sono para esta idade' };
            if (totalSleep > 14 * 60) return { status: 'info', message: 'Muito sono - verifique se está bem' };
            return { status: 'good', message: 'Sono adequado' };
        }
    };

    const sleepStatus = getSleepStatus();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Cronômetro de Sono
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Acompanhe o sono do seu bebê
                    </p>
                </div>
            </div>

            {/* Idade do bebê */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade do bebê (dias)
                </label>
                <input
                    type="number"
                    value={babyAge}
                    onChange={(e) => setBabyAge(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 45"
                />
            </div>

            {/* Recomendações */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                            Recomendações para esta idade:
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {getSleepRecommendations()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sessão atual */}
            {isSleeping && currentSleep && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {formatTime(timer)}
                        </div>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                            {currentSleep.type === 'nap' ? 'Cochilando' : 'Dormindo à noite'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => endSleep('good')}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Sono Bom
                            </button>
                            <button
                                onClick={() => endSleep('restless')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Sono Inquieto
                            </button>
                            <button
                                onClick={() => endSleep('poor')}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Sono Ruim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles */}
            {!isSleeping && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => startSleep('nap')}
                        className="bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 py-4 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Sun className="w-5 h-5" />
                        Iniciar Cochilo
                    </button>
                    <button
                        onClick={() => startSleep('night')}
                        className="bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-4 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Moon className="w-5 h-5" />
                        Sono Noturno
                    </button>
                </div>
            )}

            {/* Status do dia */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-semibold text-gray-800 dark:text-white">Resumo do Dia</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.floor(getTotalSleepToday() / 60)}h {getTotalSleepToday() % 60}m
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tempo total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {getNapCount()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Cochilos</div>
                    </div>
                </div>

                {/* Status de qualidade */}
                <div className={`rounded-lg p-3 ${sleepStatus.status === 'good'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : sleepStatus.status === 'warning'
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                    }`}>
                    <div className="flex items-center gap-2">
                        {sleepStatus.status === 'good' ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : sleepStatus.status === 'warning' ? (
                            <AlertCircle className="w-4 h-4" />
                        ) : (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className="text-sm font-medium">{sleepStatus.message}</span>
                    </div>
                </div>
            </div>

            {/* Histórico recente */}
            {sessions.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                        Histórico de Hoje
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {sessions.slice(0, 5).map((session) => (
                            <div key={session.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${session.type === 'nap' ? 'bg-yellow-500' : 'bg-indigo-500'
                                        }`}></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {session.startTime.toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-500">
                                        {session.type === 'nap' ? 'cochilo' : 'noite'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                                        {session.duration} min
                                    </span>
                                    {session.quality && (
                                        <div className={`w-2 h-2 rounded-full ${session.quality === 'good' ? 'bg-green-500' :
                                                session.quality === 'restless' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
