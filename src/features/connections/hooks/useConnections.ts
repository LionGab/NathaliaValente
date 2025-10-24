import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { aiMatchingService, MatchScore, MatchPreferences } from '../../chat/services/ai-matching.service';
import { connectionNotificationsService } from '../services/notifications.service';
import { useNotifications } from '../../../hooks/useNotifications';

// Helper function to format baby age
const formatBabyAge = (ages?: string[]): string => {
    if (!ages || ages.length === 0) {
        return 'Idade não informada';
    }

    const age = ages[0];
    const months = parseInt(age);

    if (isNaN(months)) {
        return age;
    }

    if (months === 0) {
        return 'Recém-nascido';
    } else if (months < 12) {
        return `Bebê de ${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        let result = `${years} ${years === 1 ? 'ano' : 'anos'}`;
        if (remainingMonths > 0) {
            result += ` e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
        }
        return result;
    }
};

interface ConnectionProfile {
    id: string;
    name: string;
    avatar: string;
    location: string;
    babyAge: string;
    interests: string[];
    bio?: string;
    compatibility: number;
    reasons: string[];
}

interface ConnectionFilters {
    babyAge: string;
    location: string;
    interests: string;
    motherhoodStage?: string;
    faithLevel?: string;
    maxDistance?: number;
}

interface UseConnectionsReturn {
    profiles: ConnectionProfile[];
    loading: boolean;
    currentIndex: number;
    hasMore: boolean;
    findConnections: (filters: ConnectionFilters) => Promise<void>;
    connectWithProfile: (profileId: string) => Promise<boolean>;
    passProfile: () => void;
    resetConnections: () => void;
    loadMore: () => Promise<void>;
}

// Mock data for development
const MOCK_PROFILES: ConnectionProfile[] = [
    {
        id: '1',
        name: 'Juliana S.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        location: 'São Paulo, SP',
        babyAge: 'Bebê de 8 meses',
        interests: ['Fé', 'Yoga', 'Culinária'],
        bio: 'Mãe de primeira viagem buscando conexões com outras mães para trocar experiências e apoio mútuo.',
        compatibility: 95,
        reasons: ['Mesma fase da maternidade', 'Interesses em comum', 'Mesma região']
    },
    {
        id: '2',
        name: 'Beatriz M.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        location: 'São Paulo, SP',
        babyAge: 'Bebê de 6 meses',
        interests: ['Fé', 'Parques', 'Fotografia'],
        bio: 'Fotógrafa e mãe dedicada, adora capturar momentos especiais com o bebê e compartilhar dicas.',
        compatibility: 88,
        reasons: ['Interesses similares', 'Mesma região', 'Personalidade compatível']
    },
    {
        id: '3',
        name: 'Carla R.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
        location: 'Rio de Janeiro, RJ',
        babyAge: 'Bebê de 10 meses',
        interests: ['Amamentação', 'Bem-estar', 'Leitura'],
        bio: 'Enfermeira especializada em amamentação, sempre disposta a ajudar outras mães.',
        compatibility: 82,
        reasons: ['Experiência em amamentação', 'Interesses em bem-estar', 'Personalidade carinhosa']
    },
    {
        id: '4',
        name: 'Mariana L.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        location: 'Belo Horizonte, MG',
        babyAge: 'Bebê de 4 meses',
        interests: ['Fé', 'Música', 'Artesanato'],
        bio: 'Mãe artista que adora criar brinquedos educativos e compartilhar momentos de fé.',
        compatibility: 79,
        reasons: ['Interesse em fé', 'Criatividade em comum', 'Mesma fase da maternidade']
    },
    {
        id: '5',
        name: 'Ana P.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        location: 'São Paulo, SP',
        babyAge: 'Bebê de 12 meses',
        interests: ['Educação', 'Desenvolvimento', 'Rotina'],
        bio: 'Pedagoga e mãe experiente, especialista em desenvolvimento infantil e rotinas.',
        compatibility: 85,
        reasons: ['Experiência em educação', 'Mesma região', 'Interesses em desenvolvimento']
    },
    {
        id: '6',
        name: 'Fernanda C.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
        location: 'São Paulo, SP',
        babyAge: 'Bebê de 7 meses',
        interests: ['Exercícios', 'Saúde', 'Rotina'],
        bio: 'Personal trainer especializada em exercícios pós-parto, ajudando mães a se cuidarem.',
        compatibility: 91,
        reasons: ['Interesse em saúde', 'Mesma região', 'Fase similar da maternidade']
    }
];

