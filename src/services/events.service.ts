/**
 * Events Service - Handles community events and calendar
 */

import { supabase } from '../lib/supabase';
import type { Event, CreateEventInput, EventAttendee } from '../types/events';

/**
 * Fetch all events with pagination and filtering
 */
export async function getEvents(options?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}): Promise<{ data: Event[]; error: unknown }> {
  try {
    const { page = 0, limit = 20, status, category } = options || {};

    let query = supabase
      .from('events')
      .select(`
        *,
        host:profiles!events_host_id_fkey(id, full_name, avatar_url)
      `)
      .order('start_date', { ascending: true })
      .range(page * limit, (page + 1) * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Event[], error: null };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], error };
  }
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit = 10): Promise<{ data: Event[]; error: unknown }> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host:profiles!events_host_id_fkey(id, full_name, avatar_url)
      `)
      .gte('start_date', now)
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return { data: data as Event[], error: null };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return { data: [], error };
  }
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: string): Promise<{ data: Event | null; error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host:profiles!events_host_id_fkey(id, full_name, avatar_url)
      `)
      .eq('id', eventId)
      .maybeSingle();

    if (error) throw error;

    return { data: data as Event | null, error: null };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { data: null, error };
  }
}

/**
 * Create a new event
 */
export async function createEvent(
  event: CreateEventInput,
  userId: string
): Promise<{ data: Event | null; error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...event,
        host_id: userId,
        status: 'upcoming',
        current_attendees: 0,
      })
      .select(`
        *,
        host:profiles!events_host_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return { data: data as Event, error: null };
  } catch (error) {
    console.error('Error creating event:', error);
    return { data: null, error };
  }
}

/**
 * Register for an event
 */
export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<{ success: boolean; error: unknown }> {
  try {
    // Check if already registered
    const { data: existing } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Already registered' };
    }

    // Check if event is full
    const { data: event } = await supabase
      .from('events')
      .select('max_attendees, current_attendees')
      .eq('id', eventId)
      .single();

    if (event?.max_attendees && event.current_attendees >= event.max_attendees) {
      return { success: false, error: 'Event is full' };
    }

    // Register user
    const { error: insertError } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'registered',
      });

    if (insertError) throw insertError;

    // Update attendee count
    const { error: updateError } = await supabase.rpc('increment_event_attendees', {
      event_id: eventId,
    });

    if (updateError) throw updateError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error };
  }
}

/**
 * Unregister from an event
 */
export async function unregisterFromEvent(
  eventId: string,
  userId: string
): Promise<{ success: boolean; error: unknown }> {
  try {
    const { error: deleteError } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Decrement attendee count
    const { error: updateError } = await supabase.rpc('decrement_event_attendees', {
      event_id: eventId,
    });

    if (updateError) throw updateError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return { success: false, error };
  }
}

/**
 * Check if user is registered for an event
 */
export async function isUserRegistered(
  eventId: string,
  userId: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
}

/**
 * Get user's registered events
 */
export async function getUserEvents(userId: string): Promise<{ data: Event[]; error: unknown }> {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        event:events(
          *,
          host:profiles!events_host_id_fkey(id, full_name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const events = data?.map((item: any) => item.event).filter(Boolean) || [];
    return { data: events as Event[], error: null };
  } catch (error) {
    console.error('Error fetching user events:', error);
    return { data: [], error };
  }
}
