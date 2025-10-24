import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface AdvancedUserProfile {
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
    lifestyle: {
        sleep_schedule: 'early_bird' | 'night_owl' | 'flexible';
        activity_level: 'low' | 'moderate' | 'high';
        social_preference: 'introvert' | 'extrovert' | 'ambivert';
        parenting_style: 'authoritative' | 'permissive' | 'authoritarian' | 'uninvolved';
    };
    preferences: {
        communication_style: 'direct' | 'diplomatic' | 'supportive';
        meeting_preference: 'online' | 'in_person' | 'both';
        group_size: 'small' | 'large' | 'any';
        activity_types: string[];
    };
    safety_concerns: string[];
    created_at: string;
}

export interface AdvancedMatchScore {
    user: AdvancedUserProfile;
    score: number;
    compatibility_reasons: string[];
    safety_score: number;
    lifestyle_match: number;
    communication_match: number;
    location_proximity: number;
    shared_interests: string[];
    potential_activities: string[];
    risk_factors: string[];
    compatibility: {
        interests: number;
        motherhood_stage: number;
        faith_level: number;
        personality: number;
        location: number;
        lifestyle: number;
        communication: number;
        safety: number;
    };
}

export interface AdvancedMatchPreferences {
    max_distance?: number;
    min_faith_level?: 'beginner' | 'intermediate' | 'advanced';
    preferred_motherhood_stages?: string[];
    required_interests?: string[];
    lifestyle_preferences?: {
        sleep_schedule?: string[];
        activity_level?: string[];
        social_preference?: string[];
        parenting_style?: string[];
    };
    safety_requirements?: {
        verified_profile?: boolean;
        background_check?: boolean;
        mutual_connections?: boolean;
    };
    communication_preferences?: {
        style?: string[];
        meeting_preference?: string[];
        group_size?: string[];
    };
    age_range?: {
        min: number;
        max: number;
    };
}

class AdvancedMatchingService {
    private readonly COMPATIBILITY_WEIGHTS = {
        interests: 0.2,
        motherhood_stage: 0.15,
        faith_level: 0.1,
        personality: 0.15,
        location: 0.1,
        lifestyle: 0.15,
        communication: 0.1,
        safety: 0.05
    };

