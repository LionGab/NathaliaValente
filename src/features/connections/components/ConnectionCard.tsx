import React from 'react';
import { Heart, MapPin, Clock, Star, X, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ConnectionCardProps {
  profile: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    babyAge: string;
    interests: string[];
    bio?: string;
    compatibility: number;
    reasons: string[];
  };
  onConnect: (profileId: string) => void;
  onPass: () => void;
  onViewProfile?: (profileId: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  profile,
  onConnect,
  onPass,
  onViewProfile
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Profile Image */}
      <div className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        {/* Compatibility Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-900">
              {profile.compatibility}%
            </span>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="p-6">
        {/* Name and Location */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.name}
          </h2>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{profile.location}</span>
          </div>
        </div>

        {/* Baby Age */}
        <div className="flex items-center gap-1 text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{profile.babyAge}</span>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {profile.bio}
          </p>
        )}

        {/* Compatibility Reasons */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Por que vocês são compatíveis:
          </h3>
          <ul className="space-y-1">
            {profile.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onPass}
            variant="outline"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Passar
          </Button>
          <Button
            onClick={() => onConnect(profile.id)}
            className="flex-1 bg-pink-500 hover:bg-pink-600"
          >
            <Heart className="w-4 h-4 mr-2" />
            Conectar
          </Button>
        </div>

        {/* View Profile Button */}
        {onViewProfile && (
          <Button
            onClick={() => onViewProfile(profile.id)}
            variant="ghost"
            className="w-full mt-3 text-gray-600 hover:text-gray-900"
          >
            Ver Perfil Completo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
