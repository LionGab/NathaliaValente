/**
 * Wellness Forum Repository
 * Handles all Supabase interactions for wellness forums
 */

import { supabase } from '../../../lib/supabase';
import type {
  WellnessForumTopic,
  WellnessForumReply,
  CreateTopicRequest,
  CreateReplyRequest,
  ForumFilters,
  PaginationParams,
} from '../../../types/postpartum-wellness';

export class WellnessForumRepository {
  /**
   * Get forum topics with filters
   */
  static async getTopics(filters: ForumFilters = {}, pagination: PaginationParams = {}) {
    const { page = 1, per_page = 20 } = pagination;
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    let query = supabase
      .from('wellness_forum_topics')
      .select('*, profiles(id, full_name, avatar_url)', { count: 'exact' })
      .range(from, to)
      .order('is_pinned', { ascending: false })
      .order('last_reply_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.pinned_only) {
      query = query.eq('is_pinned', true);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as WellnessForumTopic[],
      count: count || 0,
    };
  }

  /**
   * Get topic by ID with replies
   */
  static async getTopicById(id: string) {
    // Increment views
    await this.incrementTopicViews(id);

    const { data, error } = await supabase
      .from('wellness_forum_topics')
      .select('*, profiles(id, full_name, avatar_url)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as WellnessForumTopic;
  }

  /**
   * Get replies for a topic
   */
  static async getTopicReplies(topicId: string) {
    const { data, error } = await supabase
      .from('wellness_forum_replies')
      .select('*, profiles(id, full_name, avatar_url)')
      .eq('topic_id', topicId)
      .is('parent_reply_id', null)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get nested replies for each top-level reply
    const repliesWithNested = await Promise.all(
      data.map(async (reply) => {
        const nestedReplies = await this.getNestedReplies(reply.id);
        return {
          ...reply,
          replies: nestedReplies,
        };
      })
    );

    return repliesWithNested as WellnessForumReply[];
  }

  /**
   * Get nested replies
   */
  private static async getNestedReplies(parentReplyId: string) {
    const { data, error } = await supabase
      .from('wellness_forum_replies')
      .select('*, profiles(id, full_name, avatar_url)')
      .eq('parent_reply_id', parentReplyId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });

    if (error) return [];

    return data as WellnessForumReply[];
  }

  /**
   * Create a new topic
   */
  static async createTopic(userId: string, topicData: CreateTopicRequest) {
    const { data, error } = await supabase
      .from('wellness_forum_topics')
      .insert({
        user_id: userId,
        ...topicData,
      })
      .select('*, profiles(id, full_name, avatar_url)')
      .single();

    if (error) throw error;

    return data as WellnessForumTopic;
  }

  /**
   * Create a reply
   */
  static async createReply(userId: string, replyData: CreateReplyRequest) {
    const { data, error } = await supabase
      .from('wellness_forum_replies')
      .insert({
        user_id: userId,
        ...replyData,
      })
      .select('*, profiles(id, full_name, avatar_url)')
      .single();

    if (error) throw error;

    return data as WellnessForumReply;
  }

  /**
   * Update topic
   */
  static async updateTopic(topicId: string, userId: string, updates: Partial<CreateTopicRequest>) {
    const { data, error } = await supabase
      .from('wellness_forum_topics')
      .update(updates)
      .eq('id', topicId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data as WellnessForumTopic;
  }

  /**
   * Delete topic
   */
  static async deleteTopic(topicId: string, userId: string) {
    const { error } = await supabase
      .from('wellness_forum_topics')
      .delete()
      .eq('id', topicId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Delete reply
   */
  static async deleteReply(replyId: string, userId: string) {
    const { error } = await supabase
      .from('wellness_forum_replies')
      .delete()
      .eq('id', replyId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Increment topic views
   */
  private static async incrementTopicViews(topicId: string) {
    const { error } = await supabase
      .from('wellness_forum_topics')
      .update({ views_count: supabase.raw('views_count + 1') })
      .eq('id', topicId);

    if (error) console.error('Error incrementing views:', error);
  }
}
