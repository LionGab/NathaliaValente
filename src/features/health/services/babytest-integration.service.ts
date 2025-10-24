import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface BabyTestResult {
    id: string;
    user_id: string;
    baby_id: string;
    test_type: 'babytest_plus' | 'babytest_basic' | 'babytest_premium';
    test_date: string;
    results: {
        diseases_detected: string[];
        risk_level: 'low' | 'medium' | 'high' | 'critical';
        recommendations: string[];
        follow_up_required: boolean;
        specialist_referral?: string[];
    };
    raw_data: any;
    status: 'pending' | 'completed' | 'requires_attention';
    created_at: string;
    updated_at: string;
}

export interface BabyProfile {
    id: string;
    user_id: string;
    name: string;
    birth_date: string;
    gender: 'male' | 'female';
    weight_at_birth: number; // kg
    height_at_birth: number; // cm
    gestational_age: number; // weeks
    birth_conditions: string[];
    family_history: {
        genetic_diseases: string[];
        metabolic_disorders: string[];
        other_conditions: string[];
    };
    test_history: BabyTestResult[];
    health_tracking: {
        vaccinations: any[];
        growth_milestones: any[];
        developmental_concerns: string[];
    };
    created_at: string;
}

export interface HealthRecommendation {
    id: string;
    baby_id: string;
    type: 'nutrition' | 'development' | 'safety' | 'medical' | 'preventive';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    title: string;
    description: string;
    action_items: string[];
    resources: {
        articles: string[];
        videos: string[];
        specialists: string[];
        products: string[];
    };
    due_date?: string;
    completed: boolean;
    created_at: string;
}

export interface HealthInsight {
    category: 'growth' | 'development' | 'nutrition' | 'safety' | 'genetic';
    insight: string;
    confidence: number; // 0-100
    supporting_data: any;
    recommendations: string[];
    related_tests?: string[];
}

class BabyTestIntegrationService {
    private readonly OLLIN_API_BASE = 'https://api.babytest.com.br'; // Mock URL
    private readonly API_KEY = process.env.VITE_OLLIN_API_KEY;

    /**
     * Schedule BabyTest for a baby
     */
    async scheduleBabyTest(
        userId: string,
        babyId: string,
        testType: 'babytest_plus' | 'babytest_basic' | 'babytest_premium',
        preferredDate?: string
    ): Promise<{ success: boolean; appointmentId?: string; message: string }> {
        try {
            // Get baby profile
            const babyProfile = await this.getBabyProfile(babyId);
            if (!babyProfile) {
                return { success: false, message: 'Perfil do bebê não encontrado' };
            }

            // Check if baby is within recommended age range
            const ageInDays = this.calculateBabyAge(babyProfile.birth_date);
            const isOptimalAge = this.isOptimalTestAge(ageInDays, testType);

            if (!isOptimalAge) {
                return {
                    success: false,
                    message: 'Bebê fora da faixa etária recomendada para este teste'
                };
            }

            // Create appointment with OLLIN
            const appointmentData = {
                baby_profile: {
                    name: babyProfile.name,
                    birth_date: babyProfile.birth_date,
                    gender: babyProfile.gender,
                    weight: babyProfile.weight_at_birth,
                    height: babyProfile.height_at_birth
                },
                test_type: testType,
                preferred_date: preferredDate || new Date().toISOString(),
                family_history: babyProfile.family_history,
                user_contact: {
                    user_id: userId,
                    phone: '', // Would be fetched from user profile
                    email: '' // Would be fetched from user profile
                }
            };

            // Mock API call to OLLIN
            const appointmentId = await this.createOLLINAppointment(appointmentData);

            if (!appointmentId) {
                return { success: false, message: 'Erro ao agendar teste com OLLIN' };
            }

            // Save appointment locally
            await this.saveLocalAppointment(userId, babyId, testType, appointmentId);

            // Track engagement
            trackEngagement('babytest_scheduled', 'health', userId, 1);

            return {
                success: true,
                appointmentId,
                message: 'Teste agendado com sucesso!'
            };
        } catch (error) {
            console.error('Error scheduling BabyTest:', error);
            return { success: false, message: 'Erro interno do sistema' };
        }
    }

