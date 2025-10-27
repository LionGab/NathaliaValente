/**
 * Wellness Content Repository
 * Handles all Supabase interactions for wellness content
 */

import { supabase } from '../../../lib/supabase';
import type {
  WellnessContent,
  ContentFilters,
  PaginationParams,
  UserContentInteraction,
  InteractionType,
} from '../../../types/postpartum-wellness';

export class WellnessContentRepository {
  /**
   * Fetch paginated wellness content with filters
   */
  static async getContent(filters: ContentFilters = {}, pagination: PaginationParams = {}) {
    const { page = 1, per_page = 10 } = pagination;
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    let query = supabase
      .from('wellness_content')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.content_type) {
      query = query.eq('content_type', filters.content_type);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    if (filters.postpartum_week !== undefined) {
      query = query
        .lte('postpartum_week_min', filters.postpartum_week)
        .gte('postpartum_week_max', filters.postpartum_week);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as WellnessContent[],
      count: count || 0,
    };
  }

  /**
   * Get a single content item by ID
   */
  static async getContentById(id: string) {
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) throw error;

    // Increment view count
    await this.incrementViews(id);

    return data as WellnessContent;
  }

  /**
   * Get featured content
   */
  static async getFeaturedContent(limit = 5) {
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data as WellnessContent[];
  }

  /**
   * Increment content view count
   */
  static async incrementViews(contentId: string) {
    const { error } = await supabase.rpc('increment_content_views', {
      content_uuid: contentId,
    });

    if (error) console.error('Error incrementing views:', error);
  }

  /**
   * Record user interaction with content
   */
  static async recordInteraction(
    userId: string,
    contentId: string,
    interactionType: InteractionType
  ) {
    const { data, error } = await supabase
      .from('user_content_interactions')
      .upsert(
        {
          user_id: userId,
          content_id: contentId,
          interaction_type: interactionType,
        },
        {
          onConflict: 'user_id,content_id,interaction_type',
        }
      )
      .select()
      .single();

    if (error) throw error;

    // Update content counters
    if (interactionType === 'like') {
      await this.incrementLikes(contentId);
    } else if (interactionType === 'save') {
      await this.incrementSaves(contentId);
    }

    return data as UserContentInteraction;
  }

  /**
   * Remove user interaction
   */
  static async removeInteraction(
    userId: string,
    contentId: string,
    interactionType: InteractionType
  ) {
    const { error } = await supabase
      .from('user_content_interactions')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('interaction_type', interactionType);

    if (error) throw error;

    // Update content counters
    if (interactionType === 'like') {
      await this.decrementLikes(contentId);
    } else if (interactionType === 'save') {
      await this.decrementSaves(contentId);
    }
  }

  /**
   * Get user's saved content
   */
  static async getUserSavedContent(userId: string) {
    const { data, error } = await supabase
      .from('user_content_interactions')
      .select('content_id, wellness_content(*)')
      .eq('user_id', userId)
      .eq('interaction_type', 'save')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((item) => item.wellness_content) as WellnessContent[];
  }

  /**
   * Check if user has interacted with content
   */
  static async hasUserInteracted(
    userId: string,
    contentId: string,
    interactionType: InteractionType
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_content_interactions')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('interaction_type', interactionType)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  }

  /**
   * Increment likes count
   */
  private static async incrementLikes(contentId: string) {
    const { error } = await supabase.rpc('increment', {
      table_name: 'wellness_content',
      row_id: contentId,
      column_name: 'likes_count',
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const { error: updateError } = await supabase
        .from('wellness_content')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', contentId);

      if (updateError) console.error('Error incrementing likes:', updateError);
    }
  }

  /**
   * Decrement likes count
   */
  private static async decrementLikes(contentId: string) {
    const { error } = await supabase
      .from('wellness_content')
      .update({ likes_count: supabase.raw('GREATEST(likes_count - 1, 0)') })
      .eq('id', contentId);

    if (error) console.error('Error decrementing likes:', error);
  }

  /**
   * Increment saves count
   */
  private static async incrementSaves(contentId: string) {
    const { error } = await supabase
      .from('wellness_content')
      .update({ saves_count: supabase.raw('saves_count + 1') })
      .eq('id', contentId);

    if (error) console.error('Error incrementing saves:', error);
  }

  /**
   * Decrement saves count
   */
  private static async decrementSaves(contentId: string) {
    const { error } = await supabase
      .from('wellness_content')
      .update({ saves_count: supabase.raw('GREATEST(saves_count - 1, 0)') })
      .eq('id', contentId);

    if (error) console.error('Error decrementing saves:', error);
  }
}
