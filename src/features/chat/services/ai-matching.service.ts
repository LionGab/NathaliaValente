import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url: string;
    bio?: string;
    interests: string[];
    location?: string;
    children_age?: string[];
    motherhood_stage: 'pregnant' | 'new_mom' | 'experienced' | 'grandmother';
    faith_level: 'beginner' | 'intermediate' | 'advanced';
    personality_traits: string[];
    goals: string[];
    created_at: string;
}

export interface MatchScore {
    user: UserProfile;
    score: number;
    reasons: string[];
    compatibility: {
        interests: number;
        motherhood_stage: number;
        faith_level: number;
        personality: number;
        location: number;
    };
}

export interface MatchPreferences {
    max_distance?: number; // km
    min_faith_level?: 'beginner' | 'intermediate' | 'advanced';
    preferred_motherhood_stages?: string[];
    required_interests?: string[];
    age_range?: {
        min: number;
        max: number;
    };
}

class AIMatchingService {
    private readonly COMPATIBILITY_WEIGHTS = {
        interests: 0.3,
        motherhood_stage: 0.25,
        faith_level: 0.2,
        personality: 0.15,
        location: 0.1
    };

    /**
     * Find potential matches for a user using AI-powered compatibility analysis
     */
    async findMatches(
        userId: string,
        preferences: MatchPreferences = {},
        limit: number = 10
    ): Promise<MatchScore[]> {
        try {
            // Get user profile
            const userProfile = await this.getUserProfile(userId);
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Get potential matches (exclude current user and existing matches)
            const potentialMatches = await this.getPotentialMatches(userId, preferences);

            // Calculate compatibility scores using AI
            const matchesWithScores = await Promise.all(
                potentialMatches.map(async (match) => {
                    const score = await this.calculateCompatibilityScore(userProfile, match);
                    return {
                        user: match,
                        ...score
                    };
                })
            );

            // Sort by score and return top matches
            const sortedMatches = matchesWithScores
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            // Track engagement
            trackEngagement('matches_generated', 'ai_matching', userId, sortedMatches.length);

            return sortedMatches;
        } catch (error) {
            console.error('Error finding matches:', error);
            throw error;
        }
    }