    /**
     * Process BabyTest results
     */
    async processTestResults(
        appointmentId: string,
        results: any
    ): Promise<BabyTestResult | null> {
        try {
            // Get appointment details
            const appointment = await this.getAppointment(appointmentId);
            if (!appointment) {
                throw new Error('Appointment not found');
            }

            // Analyze results using AI
            const analyzedResults = await this.analyzeTestResults(results, appointment.baby_profile);

            // Create test result record
            const testResult: Omit<BabyTestResult, 'id' | 'created_at' | 'updated_at'> = {
                user_id: appointment.user_id,
                baby_id: appointment.baby_id,
                test_type: appointment.test_type,
                test_date: new Date().toISOString(),
                results: analyzedResults,
                raw_data: results,
                status: analyzedResults.risk_level === 'critical' ? 'requires_attention' : 'completed'
            };

            const { data, error } = await supabase
                .from('baby_test_results')
                .insert({
                    ...testResult,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error saving test results:', error);
                return null;
            }

            // Generate health recommendations
            await this.generateHealthRecommendations(appointment.baby_id, analyzedResults);

            // Notify user about results
            await this.notifyUserAboutResults(appointment.user_id, analyzedResults);

            trackEngagement('babytest_results_processed', 'health', appointment.user_id, 1);

            return data as BabyTestResult;
        } catch (error) {
            console.error('Error processing test results:', error);
            return null;
        }
    }

    /**
     * Get health insights for a baby
     */
    async getHealthInsights(babyId: string): Promise<HealthInsight[]> {
        try {
            const babyProfile = await this.getBabyProfile(babyId);
            if (!babyProfile) {
                return [];
            }

            const insights: HealthInsight[] = [];

            // Analyze test results
            const testResults = babyProfile.test_history;
            if (testResults.length > 0) {
                const latestTest = testResults[testResults.length - 1];

                if (latestTest.results.diseases_detected.length > 0) {
                    insights.push({
                        category: 'genetic',
                        insight: `Detectadas ${latestTest.results.diseases_detected.length} condições genéticas que requerem atenção`,
                        confidence: 95,
                        supporting_data: latestTest.results,
                        recommendations: latestTest.results.recommendations,
                        related_tests: [latestTest.id]
                    });
                }
            }

            // Analyze growth patterns
            const growthInsight = await this.analyzeGrowthPatterns(babyProfile);
            if (growthInsight) {
                insights.push(growthInsight);
            }

            // Analyze development milestones
            const developmentInsight = await this.analyzeDevelopmentMilestones(babyProfile);
            if (developmentInsight) {
                insights.push(developmentInsight);
            }

            // Generate preventive recommendations
            const preventiveInsights = await this.generatePreventiveInsights(babyProfile);
            insights.push(...preventiveInsights);

            return insights;
        } catch (error) {
            console.error('Error getting health insights:', error);
            return [];
        }
    }

    /**
     * Get personalized health recommendations
     */
    async getHealthRecommendations(babyId: string): Promise<HealthRecommendation[]> {
        try {
            const { data, error } = await supabase
                .from('health_recommendations')
                .select('*')
                .eq('baby_id', babyId)
                .eq('completed', false)
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching health recommendations:', error);
                return [];
            }

            return data as HealthRecommendation[];
        } catch (error) {
            console.error('Error fetching health recommendations:', error);
            return [];
        }
    }

