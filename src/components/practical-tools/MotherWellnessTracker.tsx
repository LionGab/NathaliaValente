import React, { useState, useEffect } from 'react';
import { Heart, Brain, Zap, Smile, TrendingUp, Calendar, Target } from 'lucide-react';

interface WellnessEntry {
    id: string;
    date: string;
    mood: number; // 1-10
    energy: number; // 1-10
    sleep: number; // horas
    stress: number; // 1-10
    selfCare: number; // minutos
    notes?: string;
}

interface WellnessGoal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    category: 'sleep' | 'exercise' | 'selfcare' | 'mood';
}

export const MotherWellnessTracker: React.FC = () => {
    const [entries, setEntries] = useState<WellnessEntry[]>([]);
    const [goals, setGoals] = useState<WellnessGoal[]>([]);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [newEntry, setNewEntry] = useState<Partial<WellnessEntry>>({
        mood: 5,
        energy: 5,
        sleep: 7,
        stress: 5,
        selfCare: 30
    });

    // Inicializar metas padrão
    useEffect(() => {
        const defaultGoals: WellnessGoal[] = [
            {
                id: '1',
                title: 'Horas de sono por noite',
                target: 8,
                current: 0,
                unit: 'horas',
                category: 'sleep'
            },
            {
                id: '2',
                title: 'Minutos de autocuidado por dia',
                target: 60,
                current: 0,
                unit: 'minutos',
                category: 'selfcare'
            },
            {
                id: '3',
                title: 'Nível de energia médio',
                target: 7,
                current: 0,
                unit: 'de 10',
                category: 'mood'
            }
        ];
        setGoals(defaultGoals);
    }, []);

    const addEntry = () => {
        if (!newEntry.mood || !newEntry.energy || !newEntry.sleep) return;

        const entry: WellnessEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            mood: newEntry.mood!,
            energy: newEntry.energy!,
            sleep: newEntry.sleep!,
            stress: newEntry.stress!,
            selfCare: newEntry.selfCare!,
            notes: newEntry.notes
        };

        setEntries(prev => [entry, ...prev]);

        // Atualizar metas
        updateGoals(entry);

        setNewEntry({
            mood: 5,
            energy: 5,
            sleep: 7,
            stress: 5,
            selfCare: 30
        });
        setShowAddEntry(false);
    };

    const updateGoals = (entry: WellnessEntry) => {
        setGoals(prev => prev.map(goal => {
            let current = goal.current;

            switch (goal.category) {
                case 'sleep':
                    current = Math.max(current, entry.sleep);
                    break;
                case 'selfcare':
                    current = Math.max(current, entry.selfCare);
                    break;
                case 'mood':
                    current = Math.max(current, entry.mood);
                    break;
            }

            return { ...goal, current };
        }));
    };

    const getMoodEmoji = (mood: number) => {
        if (mood >= 8) return '😊';
        if (mood >= 6) return '🙂';
        if (mood >= 4) return '😐';
        if (mood >= 2) return '😔';
        return '😢';
    };

    const getMoodColor = (mood: number) => {
        if (mood >= 8) return 'text-green-600 dark:text-green-400';
        if (mood >= 6) return 'text-yellow-600 dark:text-yellow-400';
        if (mood >= 4) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getEnergyColor = (energy: number) => {
        if (energy >= 8) return 'text-blue-600 dark:text-blue-400';
        if (energy >= 6) return 'text-green-600 dark:text-green-400';
        if (energy >= 4) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getStressColor = (stress: number) => {
        if (stress <= 3) return 'text-green-600 dark:text-green-400';
        if (stress <= 6) return 'text-yellow-600 dark:text-yellow-400';
        if (stress <= 8) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getWeeklyAverage = (field: keyof WellnessEntry) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const recentEntries = entries.filter(entry =>
            new Date(entry.date) >= weekAgo
        );

        if (recentEntries.length === 0) return 0;

        const sum = recentEntries.reduce((acc, entry) => acc + (entry[field] as number), 0);
        return Math.round((sum / recentEntries.length) * 10) / 10;
    };

    const getTrend = (field: keyof WellnessEntry) => {
        const recent = entries.slice(0, 3);
        if (recent.length < 2) return 'stable';

        const latest = recent[0][field] as number;
        const previous = recent[1][field] as number;

        if (latest > previous) return 'up';
        if (latest < previous) return 'down';
        return 'stable';
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            default: return '➡️';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return 'text-green-600 dark:text-green-400';
            case 'down': return 'text-red-600 dark:text-red-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Bem-estar da Mãe
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Acompanhe seu autocuidado e bem-estar
                    </p>
                </div>
            </div>

            {/* Resumo semanal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{getMoodEmoji(getWeeklyAverage('mood'))}</div>
                    <div className={`text-lg font-bold ${getMoodColor(getWeeklyAverage('mood'))}`}>
                        {getWeeklyAverage('mood')}/10
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Humor médio</div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className={`text-lg font-bold ${getEnergyColor(getWeeklyAverage('energy'))}`}>
                        {getWeeklyAverage('energy')}/10
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Energia média</div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">😴</div>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {getWeeklyAverage('sleep')}h
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sono médio</div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">🧘</div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {getWeeklyAverage('selfCare')}min
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Autocuidado médio</div>
                </div>
            </div>

            {/* Metas */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Suas Metas
                </h4>
                <div className="space-y-3">
                    {goals.map((goal) => (
                        <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800 dark:text-white">
                                    {goal.title}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {goal.current}/{goal.target} {goal.unit}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botão para adicionar entrada */}
            <button
                onClick={() => setShowAddEntry(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Registrar Bem-estar de Hoje
            </button>

            {/* Histórico recente */}
            {entries.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Histórico Recente
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {entries.slice(0, 7).map((entry) => (
                            <div key={entry.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className={`flex items-center gap-1 ${getMoodColor(entry.mood)}`}>
                                            {getMoodEmoji(entry.mood)} {entry.mood}
                                        </span>
                                        <span className={`flex items-center gap-1 ${getEnergyColor(entry.energy)}`}>
                                            ⚡ {entry.energy}
                                        </span>
                                        <span className="text-indigo-600 dark:text-indigo-400">
                                            😴 {entry.sleep}h
                                        </span>
                                    </div>
                                </div>
                                {entry.notes && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                        "{entry.notes}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal para adicionar entrada */}
            {showAddEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Como você está se sentindo hoje?
                        </h4>

                        <div className="space-y-4">
                            {/* Humor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Humor (1-10): {getMoodEmoji(newEntry.mood || 5)} {newEntry.mood}/10
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={newEntry.mood || 5}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, mood: Number(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Energia */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Energia (1-10): ⚡ {newEntry.energy}/10
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={newEntry.energy || 5}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, energy: Number(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Sono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Horas de sono: 😴 {newEntry.sleep}h
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="12"
                                    step="0.5"
                                    value={newEntry.sleep || 7}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, sleep: Number(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Estresse */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estresse (1-10): {newEntry.stress}/10
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={newEntry.stress || 5}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, stress: Number(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Autocuidado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minutos de autocuidado: 🧘 {newEntry.selfCare}min
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="180"
                                    step="15"
                                    value={newEntry.selfCare || 30}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, selfCare: Number(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notas (opcional)
                                </label>
                                <textarea
                                    value={newEntry.notes || ''}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="Como foi seu dia? O que te fez bem?"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddEntry(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={addEntry}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
