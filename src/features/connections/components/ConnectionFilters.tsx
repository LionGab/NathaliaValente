import React, { useState } from 'react';
import { X, MapPin, Clock, Tag, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ConnectionFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: ConnectionFiltersData) => void;
    initialFilters?: ConnectionFiltersData;
    loading?: boolean;
}

export interface ConnectionFiltersData {
    babyAge: string;
    location: string;
    interests: string;
    motherhoodStage?: string;
    faithLevel?: string;
    maxDistance?: number;
}

const MOTHERHOOD_STAGES = [
    { value: 'pregnant', label: 'Grávida' },
    { value: 'new_mom', label: 'Mãe de primeira viagem' },
    { value: 'experienced', label: 'Mãe experiente' },
    { value: 'grandmother', label: 'Avó' }
];

const FAITH_LEVELS = [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
];

const INTEREST_SUGGESTIONS = [
    'Fé', 'Yoga', 'Culinária', 'Parques', 'Fotografia', 'Amamentação',
    'Bem-estar', 'Leitura', 'Música', 'Artesanato', 'Educação',
    'Desenvolvimento', 'Rotina', 'Exercícios', 'Meditação'
];

export const ConnectionFilters: React.FC<ConnectionFiltersProps> = ({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    loading = false
}) => {
    const [filters, setFilters] = useState<ConnectionFiltersData>({
        babyAge: '6',
        location: 'São Paulo, SP',
        interests: 'Yoga, Parques, Culinária',
        motherhoodStage: '',
        faithLevel: '',
        maxDistance: 50,
        ...initialFilters
    });

    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        filters.interests ? filters.interests.split(', ').filter(Boolean) : []
    );

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev => {
            const newInterests = prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest];

            setFilters(prevFilters => ({
                ...prevFilters,
                interests: newInterests.join(', ')
            }));

            return newInterests;
        });
    };

    const handleApply = () => {
        onApply(filters);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-pink-500" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Filtros de Busca
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto space-y-6">
                    {/* Baby Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Idade do bebê (meses)
                        </label>
                        <input
                            type="number"
                            value={filters.babyAge}
                            onChange={(e) => setFilters(prev => ({ ...prev, babyAge: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="6"
                            min="0"
                            max="36"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Sua localização
                        </label>
                        <input
                            type="text"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="São Paulo, SP"
                        />
                    </div>

                    {/* Max Distance */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Distância máxima (km)
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="100"
                            value={filters.maxDistance}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5km</span>
                            <span className="font-medium">{filters.maxDistance}km</span>
                            <span>100km</span>
                        </div>
                    </div>

                    {/* Motherhood Stage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fase da maternidade
                        </label>
                        <select
                            value={filters.motherhoodStage}
                            onChange={(e) => setFilters(prev => ({ ...prev, motherhoodStage: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="">Todas as fases</option>
                            {MOTHERHOOD_STAGES.map(stage => (
                                <option key={stage.value} value={stage.value}>
                                    {stage.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Faith Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nível de fé
                        </label>
                        <select
                            value={filters.faithLevel}
                            onChange={(e) => setFilters(prev => ({ ...prev, faithLevel: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="">Todos os níveis</option>
                            {FAITH_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Interests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 inline mr-1" />
                            Seus interesses
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedInterests.map(interest => (
                                <span
                                    key={interest}
                                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium flex items-center gap-1"
                                >
                                    {interest}
                                    <button
                                        onClick={() => handleInterestToggle(interest)}
                                        className="ml-1 hover:text-pink-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_SUGGESTIONS
                                .filter(interest => !selectedInterests.includes(interest))
                                .map(interest => (
                                    <button
                                        key={interest}
                                        onClick={() => handleInterestToggle(interest)}
                                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        {interest}
                                    </button>
                                ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Clique nos interesses para adicionar ou remover.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="flex-1 bg-pink-500 hover:bg-pink-600"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Sugerir Conexões
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
