/**
 * Followers Service - Handles social connections between users
 */

import { supabase } from '../lib/supabase';
import type { FollowerProfile } from '../types/followers';

/**
 * Follow a user
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error: unknown }> {
  try {
    const { error } = await supabase.from('followers').insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error following user:', error);
    return { success: false, error };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error: unknown }> {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error };
  }
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

/**
 * Get a user's followers
 */
export async function getFollowers(
  userId: string
): Promise<{ data: FollowerProfile[]; error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(
        `
        follower:profiles!followers_follower_id_fkey(
          id,
          full_name,
          avatar_url,
          followers_count,
          following_count
        )
      `
      )
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const followers = data?.map((item: any) => item.follower).filter(Boolean) || [];
    return { data: followers as FollowerProfile[], error: null };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { data: [], error };
  }
}

/**
 * Get users that a user is following
 */
export async function getFollowing(
  userId: string
): Promise<{ data: FollowerProfile[]; error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(
        `
        following:profiles!followers_following_id_fkey(
          id,
          full_name,
          avatar_url,
          followers_count,
          following_count
        )
      `
      )
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const following = data?.map((item: any) => item.following).filter(Boolean) || [];
    return { data: following as FollowerProfile[], error: null };
  } catch (error) {
    console.error('Error fetching following:', error);
    return { data: [], error };
  }
}

/**
 * Get mutual followers (users who follow each other)
 */
export async function getMutualFollowers(
  userId: string
): Promise<{ data: FollowerProfile[]; error: unknown }> {
  try {
    const { data, error } = await supabase.rpc('get_mutual_followers', {
      user_id: userId,
    });

    if (error) throw error;

    return { data: (data || []) as FollowerProfile[], error: null };
  } catch (error) {
    console.error('Error fetching mutual followers:', error);
    return { data: [], error };
  }
}

/**
 * Get suggested users to follow (users with many followers that current user doesn't follow)
 */
export async function getSuggestedUsers(
  userId: string,
  limit = 10
): Promise<{ data: FollowerProfile[]; error: unknown }> {
  try {
    // Get users the current user is already following
    const { data: following } = await getFollowing(userId);
    const followingIds = following.map((user) => user.id);

    // Get popular users (by followers_count) that the user isn't following
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, followers_count, following_count')
      .not('id', 'in', `(${followingIds.join(',') || 'NULL'})`)
      .neq('id', userId)
      .order('followers_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: (data || []) as FollowerProfile[], error: null };
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    return { data: [], error };
  }
}
