/**
 * Wellness Calendar Repository
 * Handles all Supabase interactions for calendar events
 */

import { supabase } from '../../../lib/supabase';
import type {
  WellnessCalendarEvent,
  CreateCalendarEventRequest,
} from '../../../types/postpartum-wellness';

export class WellnessCalendarRepository {
  /**
   * Get user's calendar events
   */
  static async getUserEvents(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('wellness_calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (startDate) {
      query = query.gte('start_date', startDate);
    }

    if (endDate) {
      query = query.lte('start_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as WellnessCalendarEvent[];
  }

  /**
   * Get event by ID
   */
  static async getEventById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('wellness_calendar_events')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data as WellnessCalendarEvent;
  }

  /**
   * Create calendar event
   */
  static async createEvent(userId: string, eventData: CreateCalendarEventRequest) {
    const { data, error } = await supabase
      .from('wellness_calendar_events')
      .insert({
        user_id: userId,
        ...eventData,
      })
      .select()
      .single();

    if (error) throw error;

    return data as WellnessCalendarEvent;
  }

  /**
   * Update calendar event
   */
  static async updateEvent(
    eventId: string,
    userId: string,
    updates: Partial<CreateCalendarEventRequest>
  ) {
    const { data, error } = await supabase
      .from('wellness_calendar_events')
      .update(updates)
      .eq('id', eventId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data as WellnessCalendarEvent;
  }

  /**
   * Mark event as completed
   */
  static async completeEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('wellness_calendar_events')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data as WellnessCalendarEvent;
  }

  /**
   * Delete calendar event
   */
  static async deleteEvent(eventId: string, userId: string) {
    const { error } = await supabase
      .from('wellness_calendar_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(userId: string, limit = 5) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('wellness_calendar_events')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .gte('start_date', now)
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return data as WellnessCalendarEvent[];
  }
}