    /**
     * Create baby profile
     */
    async createBabyProfile(
        userId: string,
        babyData: Omit<BabyProfile, 'id' | 'user_id' | 'test_history' | 'health_tracking' | 'created_at'>
    ): Promise<BabyProfile | null> {
        try {
            const { data, error } = await supabase
                .from('baby_profiles')
                .insert({
                    user_id: userId,
                    ...babyData,
                    test_history: [],
                    health_tracking: {
                        vaccinations: [],
                        growth_milestones: [],
                        developmental_concerns: []
                    },
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating baby profile:', error);
                return null;
            }

            // Generate initial health recommendations
            await this.generateInitialRecommendations(data.id, babyData);

            trackEngagement('baby_profile_created', 'health', userId, 1);

            return data as BabyProfile;
        } catch (error) {
            console.error('Error creating baby profile:', error);
            return null;
        }
    }

    /**
     * Get baby profile
     */
    private async getBabyProfile(babyId: string): Promise<BabyProfile | null> {
        try {
            const { data, error } = await supabase
                .from('baby_profiles')
                .select(`
                    *,
                    test_history:baby_test_results(*)
                `)
                .eq('id', babyId)
                .single();

            if (error) {
                console.error('Error fetching baby profile:', error);
                return null;
            }

            return data as BabyProfile;
        } catch (error) {
            console.error('Error fetching baby profile:', error);
            return null;
        }
    }

    /**
     * Calculate baby age in days
     */
    private calculateBabyAge(birthDate: string): number {
        const birth = new Date(birthDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - birth.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Check if baby is in optimal age range for test
     */
    private isOptimalTestAge(ageInDays: number, testType: string): boolean {
        const ageRanges = {
            'babytest_plus': { min: 1, max: 20 }, // 1st to 20th day - BEST TIME
            'babytest_basic': { min: 1, max: 365 }, // First year - GOOD
            'babytest_premium': { min: 1, max: 20 } // 1st to 20th day - BEST TIME
        };

        const range = ageRanges[testType as keyof typeof ageRanges];
        return ageInDays >= range.min && ageInDays <= range.max;
    }

    /**
     * Create appointment with OLLIN (mock)
     */
    private async createOLLINAppointment(appointmentData: any): Promise<string | null> {
        try {
            // Mock API call to OLLIN
            // In real implementation, this would make actual API call
            console.log('Creating OLLIN appointment:', appointmentData);

            // Simulate API response
            return crypto.randomUUID();
        } catch (error) {
            console.error('Error creating OLLIN appointment:', error);
            return null;
        }
    }

    /**
     * Save local appointment
     */
    private async saveLocalAppointment(
        userId: string,
        babyId: string,
        testType: string,
        appointmentId: string
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('babytest_appointments')
                .insert({
                    user_id: userId,
                    baby_id: babyId,
                    test_type: testType,
                    ollin_appointment_id: appointmentId,
                    status: 'scheduled',
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error saving local appointment:', error);
            }
        } catch (error) {
            console.error('Error saving local appointment:', error);
        }
    }

    /**
     * Get appointment details
     */
    private async getAppointment(appointmentId: string): Promise<any> {
        try {
            const { data, error } = await supabase
                .from('babytest_appointments')
                .select(`
                    *,
                    baby_profile:baby_profiles(*)
                `)
                .eq('ollin_appointment_id', appointmentId)
                .single();

            if (error) {
                console.error('Error fetching appointment:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            return null;
        }
    }

    /**
     * Analyze test results using AI
     */
    private async analyzeTestResults(results: any, babyProfile: any): Promise<BabyTestResult['results']> {
        // Mock AI analysis - in real implementation, would use actual AI/ML models
        const diseasesDetected = results.diseases_detected || [];
        const riskLevel = diseasesDetected.length > 0 ? 'high' : 'low';

        const recommendations = [];
        if (diseasesDetected.length > 0) {
            recommendations.push('Consulte um especialista em genética');
            recommendations.push('Monitore o desenvolvimento do bebê de perto');
            recommendations.push('Considere testes adicionais se necessário');
        } else {
            recommendations.push('Continue com os cuidados de rotina');
            recommendations.push('Mantenha o acompanhamento pediátrico regular');
        }

        return {
            diseases_detected: diseasesDetected,
            risk_level: riskLevel as any,
            recommendations,
            follow_up_required: diseasesDetected.length > 0,
            specialist_referral: diseasesDetected.length > 0 ? ['Genética', 'Pediatria'] : undefined
        };
    }

    /**
     * Generate health recommendations
     */
    private async generateHealthRecommendations(babyId: string, testResults: any): Promise<void> {
        try {
            const recommendations = [];

            if (testResults.risk_level === 'high' || testResults.risk_level === 'critical') {
                recommendations.push({
                    baby_id: babyId,
                    type: 'medical',
                    priority: 'urgent',
                    title: 'Acompanhamento Especializado Necessário',
                    description: 'Com base nos resultados do teste, é recomendado acompanhamento especializado.',
                    action_items: [
                        'Agende consulta com geneticista',
                        'Monitore sinais de alerta',
                        'Mantenha comunicação com pediatra'
                    ],
                    resources: {
                        articles: ['Guia de Acompanhamento Genético'],
                        videos: ['Entendendo Resultados Genéticos'],
                        specialists: ['Genética', 'Pediatria'],
                        products: []
                    },
                    completed: false,
                    created_at: new Date().toISOString()
                });
            }

            // Save recommendations
            if (recommendations.length > 0) {
                const { error } = await supabase
                    .from('health_recommendations')
                    .insert(recommendations);

                if (error) {
                    console.error('Error saving health recommendations:', error);
                }
            }
        } catch (error) {
            console.error('Error generating health recommendations:', error);
        }
    }

    /**
     * Notify user about results
     */
    private async notifyUserAboutResults(userId: string, results: any): Promise<void> {
        try {
            // In real implementation, would send push notification or email
            console.log(`Notifying user ${userId} about test results:`, results);
        } catch (error) {
            console.error('Error notifying user:', error);
        }
    }

    /**
     * Analyze growth patterns
     */
    private async analyzeGrowthPatterns(babyProfile: BabyProfile): Promise<HealthInsight | null> {
        // Mock growth analysis
        const ageInDays = this.calculateBabyAge(babyProfile.birth_date);

        if (ageInDays > 30) { // Only analyze after first month
            return {
                category: 'growth',
                insight: 'Padrão de crescimento dentro da normalidade',
                confidence: 85,
                supporting_data: { age_days: ageInDays },
                recommendations: [
                    'Continue monitorando peso e altura',
                    'Mantenha alimentação adequada',
                    'Acompanhe marcos de desenvolvimento'
                ]
            };
        }

        return null;
    }

    /**
     * Analyze development milestones
     */
    private async analyzeDevelopmentMilestones(babyProfile: BabyProfile): Promise<HealthInsight | null> {
        // Mock development analysis
        return {
            category: 'development',
            insight: 'Desenvolvimento motor e cognitivo adequado para a idade',
            confidence: 80,
            supporting_data: { milestones_met: 5, total_milestones: 6 },
            recommendations: [
                'Continue estimulando com brincadeiras adequadas',
                'Monitore marcos de linguagem',
                'Mantenha ambiente seguro para exploração'
            ]
        };
    }

    /**
     * Generate preventive insights
     */
    private async generatePreventiveInsights(babyProfile: BabyProfile): Promise<HealthInsight[]> {
        const insights: HealthInsight[] = [];

        // Nutrition insight
        insights.push({
            category: 'nutrition',
            insight: 'Alimentação adequada para o desenvolvimento saudável',
            confidence: 90,
            supporting_data: { age_months: Math.floor(this.calculateBabyAge(babyProfile.birth_date) / 30) },
            recommendations: [
                'Mantenha amamentação exclusiva até 6 meses',
                'Introduza alimentos sólidos gradualmente',
                'Ofereça variedade de nutrientes'
            ]
        });

        // Safety insight
        insights.push({
            category: 'safety',
            insight: 'Ambiente seguro para exploração e desenvolvimento',
            confidence: 85,
            supporting_data: { safety_checks: ['casa', 'brinquedos', 'alimentação'] },
            recommendations: [
                'Mantenha objetos pequenos fora do alcance',
                'Use protetores de tomada',
                'Supervisione durante brincadeiras'
            ]
        });

        return insights;
    }

    /**
     * Generate initial recommendations for new baby
     */
    private async generateInitialRecommendations(babyId: string, babyData: any): Promise<void> {
        try {
            const recommendations = [
                {
                    baby_id: babyId,
                    type: 'preventive',
                    priority: 'high',
                    title: 'Primeiros Cuidados',
                    description: 'Recomendações essenciais para os primeiros dias de vida.',
                    action_items: [
                        'Agende primeira consulta pediátrica',
                        'Mantenha ambiente calmo e seguro',
                        'Estabeleça rotina de sono'
                    ],
                    resources: {
                        articles: ['Guia do Recém-nascido'],
                        videos: ['Cuidados Básicos'],
                        specialists: ['Pediatria'],
                        products: ['Produtos Essenciais']
                    },
                    completed: false,
                    created_at: new Date().toISOString()
                }
            ];

            const { error } = await supabase
                .from('health_recommendations')
                .insert(recommendations);

            if (error) {
                console.error('Error saving initial recommendations:', error);
            }
        } catch (error) {
            console.error('Error generating initial recommendations:', error);
        }
    }
}

export const babyTestIntegrationService = new BabyTestIntegrationService();
