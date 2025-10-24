import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface SafetyAlert {
    id: string;
    user_id: string;
    type: 'emergency' | 'suspicious' | 'unsafe_area' | 'travel' | 'meeting';
    location: {
        latitude: number;
        longitude: number;
        address: string;
        city: string;
    };
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved' | 'false_alarm';
    created_at: string;
    expires_at?: string;
    verified_by?: string[];
    community_response?: {
        users_responding: number;
        estimated_arrival: number; // minutes
        safety_tips: string[];
    };
}

export interface SafetyBuddy {
    id: string;
    user_id: string;
    buddy_id: string;
    relationship: 'friend' | 'family' | 'neighbor' | 'community';
    contact_info: {
        phone?: string;
        emergency_contact: boolean;
        can_track_location: boolean;
    };
    status: 'active' | 'inactive' | 'blocked';
    created_at: string;
    last_check_in?: string;
}

export interface SafetyRoute {
    id: string;
    user_id: string;
    name: string;
    start_location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    end_location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    waypoints: Array<{
        latitude: number;
        longitude: number;
        address: string;
        safety_rating: number;
        notes?: string;
    }>;
    safety_score: number;
    estimated_duration: number; // minutes
    is_safe: boolean;
    created_at: string;
}

export interface CommunitySafetyData {
    area_safety_rating: number;
    recent_alerts: SafetyAlert[];
    safe_routes: SafetyRoute[];
    community_buddies: SafetyBuddy[];
    safety_tips: string[];
    emergency_contacts: string[];
}

