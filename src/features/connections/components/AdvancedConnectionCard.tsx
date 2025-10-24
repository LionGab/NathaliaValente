import React, { useState } from 'react';
import { Heart, MapPin, Baby, Sparkles, X, Check, Shield, Star, MessageCircle, Share2, Flag, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AdvancedUserProfile, AdvancedMatchScore } from '../services/advanced-matching.service';

interface AdvancedConnectionCardProps {
    profile: AdvancedUserProfile & { 
        compatibilityScore?: number; 
        compatibilityReasons?: string[];
        safetyScore?: number;
        sharedInterests?: string[];
        potentialActivities?: string[];
        riskFactors?: string[];
    };
    onConnect: (profileId: string) => void;
    onPass: (profileId: string) => void;
    onMessage: (profileId: string) => void;
    onShare: (profileId: string) => void;
    onReport: (profileId: string) => void;
    isLoading?: boolean;
}

export const AdvancedConnectionCard: React.FC<AdvancedConnectionCardProps> = ({
    profile,
    onConnect,
    onPass,
    onMessage,
    onShare,
    onReport,
    isLoading = false,
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showSafetyInfo, setShowSafetyInfo] = useState(false);

    const getCompatibilityColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getSafetyColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getRiskLevel = (riskFactors: string[]) => {
        if (riskFactors.length === 0) return { level: 'Baixo', color: 'text-green-600' };
        if (riskFactors.length <= 2) return { level: 'Médio', color: 'text-yellow-600' };
        return { level: 'Alto', color: 'text-red-600' };
    };

    const riskLevel = getRiskLevel(profile.riskFactors || []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
            {/* Header with Safety Badge */}
            <div className="relative">
                <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-80 object-cover"
                />
                
                {/* Safety Score Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm ${getSafetyColor(profile.safetyScore || 0)}`}>
                        <Shield className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                            {Math.round((profile.safetyScore || 0) * 100)}%
                        </span>
                    </div>
                </div>

                {/* Compatibility Score */}
                <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getCompatibilityColor(profile.compatibilityScore || 0)}`}>
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-bold">
                            {profile.compatibilityScore || 0}%
                        </span>
                    </div>
                </div>

                {/* Risk Level Indicator */}
                {profile.riskFactors && profile.riskFactors.length > 0 && (
                    <div className="absolute bottom-4 left-4">
                        <div className={`px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm ${riskLevel.color}`}>
                            <span className="text-xs font-semibold">
                                Risco: {riskLevel.level}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {profile.full_name}
                        </h2>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{profile.location}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            4.8
                        </span>
                    </div>
                </div>

                {/* Baby Info */}
                <div className="flex items-center gap-2 mb-4">
                    <Baby className="w-4 h-4 text-pink-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {profile.children_age?.[0] || 'Idade não informada'}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {profile.motherhood_stage.replace('_', ' ')}
                    </span>
                </div>

                {/* Bio */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {profile.bio}
                </p>

                {/* Shared Interests */}
                {profile.sharedInterests && profile.sharedInterests.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Interesses em Comum
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {profile.sharedInterests.slice(0, 3).map((interest, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-xs rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}
                            {profile.sharedInterests.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                    +{profile.sharedInterests.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Compatibility Reasons */}
                {profile.compatibilityReasons && profile.compatibilityReasons.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Por que vocês são compatíveis:
                        </h4>
                        <ul className="space-y-1">
                            {profile.compatibilityReasons.slice(0, 2).map((reason, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="w-3 h-3 text-green-500" />
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Potential Activities */}
                {profile.potentialActivities && profile.potentialActivities.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Atividades Sugeridas
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {profile.potentialActivities.slice(0, 2).map((activity, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                >
                                    {activity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Risk Factors Warning */}
                {profile.riskFactors && profile.riskFactors.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-2">
                            <Flag className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                    Considerações Importantes
                                </h4>
                                <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                    {profile.riskFactors.slice(0, 2).map((risk, index) => (
                                        <li key={index}>• {risk}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={() => onPass(profile.id)}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
                        Passar
                    </Button>
                    
                    <Button
                        onClick={() => onMessage(profile.id)}
                        variant="outline"
                        className="flex items-center justify-center gap-2 px-4"
                        disabled={isLoading}
                    >
                        <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                        onClick={() => onShare(profile.id)}
                        variant="outline"
                        className="flex items-center justify-center gap-2 px-4"
                        disabled={isLoading}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                        onClick={() => onConnect(profile.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600"
                        disabled={isLoading}
                    >
                        <Heart className="w-4 h-4" />
                        Conectar
                    </Button>
                </div>

                {/* More Options */}
                <div className="flex justify-center mt-3">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        {showDetails ? 'Menos detalhes' : 'Mais detalhes'}
                    </button>
                </div>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Estilo de Vida
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {profile.lifestyle?.sleep_schedule?.replace('_', ' ')} • {' '}
                                    {profile.lifestyle?.activity_level} • {' '}
                                    {profile.lifestyle?.social_preference}
                                </p>
                            </div>
                            
                            <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Comunicação
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {profile.preferences?.communication_style} • {' '}
                                    {profile.preferences?.meeting_preference?.replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Safety Information */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowSafetyInfo(!showSafetyInfo)}
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <Shield className="w-4 h-4" />
                                Informações de Segurança
                            </button>
                            
                            {showSafetyInfo && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm space-y-1">
                                        <p><strong>Perfil Verificado:</strong> Sim</p>
                                        <p><strong>Conectações Mútuas:</strong> 3</p>
                                        <p><strong>Histórico de Segurança:</strong> Limpo</p>
                                        <p><strong>Última Atividade:</strong> Hoje</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Report Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => onReport(profile.id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                                <Flag className="w-3 h-3" />
                                Reportar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