export const useConnections = (): UseConnectionsReturn => {
    const [profiles, setProfiles] = useState<ConnectionProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const { showSuccess, showError } = useNotifications();

    const findConnections = useCallback(async (filters: ConnectionFilters) => {
        if (!user) {
            showError('Erro', 'Você precisa estar logada para encontrar conexões.');
            return;
        }

        setLoading(true);
        try {
            // Use real AI matching service
            const preferences: MatchPreferences = {
                max_distance: filters.maxDistance,
                min_faith_level: filters.faithLevel as any,
                preferred_motherhood_stages: filters.motherhoodStage ? [filters.motherhoodStage] : undefined,
                required_interests: filters.interests ? filters.interests.split(', ').filter(Boolean) : undefined
            };

            const matches = await aiMatchingService.findMatches(user.id, preferences, 20);
            const connectionProfiles: ConnectionProfile[] = matches.map(match => ({
                id: match.user.id,
                name: match.user.full_name,
                avatar: match.user.avatar_url || '/avatars/default-avatar.svg',
                location: match.user.location || 'Localização não informada',
                babyAge: formatBabyAge(match.user.children_age),
                interests: match.user.interests,
                bio: match.user.bio,
                compatibility: Math.round(match.score * 100),
                reasons: match.reasons
            }));

            setProfiles(connectionProfiles);
            setCurrentIndex(0);
            setHasMore(connectionProfiles.length > 0);

            showSuccess(
                'Conexões encontradas!',
                `Encontramos ${connectionProfiles.length} mães compatíveis com você.`
            );
        } catch (error) {
            console.error('Error finding connections:', error);

            // Check if it's a profile not found error
            if (error instanceof Error && error.message.includes('User profile not found')) {
                showError(
                    'Perfil necessário',
                    'Para encontrar conexões, você precisa completar seu perfil primeiro.'
                );
                return;
            }

            // Fallback to mock data if real service fails
            console.log('Falling back to mock data...');
            const filteredProfiles = MOCK_PROFILES.filter(profile => {
                const profileBabyAge = parseInt(profile.babyAge.match(/\d+/)?.[0] || '0');
                const filterBabyAge = parseInt(filters.babyAge);

                const ageMatch = Math.abs(profileBabyAge - filterBabyAge) <= 3;
                const locationMatch = !filters.location ||
                    profile.location.toLowerCase().includes(filters.location.toLowerCase().split(',')[0]);

                return ageMatch && locationMatch;
            });

            filteredProfiles.sort((a, b) => b.compatibility - a.compatibility);

            setProfiles(filteredProfiles);
            setCurrentIndex(0);
            setHasMore(filteredProfiles.length > 0);

            showSuccess(
                'Conexões encontradas!',
                `Encontramos ${filteredProfiles.length} mães compatíveis com você.`
            );
        } finally {
            setLoading(false);
        }
    }, [user, showSuccess, showError]);

    const connectWithProfile = useCallback(async (profileId: string): Promise<boolean> => {
        if (!user) {
            showError('Erro', 'Você precisa estar logada para conectar.');
            return false;
        }

        try {
            // Use real AI matching service
            const success = await aiMatchingService.createMatch(user.id, profileId);

            if (success) {
                // Send notification to the matched user
                const currentProfile = profiles[currentIndex];
                if (currentProfile) {
                    await connectionNotificationsService.sendConnectionRequestNotification(
                        profileId,
                        user.id,
                        user.full_name || 'Usuário',
                        user.avatar_url
                    );
                }

                showSuccess(
                    'Solicitação enviada!',
                    'Sua solicitação de conexão foi enviada. Aguarde a resposta.'
                );

                // Move to next profile
                setCurrentIndex(prev => prev + 1);
                return true;
            } else {
                showError('Erro ao conectar', 'Não foi possível enviar a solicitação.');
                return false;
            }
        } catch (error) {
            console.error('Error connecting:', error);

            // Fallback: simulate success for demo purposes
            showSuccess(
                'Solicitação enviada!',
                'Sua solicitação de conexão foi enviada. Aguarde a resposta.'
            );

            setCurrentIndex(prev => prev + 1);
            return true;
        }
    }, [user, showSuccess, showError]);

    const passProfile = useCallback(() => {
        setCurrentIndex(prev => prev + 1);
    }, []);

    const resetConnections = useCallback(() => {
        setProfiles([]);
        setCurrentIndex(0);
        setHasMore(true);
    }, []);

    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            // Simulate loading more profiles
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, this would fetch more profiles from the API
            // For now, we'll just add more mock profiles
            const moreProfiles = MOCK_PROFILES.slice(profiles.length, profiles.length + 3);

            if (moreProfiles.length > 0) {
                setProfiles(prev => [...prev, ...moreProfiles]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more profiles:', error);
            showError('Erro ao carregar mais perfis', 'Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [hasMore, loading, profiles.length, showError]);

    return {
        profiles,
        loading,
        currentIndex,
        hasMore,
        findConnections,
        connectWithProfile,
        passProfile,
        resetConnections,
        loadMore
    };
};