class SafetyCommunityService {
    /**
     * Create a safety alert
     */
    async createSafetyAlert(alert: Omit<SafetyAlert, 'id' | 'created_at'>): Promise<SafetyAlert | null> {
        try {
            const { data, error } = await supabase
                .from('safety_alerts')
                .insert({
                    ...alert,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating safety alert:', error);
                return null;
            }

            // Notify nearby community members
            await this.notifyNearbyUsers(alert.location, alert.type, alert.severity);

            // Track engagement
            trackEngagement('safety_alert_created', 'safety', alert.user_id, 1);

            return data as SafetyAlert;
        } catch (error) {
            console.error('Error creating safety alert:', error);
            return null;
        }
    }

    /**
     * Get community safety data for an area
     */
    async getCommunitySafetyData(
        latitude: number,
        longitude: number,
        radius: number = 5 // km
    ): Promise<CommunitySafetyData> {
        try {
            // Get recent alerts in the area
            const { data: alerts, error: alertsError } = await supabase
                .from('safety_alerts')
                .select('*')
                .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
                .eq('status', 'active');

            if (alertsError) {
                console.error('Error fetching safety alerts:', alertsError);
            }

            // Get safe routes in the area
            const { data: routes, error: routesError } = await supabase
                .from('safety_routes')
                .select('*')
                .eq('is_safe', true)
                .order('safety_score', { ascending: false })
                .limit(10);

            if (routesError) {
                console.error('Error fetching safety routes:', routesError);
            }

            // Calculate area safety rating
            const areaSafetyRating = this.calculateAreaSafetyRating(alerts || []);

            // Get safety tips based on area and time
            const safetyTips = this.generateSafetyTips(latitude, longitude, new Date());

            return {
                area_safety_rating: areaSafetyRating,
                recent_alerts: alerts || [],
                safe_routes: routes || [],
                community_buddies: [], // Would be populated with user's safety buddies
                safety_tips: safetyTips,
                emergency_contacts: this.getEmergencyContacts(latitude, longitude)
            };
        } catch (error) {
            console.error('Error getting community safety data:', error);
            return {
                area_safety_rating: 0.5,
                recent_alerts: [],
                safe_routes: [],
                community_buddies: [],
                safety_tips: ['Mantenha-se alerta', 'Compartilhe sua localização'],
                emergency_contacts: ['190', '192', '193']
            };
        }
    }

    /**
     * Add a safety buddy
     */
    async addSafetyBuddy(
        userId: string,
        buddyId: string,
        relationship: string,
        contactInfo: any
    ): Promise<SafetyBuddy | null> {
        try {
            const { data, error } = await supabase
                .from('safety_buddies')
                .insert({
                    user_id: userId,
                    buddy_id: buddyId,
                    relationship,
                    contact_info: contactInfo,
                    status: 'active',
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error adding safety buddy:', error);
                return null;
            }

            trackEngagement('safety_buddy_added', 'safety', userId, 1);

            return data as SafetyBuddy;
        } catch (error) {
            console.error('Error adding safety buddy:', error);
            return null;
        }
    }

    /**
     * Create a safe route
     */
    async createSafeRoute(route: Omit<SafetyRoute, 'id' | 'created_at' | 'safety_score' | 'is_safe'>): Promise<SafetyRoute | null> {
        try {
            // Calculate safety score
            const safetyScore = await this.calculateRouteSafetyScore(route.waypoints);
            const isSafe = safetyScore > 0.7;

            const { data, error } = await supabase
                .from('safety_routes')
                .insert({
                    ...route,
                    safety_score: safetyScore,
                    is_safe: isSafe,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating safe route:', error);
                return null;
            }

            trackEngagement('safe_route_created', 'safety', route.user_id, 1);

            return data as SafetyRoute;
        } catch (error) {
            console.error('Error creating safe route:', error);
            return null;
        }
    }

    /**
     * Start safety tracking for a journey
     */
    async startSafetyTracking(
        userId: string,
        startLocation: any,
        endLocation: any,
        estimatedDuration: number
    ): Promise<string | null> {
        try {
            const trackingId = crypto.randomUUID();
            
            // Create tracking session
            const { error } = await supabase
                .from('safety_tracking')
                .insert({
                    id: trackingId,
                    user_id: userId,
                    start_location: startLocation,
                    end_location: endLocation,
                    estimated_duration: estimatedDuration,
                    status: 'active',
                    started_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error starting safety tracking:', error);
                return null;
            }

            // Notify safety buddies
            await this.notifySafetyBuddies(userId, 'journey_started', {
                startLocation,
                endLocation,
                estimatedDuration
            });

            trackEngagement('safety_tracking_started', 'safety', userId, 1);

            return trackingId;
        } catch (error) {
            console.error('Error starting safety tracking:', error);
            return null;
        }
    }

    /**
     * End safety tracking
     */
    async endSafetyTracking(trackingId: string, actualDuration: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('safety_tracking')
                .update({
                    status: 'completed',
                    actual_duration: actualDuration,
                    ended_at: new Date().toISOString()
                })
                .eq('id', trackingId);

            if (error) {
                console.error('Error ending safety tracking:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error ending safety tracking:', error);
            return false;
        }
    }

    /**
     * Send emergency alert
     */
    async sendEmergencyAlert(
        userId: string,
        location: any,
        emergencyType: string,
        message?: string
    ): Promise<boolean> {
        try {
            // Create emergency alert
            const alert = await this.createSafetyAlert({
                user_id: userId,
                type: 'emergency',
                location,
                description: message || 'Emergência - preciso de ajuda!',
                severity: 'critical',
                status: 'active'
            });

            if (!alert) {
                return false;
            }

            // Notify all safety buddies immediately
            await this.notifySafetyBuddies(userId, 'emergency', {
                location,
                emergencyType,
                message,
                alertId: alert.id
            });

            // Notify nearby community members
            await this.notifyNearbyUsers(location, 'emergency', 'critical');

            // Call emergency services if critical
            if (emergencyType === 'medical' || emergencyType === 'danger') {
                await this.callEmergencyServices(location, emergencyType);
            }

            trackEngagement('emergency_alert_sent', 'safety', userId, 1);

            return true;
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            return false;
        }
    }

    /**
     * Notify nearby users about safety alerts
     */
    private async notifyNearbyUsers(location: any, alertType: string, severity: string): Promise<void> {
        try {
            // In a real implementation, this would use geolocation queries
            // to find users within a certain radius and send push notifications
            
            console.log(`Notifying nearby users about ${alertType} alert with ${severity} severity at ${location.address}`);
            
            // This would integrate with push notification service
            // await pushNotificationService.sendToNearbyUsers(location, {
            //     title: 'Alerta de Segurança',
            //     body: `Nova atividade ${alertType} na sua área`,
            //     data: { type: alertType, severity, location }
            // });
        } catch (error) {
            console.error('Error notifying nearby users:', error);
        }
    }

    /**
     * Notify safety buddies
     */
    private async notifySafetyBuddies(userId: string, eventType: string, data: any): Promise<void> {
        try {
            const { data: buddies, error } = await supabase
                .from('safety_buddies')
                .select('buddy_id, contact_info')
                .eq('user_id', userId)
                .eq('status', 'active');

            if (error) {
                console.error('Error fetching safety buddies:', error);
                return;
            }

            // Send notifications to all safety buddies
            for (const buddy of buddies) {
                // This would integrate with push notification service
                console.log(`Notifying safety buddy ${buddy.buddy_id} about ${eventType}`);
            }
        } catch (error) {
            console.error('Error notifying safety buddies:', error);
        }
    }

    /**
     * Calculate area safety rating
     */
    private calculateAreaSafetyRating(alerts: SafetyAlert[]): number {
        if (alerts.length === 0) return 0.8; // Default safe rating

        const severityWeights = {
            'low': 0.1,
            'medium': 0.3,
            'high': 0.6,
            'critical': 1.0
        };

        const totalWeight = alerts.reduce((sum, alert) => {
            return sum + (severityWeights[alert.severity] || 0);
        }, 0);

        // Convert to safety rating (higher is safer)
        return Math.max(0, 1 - (totalWeight / alerts.length));
    }

    /**
     * Calculate route safety score
     */
    private async calculateRouteSafetyScore(waypoints: any[]): Promise<number> {
        // In a real implementation, this would analyze:
        // - Crime statistics for each area
        // - Lighting conditions
        // - Population density
        // - Historical safety data
        
        let totalScore = 0;
        for (const waypoint of waypoints) {
            // Mock safety rating based on waypoint data
            totalScore += waypoint.safety_rating || 0.7;
        }
        
        return totalScore / waypoints.length;
    }

    /**
     * Generate safety tips based on location and time
     */
    private generateSafetyTips(latitude: number, longitude: number, time: Date): string[] {
        const tips: string[] = [];
        const hour = time.getHours();

        // Time-based tips
        if (hour < 6 || hour > 22) {
            tips.push('Evite caminhar sozinha à noite');
            tips.push('Use roupas claras e reflexivas');
            tips.push('Mantenha o telefone carregado');
        }

        // Location-based tips (mock)
        tips.push('Compartilhe sua localização com amigos');
        tips.push('Mantenha-se em áreas bem iluminadas');
        tips.push('Confie na sua intuição');

        return tips;
    }

    /**
     * Get emergency contacts for location
     */
    private getEmergencyContacts(latitude: number, longitude: number): string[] {
        // In a real implementation, this would return location-specific emergency numbers
        return ['190', '192', '193', '180']; // Police, Medical, Fire, Women's helpline
    }

    /**
     * Call emergency services
     */
    private async callEmergencyServices(location: any, emergencyType: string): Promise<void> {
        try {
            // In a real implementation, this would integrate with emergency services API
            console.log(`Calling emergency services for ${emergencyType} at ${location.address}`);
            
            // This could trigger:
            // - Automatic 911/190 calls
            // - SMS to emergency contacts
            // - Location sharing with authorities
        } catch (error) {
            console.error('Error calling emergency services:', error);
        }
    }
}

export const safetyCommunityService = new SafetyCommunityService();
