/**
 * Event types for ClubNath community events system
 */

export type EventCategory =
  | 'workshop'
  | 'live'
  | 'meetup'
  | 'webinar'
  | 'masterclass';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  start_date: string;
  end_date: string;
  image_url?: string;
  location?: string;
  is_online: boolean;
  meeting_url?: string;
  max_attendees?: number;
  current_attendees: number;
  is_premium: boolean;
  host_id: string;
  host?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'attended' | 'cancelled';
  created_at: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: EventCategory;
  start_date: string;
  end_date: string;
  image_url?: string;
  location?: string;
  is_online: boolean;
  meeting_url?: string;
  max_attendees?: number;
  is_premium: boolean;
}