    /**
     * Find advanced matches using AI-powered compatibility analysis
     */
    async findAdvancedMatches(
        userId: string,
        preferences: AdvancedMatchPreferences = {},
        limit: number = 20
    ): Promise<AdvancedMatchScore[]> {
        try {
            // Get user profile with advanced data
            const userProfile = await this.getAdvancedUserProfile(userId);
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Get potential matches with advanced filtering
            const potentialMatches = await this.getAdvancedPotentialMatches(userId, preferences);

            // Calculate advanced compatibility scores
            const matchesWithScores = await Promise.all(
                potentialMatches.map(async (match) => {
                    const score = await this.calculateAdvancedCompatibilityScore(userProfile, match, preferences);
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
            trackEngagement('advanced_matches_generated', 'ai_matching', userId, sortedMatches.length);

            return sortedMatches;
        } catch (error) {
            console.error('Error finding advanced matches:', error);
            throw error;
        }
    }

    /**
     * Get advanced user profile with lifestyle and safety data
     */
    private async getAdvancedUserProfile(userId: string): Promise<AdvancedUserProfile | null> {
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
                lifestyle,
                preferences,
                safety_concerns,
                created_at
            `)
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching advanced user profile:', error);

            // Create demo profile with advanced data
            if (error.code === 'PGRST116') {
                return await this.createAdvancedDemoProfile(userId);
            }

            return null;
        }

        return data as AdvancedUserProfile;
    }

    /**
     * Create advanced demo profile
     */
    private async createAdvancedDemoProfile(userId: string): Promise<AdvancedUserProfile | null> {
        try {
            const demoProfile: Partial<AdvancedUserProfile> = {
                id: userId,
                full_name: 'Usuário Demo',
                avatar_url: '/avatars/default-avatar.svg',
                bio: 'Mãe dedicada buscando conexões seguras e apoio na comunidade.',
                interests: ['Yoga', 'Parques', 'Culinária', 'Fé', 'Segurança'],
                location: 'São Paulo, SP',
                children_age: ['6'],
                motherhood_stage: 'new_mom',
                faith_level: 'intermediate',
                personality_traits: ['Carinhosa', 'Determinada', 'Empática', 'Cautelosa'],
                goals: ['Conectar com outras mães', 'Compartilhar experiências', 'Aprender sobre maternidade', 'Sentir-se segura'],
                lifestyle: {
                    sleep_schedule: 'early_bird',
                    activity_level: 'moderate',
                    social_preference: 'ambivert',
                    parenting_style: 'authoritative'
                },
                preferences: {
                    communication_style: 'supportive',
                    meeting_preference: 'both',
                    group_size: 'small',
                    activity_types: ['Parques', 'Cafés', 'Atividades em grupo']
                },
                safety_concerns: ['Encontros noturnos', 'Locais isolados', 'Pessoas não verificadas']
            };

            const { data, error } = await supabase
                .from('profiles')
                .insert(demoProfile)
                .select()
                .single();

            if (error) {
                console.error('Error creating advanced demo profile:', error);
                return null;
            }

            return data as AdvancedUserProfile;
        } catch (error) {
            console.error('Error creating advanced demo profile:', error);
            return null;
        }
    }

    /**
     * Get potential matches with advanced filtering
     */
    private async getAdvancedPotentialMatches(
        userId: string,
        preferences: AdvancedMatchPreferences
    ): Promise<AdvancedUserProfile[]> {
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
                lifestyle,
                preferences,
                safety_concerns,
                created_at
            `)
            .neq('id', userId);

        // Apply advanced filters
        if (preferences.preferred_motherhood_stages?.length) {
            query = query.in('motherhood_stage', preferences.preferred_motherhood_stages);
        }

        if (preferences.min_faith_level) {
            const faithLevels = ['beginner', 'intermediate', 'advanced'];
            const minIndex = faithLevels.indexOf(preferences.min_faith_level);
            query = query.in('faith_level', faithLevels.slice(minIndex));
        }

        const { data, error } = await query.limit(100);

        if (error) {
            console.error('Error fetching potential matches:', error);
            return [];
        }

        return data as AdvancedUserProfile[];
    }

    /**
     * Calculate advanced compatibility score
     */
    private async calculateAdvancedCompatibilityScore(
        userProfile: AdvancedUserProfile,
        matchProfile: AdvancedUserProfile,
        preferences: AdvancedMatchPreferences
    ): Promise<Omit<AdvancedMatchScore, 'user'>> {
        const compatibility = {
            interests: this.calculateInterestsCompatibility(userProfile.interests, matchProfile.interests),
            motherhood_stage: this.calculateMotherhoodStageCompatibility(userProfile.motherhood_stage, matchProfile.motherhood_stage),
            faith_level: this.calculateFaithLevelCompatibility(userProfile.faith_level, matchProfile.faith_level),
            personality: this.calculatePersonalityCompatibility(userProfile.personality_traits, matchProfile.personality_traits),
            location: this.calculateLocationCompatibility(userProfile.location, matchProfile.location, preferences.max_distance),
            lifestyle: this.calculateLifestyleCompatibility(userProfile.lifestyle, matchProfile.lifestyle),
            communication: this.calculateCommunicationCompatibility(userProfile.preferences, matchProfile.preferences),
            safety: this.calculateSafetyCompatibility(userProfile.safety_concerns, matchProfile.safety_concerns)
        };

        // Calculate weighted score
        const score = Object.entries(compatibility).reduce((total, [key, value]) => {
            return total + (value * (this.COMPATIBILITY_WEIGHTS[key as keyof typeof this.COMPATIBILITY_WEIGHTS] || 0));
        }, 0);

        // Generate compatibility reasons
        const compatibility_reasons = this.generateCompatibilityReasons(compatibility, userProfile, matchProfile);

        // Calculate safety score
        const safety_score = this.calculateOverallSafetyScore(userProfile, matchProfile);

        // Find shared interests
        const shared_interests = userProfile.interests.filter(interest =>
            matchProfile.interests.includes(interest)
        );

        // Suggest potential activities
        const potential_activities = this.suggestActivities(userProfile, matchProfile);

        // Identify risk factors
        const risk_factors = this.identifyRiskFactors(userProfile, matchProfile);

        return {
            score: Math.round(score * 100),
            compatibility_reasons,
            safety_score,
            lifestyle_match: compatibility.lifestyle,
            communication_match: compatibility.communication,
            location_proximity: compatibility.location,
            shared_interests,
            potential_activities,
            risk_factors,
            compatibility
        };
    }

    /**
     * Calculate interests compatibility
     */
    private calculateInterestsCompatibility(userInterests: string[], matchInterests: string[]): number {
        const sharedInterests = userInterests.filter(interest => matchInterests.includes(interest));
        return sharedInterests.length / Math.max(userInterests.length, matchInterests.length);
    }

    /**
     * Calculate motherhood stage compatibility
     */
    private calculateMotherhoodStageCompatibility(userStage: string, matchStage: string): number {
        const stageCompatibility = {
            'pregnant': { 'pregnant': 1.0, 'new_mom': 0.8, 'experienced': 0.6, 'grandmother': 0.4 },
            'new_mom': { 'pregnant': 0.8, 'new_mom': 1.0, 'experienced': 0.9, 'grandmother': 0.7 },
            'experienced': { 'pregnant': 0.6, 'new_mom': 0.9, 'experienced': 1.0, 'grandmother': 0.8 },
            'grandmother': { 'pregnant': 0.4, 'new_mom': 0.7, 'experienced': 0.8, 'grandmother': 1.0 }
        };

        return stageCompatibility[userStage as keyof typeof stageCompatibility]?.[matchStage as keyof typeof stageCompatibility[userStage]] || 0.5;
    }

    /**
     * Calculate faith level compatibility
     */
    private calculateFaithLevelCompatibility(userLevel: string, matchLevel: string): number {
        const faithLevels = ['beginner', 'intermediate', 'advanced'];
        const userIndex = faithLevels.indexOf(userLevel);
        const matchIndex = faithLevels.indexOf(matchLevel);
        const difference = Math.abs(userIndex - matchIndex);
        return Math.max(0, 1 - (difference * 0.3));
    }

    /**
     * Calculate personality compatibility
     */
    private calculatePersonalityCompatibility(userTraits: string[], matchTraits: string[]): number {
        const sharedTraits = userTraits.filter(trait => matchTraits.includes(trait));
        const complementaryTraits = this.findComplementaryTraits(userTraits, matchTraits);
        return (sharedTraits.length * 0.7 + complementaryTraits.length * 0.3) / Math.max(userTraits.length, matchTraits.length);
    }

    /**
     * Calculate location compatibility
     */
    private calculateLocationCompatibility(userLocation?: string, matchLocation?: string, maxDistance?: number): number {
        if (!userLocation || !matchLocation) return 0.5;

        // Simple location matching (in real app, would use geolocation API)
        const userCity = userLocation.split(',')[0].trim();
        const matchCity = matchLocation.split(',')[0].trim();

        if (userCity === matchCity) return 1.0;
        if (userCity.includes(matchCity) || matchCity.includes(userCity)) return 0.8;
        return 0.3;
    }

    /**
     * Calculate lifestyle compatibility
     */
    private calculateLifestyleCompatibility(userLifestyle: any, matchLifestyle: any): number {
        let score = 0;
        const factors = ['sleep_schedule', 'activity_level', 'social_preference', 'parenting_style'];

        factors.forEach(factor => {
            if (userLifestyle[factor] === matchLifestyle[factor]) {
                score += 1;
            } else if (this.areCompatibleLifestyleFactors(factor, userLifestyle[factor], matchLifestyle[factor])) {
                score += 0.5;
            }
        });

        return score / factors.length;
    }

    /**
     * Calculate communication compatibility
     */
    private calculateCommunicationCompatibility(userPrefs: any, matchPrefs: any): number {
        let score = 0;

        if (userPrefs.communication_style === matchPrefs.communication_style) score += 0.4;
        if (userPrefs.meeting_preference === matchPrefs.meeting_preference) score += 0.3;
        if (userPrefs.group_size === matchPrefs.group_size) score += 0.3;

        return score;
    }

    /**
     * Calculate safety compatibility
     */
    private calculateSafetyCompatibility(userConcerns: string[], matchConcerns: string[]): number {
        const sharedConcerns = userConcerns.filter(concern => matchConcerns.includes(concern));
        return sharedConcerns.length / Math.max(userConcerns.length, matchConcerns.length, 1);
    }

    /**
     * Generate compatibility reasons
     */
    private generateCompatibilityReasons(compatibility: any, userProfile: AdvancedUserProfile, matchProfile: AdvancedUserProfile): string[] {
        const reasons: string[] = [];

        if (compatibility.interests > 0.7) {
            reasons.push('Interesses muito similares');
        }

        if (compatibility.motherhood_stage > 0.8) {
            reasons.push('Mesma fase da maternidade');
        }

        if (compatibility.lifestyle > 0.8) {
            reasons.push('Estilo de vida compatível');
        }

        if (compatibility.communication > 0.7) {
            reasons.push('Estilo de comunicação similar');
        }

        if (compatibility.safety > 0.6) {
            reasons.push('Preocupações de segurança similares');
        }

        if (compatibility.location > 0.8) {
            reasons.push('Mesma região');
        }

        return reasons;
    }

    /**
     * Calculate overall safety score
     */
    private calculateOverallSafetyScore(userProfile: AdvancedUserProfile, matchProfile: AdvancedUserProfile): number {
        let score = 0.5; // Base score

        // Check for safety concerns alignment
        const sharedSafetyConcerns = userProfile.safety_concerns.filter(concern =>
            matchProfile.safety_concerns.includes(concern)
        );

        if (sharedSafetyConcerns.length > 0) {
            score += 0.2;
        }

        // Check for verified profile (would be implemented with real verification)
        // score += matchProfile.verified ? 0.3 : 0;

        return Math.min(1, score);
    }

    /**
     * Suggest activities based on compatibility
     */
    private suggestActivities(userProfile: AdvancedUserProfile, matchProfile: AdvancedUserProfile): string[] {
        const activities: string[] = [];

        // Based on shared interests
        const sharedInterests = userProfile.interests.filter(interest =>
            matchProfile.interests.includes(interest)
        );

        if (sharedInterests.includes('Yoga')) {
            activities.push('Aula de yoga em grupo');
        }

        if (sharedInterests.includes('Parques')) {
            activities.push('Passeio no parque com os bebês');
        }

        if (sharedInterests.includes('Culinária')) {
            activities.push('Workshop de culinária saudável');
        }

        // Based on lifestyle compatibility
        if (userProfile.lifestyle.activity_level === 'moderate' && matchProfile.lifestyle.activity_level === 'moderate') {
            activities.push('Caminhada matinal');
        }

        if (userProfile.preferences.group_size === 'small' && matchProfile.preferences.group_size === 'small') {
            activities.push('Encontro íntimo em café');
        }

        return activities;
    }

    /**
     * Identify potential risk factors
     */
    private identifyRiskFactors(userProfile: AdvancedUserProfile, matchProfile: AdvancedUserProfile): string[] {
        const risks: string[] = [];

        // Check for conflicting safety concerns
        const userConcerns = userProfile.safety_concerns;
        const matchConcerns = matchProfile.safety_concerns;

        if (userConcerns.includes('Encontros noturnos') && !matchConcerns.includes('Encontros noturnos')) {
            risks.push('Diferentes preferências para horários de encontro');
        }

        if (userConcerns.includes('Locais isolados') && !matchConcerns.includes('Locais isolados')) {
            risks.push('Diferentes preferências de localização');
        }

        // Check for lifestyle conflicts
        if (userProfile.lifestyle.sleep_schedule === 'early_bird' && matchProfile.lifestyle.sleep_schedule === 'night_owl') {
            risks.push('Horários de sono muito diferentes');
        }

        return risks;
    }

    /**
     * Find complementary personality traits
     */
    private findComplementaryTraits(userTraits: string[], matchTraits: string[]): string[] {
        const complementaryPairs = {
            'Introvertida': 'Extrovertida',
            'Cautelosa': 'Aventureira',
            'Organizada': 'Flexível',
            'Séria': 'Brilhante'
        };

        const complementary: string[] = [];

        userTraits.forEach(trait => {
            const complement = complementaryPairs[trait as keyof typeof complementaryPairs];
            if (complement && matchTraits.includes(complement)) {
                complementary.push(complement);
            }
        });

        return complementary;
    }

    /**
     * Check if lifestyle factors are compatible
     */
    private areCompatibleLifestyleFactors(factor: string, userValue: string, matchValue: string): boolean {
        const compatiblePairs = {
            'sleep_schedule': {
                'early_bird': ['flexible'],
                'night_owl': ['flexible'],
                'flexible': ['early_bird', 'night_owl']
            },
            'activity_level': {
                'low': ['moderate'],
                'moderate': ['low', 'high'],
                'high': ['moderate']
            },
            'social_preference': {
                'introvert': ['ambivert'],
                'extrovert': ['ambivert'],
                'ambivert': ['introvert', 'extrovert']
            }
        };

        return compatiblePairs[factor as keyof typeof compatiblePairs]?.[userValue as keyof typeof compatiblePairs[factor]]?.includes(matchValue) || false;
    }
}

export const advancedMatchingService = new AdvancedMatchingService();
