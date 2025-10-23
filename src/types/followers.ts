/**
 * Followers/Connections types for ClubNath social system
 */

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowerProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
}
