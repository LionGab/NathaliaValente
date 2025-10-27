/**
 * Wellness Checklists Repository
 * Handles all Supabase interactions for wellness checklists
 */

import { supabase } from '../../../lib/supabase';
import type {
  WellnessChecklist,
  UserChecklistItem,
  UpdateChecklistItemRequest,
} from '../../../types/postpartum-wellness';

export class WellnessChecklistsRepository {
  /**
   * Get all published checklists
   */
  static async getChecklists() {
    const { data, error } = await supabase
      .from('wellness_checklists')
      .select('*')
      .eq('published', true)
      .order('priority_level', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as WellnessChecklist[];
  }

  /**
   * Get checklist by ID
   */
  static async getChecklistById(id: string) {
    const { data, error } = await supabase
      .from('wellness_checklists')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) throw error;

    return data as WellnessChecklist;
  }

  /**
   * Get user's checklist progress
   */
  static async getUserChecklistItems(userId: string, checklistId?: string) {
    let query = supabase.from('user_checklist_items').select('*').eq('user_id', userId);

    if (checklistId) {
      query = query.eq('checklist_id', checklistId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as UserChecklistItem[];
  }

  /**
   * Update checklist item
   */
  static async updateChecklistItem(
    userId: string,
    checklistId: string,
    itemId: string,
    updates: UpdateChecklistItemRequest
  ) {
    const itemData: Partial<UserChecklistItem> = {
      user_id: userId,
      checklist_id: checklistId,
      item_id: itemId,
      completed: updates.completed,
      notes: updates.notes,
    };

    if (updates.completed) {
      itemData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('user_checklist_items')
      .upsert(itemData, {
        onConflict: 'user_id,checklist_id,item_id',
      })
      .select()
      .single();

    if (error) throw error;

    return data as UserChecklistItem;
  }

  /**
   * Get user's total completed items count
   */
  static async getUserCompletedItemsCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('user_checklist_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    if (error) throw error;

    return count || 0;
  }
}
