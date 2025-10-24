import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Heart, MapPin, Clock, Users, Sparkles, Filter, X, ChevronRight, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useNotifications } from '../../../hooks/useNotifications';
import { ConnectionCard } from '../components/ConnectionCard';
import { ConnectionFilters, ConnectionFiltersData } from '../components/ConnectionFilters';
import { useConnections } from '../hooks/useConnections';


export const ConnectionsPage: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<ConnectionFiltersData>({
        babyAge: '6',
        location: 'São Paulo, SP',
        interests: 'Yoga, Parques, Culinária'
    });
    const { user } = useAuth();
    const { showSuccess, showError } = useNotifications();

    const {
        profiles,
        loading,
        currentIndex,
        hasMore,
        findConnections,
        connectWithProfile,
        passProfile,
        resetConnections,
        loadMore
    } = useConnections();

    // Load initial profiles
    useEffect(() => {
        findConnections(filters);
    }, []);

    const handleSuggestConnections = useCallback(async (newFilters: ConnectionFiltersData) => {
        setFilters(newFilters);
        await findConnections(newFilters);
        setShowFilters(false);
    }, [findConnections]);

    const handleConnect = useCallback(async (profileId: string) => {
        await connectWithProfile(profileId);
    }, [connectWithProfile]);

    const handlePass = useCallback(() => {
        passProfile();
    }, [passProfile]);

    const currentProfile = profiles[currentIndex];

    if (loading && profiles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (profiles.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Nenhuma conexão encontrada
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tente ajustar seus filtros para encontrar mais mães compatíveis.
                    </p>
                    <Button
                        onClick={() => setShowFilters(true)}
                        className="bg-pink-500 hover:bg-pink-600"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Ajustar Filtros
                    </Button>
                </div>
            </div>
        );
    }

    if (currentIndex >= profiles.length) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Você viu todos os perfis!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Volte mais tarde para ver novas conexões ou ajuste seus filtros.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => findConnections(filters)}
                            variant="outline"
                        >
                            Ver Novamente
                        </Button>
                        <Button
                            onClick={() => setShowFilters(true)}
                            className="bg-pink-500 hover:bg-pink-600"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Ajustar Filtros
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    <h1 className="text-3xl font-bold text-gray-900">
                        Encontrar Conexões
                    </h1>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Use a IA para encontrar mães com perfis e interesses em comum.
                </p>
            </div>

            {/* Filters Modal */}
            <ConnectionFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleSuggestConnections}
                initialFilters={filters}
                loading={loading}
            />

            {/* Profile Card */}
            {currentProfile && (
                <div className="max-w-sm mx-auto">
                    <ConnectionCard
                        profile={currentProfile}
                        onConnect={handleConnect}
                        onPass={handlePass}
                    />

                    {/* Progress Indicator */}
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-2">
                            {profiles.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === currentIndex
                                            ? 'bg-pink-500'
                                            : index < currentIndex
                                                ? 'bg-gray-300'
                                                : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="flex justify-center mt-8">
                <Button
                    onClick={() => setShowFilters(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Ajustar Filtros
                </Button>
            </div>
        </div>
    );
};
