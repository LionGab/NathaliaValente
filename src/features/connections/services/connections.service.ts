import { supabase } from '../../../lib/supabase';
import { aiMatchingService, MatchScore, MatchPreferences } from '../../chat/services/ai-matching.service';
import { trackEngagement } from '../../../lib/analytics';

export interface ConnectionProfile {
    id: string;
    name: string;
    avatar: string;
    location: string;
    babyAge: string;
    interests: string[];
    bio?: string;
    compatibility: number;
    reasons: string[];
    motherhoodStage: string;
    faithLevel: string;
    personalityTraits: string[];
}

export interface ConnectionFilters {
    babyAge: string;
    location: string;
    interests: string;
    motherhoodStage?: string;
    faithLevel?: string;
    maxDistance?: number;
}

export interface ConnectionRequest {
    id: string;
    from_user_id: string;
    to_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    created_at: string;
    updated_at: string;

    // Relations
    from_user?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    to_user?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}

export interface Connection {
    id: string;
    user1_id: string;
    user2_id: string;
    status: 'active' | 'blocked';
    created_at: string;
    updated_at: string;

    // Relations
    user1?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    user2?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}

class ConnectionsService {
    /**
     * Find potential connections using AI matching
     */
    async findConnections(
        userId: string,
        filters: ConnectionFilters,
        limit: number = 20
    ): Promise<ConnectionProfile[]> {
        try {
            // Convert filters to MatchPreferences
            const preferences: MatchPreferences = {
                max_distance: filters.maxDistance,
                min_faith_level: filters.faithLevel as any,
                preferred_motherhood_stages: filters.motherhoodStage ? [filters.motherhoodStage] : undefined,
                required_interests: filters.interests ? filters.interests.split(', ').filter(Boolean) : undefined
            };

            // Get AI matches
            const matches = await aiMatchingService.findMatches(userId, preferences, limit);

            // Convert to ConnectionProfile format
            const connectionProfiles: ConnectionProfile[] = matches.map(match => ({
                id: match.user.id,
                name: match.user.full_name,
                avatar: match.user.avatar_url || '/avatars/default-avatar.svg',
                location: match.user.location || 'Localização não informada',
                babyAge: this.formatBabyAge(match.user.children_age),
                interests: match.user.interests,
                bio: match.user.bio,
                compatibility: Math.round(match.score * 100),
                reasons: match.reasons,
                motherhoodStage: match.user.motherhood_stage,
                faithLevel: match.user.faith_level,
                personalityTraits: match.user.personality_traits
            }));

            // Track engagement
            trackEngagement('connections_found', 'ai_matching', userId, connectionProfiles.length);

            return connectionProfiles;
        } catch (error) {
            console.error('Error finding connections:', error);
            throw new Error('Erro ao buscar conexões. Tente novamente.');
        }
    }

    /**
     * Send a connection request
     */
    async sendConnectionRequest(
        fromUserId: string,
        toUserId: string,
        message?: string
    ): Promise<ConnectionRequest> {
        try {
            const { data, error } = await supabase
                .from('connection_requests')
                .insert({
                    from_user_id: fromUserId,
                    to_user_id: toUserId,
                    status: 'pending',
                    message
                })
                .select(`
          *,
          from_user:profiles!connection_requests_from_user_id_fkey(id, full_name, avatar_url),
          to_user:profiles!connection_requests_to_user_id_fkey(id, full_name, avatar_url)
        `)
                .single();

            if (error) {
                console.error('Error sending connection request:', error);
                throw new Error('Erro ao enviar solicitação de conexão.');
            }

            // Track engagement
            trackEngagement('connection_request_sent', 'connections', fromUserId, 1);

            return data as ConnectionRequest;
        } catch (error) {
            console.error('Error sending connection request:', error);
            throw error;
        }
    }

