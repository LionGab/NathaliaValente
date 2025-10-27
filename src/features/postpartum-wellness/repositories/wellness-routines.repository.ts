/**
 * Wellness Routines Repository
 * Handles all Supabase interactions for wellness routines
 */

import { supabase } from '../../../lib/supabase';
import type {
  WellnessRoutine,
  UserRoutineProgress,
  RoutineFilters,
  PaginationParams,
  RateRoutineRequest,
} from '../../../types/postpartum-wellness';

export class WellnessRoutinesRepository {
  /**
   * Fetch paginated routines with filters
   */
  static async getRoutines(filters: RoutineFilters = {}, pagination: PaginationParams = {}) {
    const { page = 1, per_page = 10 } = pagination;
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    let query = supabase
      .from('wellness_routines')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }

    if (filters.max_duration) {
      query = query.lte('duration_minutes', filters.max_duration);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    if (filters.postpartum_week !== undefined) {
      query = query
        .lte('postpartum_week_min', filters.postpartum_week)
        .gte('postpartum_week_max', filters.postpartum_week);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as WellnessRoutine[],
      count: count || 0,
    };
  }

  /**
   * Get a single routine by ID
   */
  static async getRoutineById(id: string) {
    const { data, error } = await supabase
      .from('wellness_routines')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) throw error;

    return data as WellnessRoutine;
  }

  /**
   * Get featured routines
   */
  static async getFeaturedRoutines(limit = 5) {
    const { data, error } = await supabase
      .from('wellness_routines')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('rating_average', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;

    return data as WellnessRoutine[];
  }

  /**
   * Get user's routine progress
   */
  static async getUserRoutineProgress(userId: string, routineId?: string) {
    let query = supabase
      .from('user_routine_progress')
      .select('*, routine:wellness_routines(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (routineId) {
      query = query.eq('routine_id', routineId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as UserRoutineProgress[];
  }

  /**
   * Start a routine
   */
  static async startRoutine(userId: string, routineId: string) {
    const { data, error } = await supabase
      .from('user_routine_progress')
      .insert({
        user_id: userId,
        routine_id: routineId,
        current_step: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return data as UserRoutineProgress;
  }

  /**
   * Update routine progress
   */
  static async updateRoutineProgress(progressId: string, currentStep: number, completed?: boolean) {
    const updates: Partial<UserRoutineProgress> = {
      current_step: currentStep,
    };

    if (completed) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('user_routine_progress')
      .update(updates)
      .eq('id', progressId)
      .select()
      .single();

    if (error) throw error;

    // If completed, increment routine completions count
    if (completed && data) {
      await this.incrementCompletions(data.routine_id);
    }

    return data as UserRoutineProgress;
  }

  /**
   * Rate a routine
   */
  static async rateRoutine(progressId: string, rateData: RateRoutineRequest) {
    const { data, error } = await supabase
      .from('user_routine_progress')
      .update({
        rating: rateData.rating,
        feedback: rateData.feedback,
      })
      .eq('id', progressId)
      .select()
      .single();

    if (error) throw error;

    // Update routine rating average
    if (data) {
      await this.updateRoutineRating(data.routine_id);
    }

    return data as UserRoutineProgress;
  }

  /**
   * Get user's completed routines count
   */
  static async getUserCompletedCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_routine_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    if (error) throw error;

    return count || 0;
  }

  /**
   * Increment routine completions count
   */
  private static async incrementCompletions(routineId: string) {
    const { error } = await supabase
      .from('wellness_routines')
      .update({ completions_count: supabase.raw('completions_count + 1') })
      .eq('id', routineId);

    if (error) console.error('Error incrementing completions:', error);
  }

  /**
   * Update routine rating average
   */
  private static async updateRoutineRating(routineId: string) {
    // Get all ratings for this routine
    const { data, error } = await supabase
      .from('user_routine_progress')
      .select('rating')
      .eq('routine_id', routineId)
      .not('rating', 'is', null);

    if (error || !data || data.length === 0) return;

    const ratings = data.map((r) => r.rating as number);
    const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

    await supabase
      .from('wellness_routines')
      .update({
        rating_average: average,
        rating_count: ratings.length,
      })
      .eq('id', routineId);
  }
}