    /**
     * Get user profile with all necessary data for matching
     */
    private async getUserProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
        id,
        full_name,
        avatar_url,
        bio,
        interests,
        location,
        children_age,
        motherhood_stage,
        faith_level,
        personality_traits,
        goals,
        created_at
      `)
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            
            // If profile doesn't exist, create a demo profile
            if (error.code === 'PGRST116') {
                console.log('Creating demo profile for user:', userId);
                return await this.createDemoProfile(userId);
            }
            
            return null;
        }

        return data as UserProfile;
    }

    /**
     * Create a demo profile for users without profiles
     */
    private async createDemoProfile(userId: string): Promise<UserProfile | null> {
        try {
            const demoProfile: Partial<UserProfile> = {
                id: userId,
                full_name: 'Usuário Demo',
                avatar_url: '/avatars/default-avatar.svg',
                bio: 'Mãe dedicada buscando conexões e apoio na comunidade.',
                interests: ['Yoga', 'Parques', 'Culinária', 'Fé'],
                location: 'São Paulo, SP',
                children_age: ['6'],
                motherhood_stage: 'new_mom',
                faith_level: 'intermediate',
                personality_traits: ['Carinhosa', 'Determinada', 'Empática'],
                goals: ['Conectar com outras mães', 'Compartilhar experiências', 'Aprender sobre maternidade']
            };

            const { data, error } = await supabase
                .from('profiles')
                .insert(demoProfile)
                .select()
                .single();

            if (error) {
                console.error('Error creating demo profile:', error);
                return null;
            }

            console.log('Demo profile created successfully:', data);
            return data as UserProfile;
        } catch (error) {
            console.error('Error creating demo profile:', error);
            return null;
        }
    }

    /**
     * Get potential matches based on preferences
     */
    private async getPotentialMatches(
        userId: string,
        preferences: MatchPreferences
    ): Promise<UserProfile[]> {
        let query = supabase
            .from('profiles')
            .select(`
        id,
        full_name,
        avatar_url,
        bio,
        interests,
        location,
        children_age,
        motherhood_stage,
        faith_level,
        personality_traits,
        goals,
        created_at
      `)
            .neq('id', userId);

        // Apply faith level filter
        if (preferences.min_faith_level) {
            const faithLevels = ['beginner', 'intermediate', 'advanced'];
            const minIndex = faithLevels.indexOf(preferences.min_faith_level);
            const allowedLevels = faithLevels.slice(minIndex);
            query = query.in('faith_level', allowedLevels);
        }

        // Apply motherhood stage filter
        if (preferences.preferred_motherhood_stages?.length) {
            query = query.in('motherhood_stage', preferences.preferred_motherhood_stages);
        }

        // Apply interest filter
        if (preferences.required_interests?.length) {
            query = query.overlaps('interests', preferences.required_interests);
        }

        const { data, error } = await query.limit(50);

        if (error) {
            console.error('Error fetching potential matches:', error);
            return [];
        }

        return data as UserProfile[];
    }

    /**
     * Calculate compatibility score between two users using AI analysis
     */
    private async calculateCompatibilityScore(
        user: UserProfile,
        match: UserProfile
    ): Promise<{ score: number; reasons: string[]; compatibility: any }> {
        const compatibility = {
            interests: this.calculateInterestsCompatibility(user.interests, match.interests),
            motherhood_stage: this.calculateMotherhoodStageCompatibility(user.motherhood_stage, match.motherhood_stage),
            faith_level: this.calculateFaithLevelCompatibility(user.faith_level, match.faith_level),
            personality: this.calculatePersonalityCompatibility(user.personality_traits, match.personality_traits),
            location: this.calculateLocationCompatibility(user.location, match.location)
        };

        // Calculate weighted score
        const score = Object.entries(compatibility).reduce((total, [key, value]) => {
            return total + (value * this.COMPATIBILITY_WEIGHTS[key as keyof typeof this.COMPATIBILITY_WEIGHTS]);
        }, 0);

        // Generate reasons for compatibility
        const reasons = this.generateCompatibilityReasons(compatibility, user, match);

        return { score, reasons, compatibility };
    }

    /**
     * Calculate interests compatibility (0-1)
     */
    private calculateInterestsCompatibility(userInterests: string[], matchInterests: string[]): number {
        if (!userInterests.length || !matchInterests.length) return 0;

        const commonInterests = userInterests.filter(interest =>
            matchInterests.includes(interest)
        ).length;

        const totalInterests = new Set([...userInterests, ...matchInterests]).size;
        return commonInterests / totalInterests;
    }

    /**
     * Calculate motherhood stage compatibility (0-1)
     */
    private calculateMotherhoodStageCompatibility(userStage: string, matchStage: string): number {
        const stageCompatibility = {
            'pregnant': { 'pregnant': 1, 'new_mom': 0.8, 'experienced': 0.6, 'grandmother': 0.4 },
            'new_mom': { 'pregnant': 0.8, 'new_mom': 1, 'experienced': 0.9, 'grandmother': 0.7 },
            'experienced': { 'pregnant': 0.6, 'new_mom': 0.9, 'experienced': 1, 'grandmother': 0.8 },
            'grandmother': { 'pregnant': 0.4, 'new_mom': 0.7, 'experienced': 0.8, 'grandmother': 1 }
        };

        return stageCompatibility[userStage as keyof typeof stageCompatibility]?.[matchStage as keyof typeof stageCompatibility[typeof userStage]] || 0;
    }

    /**
     * Calculate faith level compatibility (0-1)
     */
    private calculateFaithLevelCompatibility(userLevel: string, matchLevel: string): number {
        const faithLevels = ['beginner', 'intermediate', 'advanced'];
        const userIndex = faithLevels.indexOf(userLevel);
        const matchIndex = faithLevels.indexOf(matchLevel);

        if (userIndex === -1 || matchIndex === -1) return 0;

        const difference = Math.abs(userIndex - matchIndex);
        return Math.max(0, 1 - (difference * 0.3));
    }

    /**
     * Calculate personality compatibility (0-1)
     */
    private calculatePersonalityCompatibility(userTraits: string[], matchTraits: string[]): number {
        if (!userTraits.length || !matchTraits.length) return 0;

        const commonTraits = userTraits.filter(trait => matchTraits.includes(trait)).length;
        const totalTraits = new Set([...userTraits, ...matchTraits]).size;

        return commonTraits / totalTraits;
    }

    /**
     * Calculate location compatibility (0-1)
     */
    private calculateLocationCompatibility(userLocation?: string, matchLocation?: string): number {
        if (!userLocation || !matchLocation) return 0.5; // Neutral if no location data

        // Simple string matching - in real app, use geolocation API
        if (userLocation.toLowerCase() === matchLocation.toLowerCase()) return 1;

        // Check if same city/region
        const userCity = userLocation.split(',')[0].toLowerCase();
        const matchCity = matchLocation.split(',')[0].toLowerCase();

        if (userCity === matchCity) return 0.8;

        return 0.3; // Different locations
    }

    /**
     * Generate human-readable compatibility reasons
     */
    private generateCompatibilityReasons(
        compatibility: any,
        user: UserProfile,
        match: UserProfile
    ): string[] {
        const reasons: string[] = [];

        if (compatibility.interests > 0.5) {
            const commonInterests = user.interests.filter(interest =>
                match.interests.includes(interest)
            );
            reasons.push(`Vocês compartilham interesses em: ${commonInterests.slice(0, 3).join(', ')}`);
        }

        if (compatibility.motherhood_stage > 0.7) {
            reasons.push(`Ambas estão na mesma fase da maternidade`);
        }

        if (compatibility.faith_level > 0.8) {
            reasons.push(`Níveis de fé similares`);
        }

        if (compatibility.personality > 0.6) {
            const commonTraits = user.personality_traits.filter(trait =>
                match.personality_traits.includes(trait)
            );
            reasons.push(`Personalidades compatíveis: ${commonTraits.slice(0, 2).join(', ')}`);
        }

        if (compatibility.location > 0.7) {
            reasons.push(`Moram na mesma região`);
        }

        return reasons;
    }

    /**
     * Create a match between two users
     */
    async createMatch(userId: string, matchUserId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('matches')
                .insert([
                    { user_id: userId, matched_user_id: matchUserId, status: 'pending' },
                    { user_id: matchUserId, matched_user_id: userId, status: 'pending' }
                ]);

            if (error) {
                console.error('Error creating match:', error);
                return false;
            }

            trackEngagement('match_created', 'ai_matching', userId, 1);
            return true;
        } catch (error) {
            console.error('Error creating match:', error);
            return false;
        }
    }

    /**
     * Accept or reject a match
     */
    async respondToMatch(userId: string, matchUserId: string, accepted: boolean): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('matches')
                .update({ status: accepted ? 'accepted' : 'rejected' })
                .eq('user_id', userId)
                .eq('matched_user_id', matchUserId);

            if (error) {
                console.error('Error responding to match:', error);
                return false;
            }

            trackEngagement(accepted ? 'match_accepted' : 'match_rejected', 'ai_matching', userId, 1);
            return true;
        } catch (error) {
            console.error('Error responding to match:', error);
            return false;
        }
    }
}

export const aiMatchingService = new AIMatchingService();