    /**
     * Respond to a connection request
     */
    async respondToConnectionRequest(
        requestId: string,
        userId: string,
        accepted: boolean
    ): Promise<ConnectionRequest> {
        try {
            const { data, error } = await supabase
                .from('connection_requests')
                .update({
                    status: accepted ? 'accepted' : 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId)
                .eq('to_user_id', userId)
                .select(`
          *,
          from_user:profiles!connection_requests_from_user_id_fkey(id, full_name, avatar_url),
          to_user:profiles!connection_requests_to_user_id_fkey(id, full_name, avatar_url)
        `)
                .single();

            if (error) {
                console.error('Error responding to connection request:', error);
                throw new Error('Erro ao responder à solicitação.');
            }

            // If accepted, create the connection
            if (accepted && data) {
                await this.createConnection(data.from_user_id, data.to_user_id);
            }

            // Track engagement
            trackEngagement(
                accepted ? 'connection_request_accepted' : 'connection_request_rejected',
                'connections',
                userId,
                1
            );

            return data as ConnectionRequest;
        } catch (error) {
            console.error('Error responding to connection request:', error);
            throw error;
        }
    }

    /**
     * Create a connection between two users
     */
    private async createConnection(user1Id: string, user2Id: string): Promise<Connection> {
        try {
            const { data, error } = await supabase
                .from('connections')
                .insert({
                    user1_id: user1Id,
                    user2_id: user2Id,
                    status: 'active'
                })
                .select(`
          *,
          user1:profiles!connections_user1_id_fkey(id, full_name, avatar_url),
          user2:profiles!connections_user2_id_fkey(id, full_name, avatar_url)
        `)
                .single();

            if (error) {
                console.error('Error creating connection:', error);
                throw new Error('Erro ao criar conexão.');
            }

            return data as Connection;
        } catch (error) {
            console.error('Error creating connection:', error);
            throw error;
        }
    }

    /**
     * Get user's connections
     */
    async getUserConnections(userId: string): Promise<Connection[]> {
        try {
            const { data, error } = await supabase
                .from('connections')
                .select(`
          *,
          user1:profiles!connections_user1_id_fkey(id, full_name, avatar_url),
          user2:profiles!connections_user2_id_fkey(id, full_name, avatar_url)
        `)
                .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching user connections:', error);
                throw new Error('Erro ao buscar conexões.');
            }

            return data as Connection[];
        } catch (error) {
            console.error('Error fetching user connections:', error);
            throw error;
        }
    }

    /**
     * Get pending connection requests for a user
     */
    async getPendingRequests(userId: string): Promise<ConnectionRequest[]> {
        try {
            const { data, error } = await supabase
                .from('connection_requests')
                .select(`
          *,
          from_user:profiles!connection_requests_from_user_id_fkey(id, full_name, avatar_url),
          to_user:profiles!connection_requests_to_user_id_fkey(id, full_name, avatar_url)
        `)
                .eq('to_user_id', userId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching pending requests:', error);
                throw new Error('Erro ao buscar solicitações pendentes.');
            }

            return data as ConnectionRequest[];
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            throw error;
        }
    }

    /**
     * Remove a connection
     */
    async removeConnection(connectionId: string, userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('connections')
                .update({ status: 'blocked' })
                .eq('id', connectionId)
                .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

            if (error) {
                console.error('Error removing connection:', error);
                throw new Error('Erro ao remover conexão.');
            }

            // Track engagement
            trackEngagement('connection_removed', 'connections', userId, 1);
        } catch (error) {
            console.error('Error removing connection:', error);
            throw error;
        }
    }

    /**
     * Check if two users are already connected
     */
    async areUsersConnected(user1Id: string, user2Id: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('connections')
                .select('id')
                .or(`user1_id.eq.${user1Id},user2_id.eq.${user1Id}`)
                .or(`user1_id.eq.${user2Id},user2_id.eq.${user2Id}`)
                .eq('status', 'active')
                .limit(1);

            if (error) {
                console.error('Error checking connection:', error);
                return false;
            }

            return data && data.length > 0;
        } catch (error) {
            console.error('Error checking connection:', error);
            return false;
        }
    }

    /**
     * Format baby age for display
     */
    private formatBabyAge(ages?: string[]): string {
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
    }
}

export const connectionsService = new ConnectionsService();
