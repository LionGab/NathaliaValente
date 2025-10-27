/**
 * React Query hooks for Wellness Calendar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WellnessCalendarRepository } from '../repositories';
import type { CreateCalendarEventRequest } from '../../../types/postpartum-wellness';

// Query keys
export const calendarKeys = {
  all: ['wellness-calendar'] as const,
  userEvents: (userId: string) => [...calendarKeys.all, 'user-events', userId] as const,
  userEventsRange: (userId: string, startDate?: string, endDate?: string) =>
    [...calendarKeys.userEvents(userId), 'range', startDate, endDate] as const,
  event: (id: string, userId: string) => [...calendarKeys.all, 'event', id, userId] as const,
  upcoming: (userId: string) => [...calendarKeys.all, 'upcoming', userId] as const,
};

/**
 * Fetch user's calendar events
 */
export function useCalendarEvents(userId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: calendarKeys.userEventsRange(userId, startDate, endDate),
    queryFn: () => WellnessCalendarRepository.getUserEvents(userId, startDate, endDate),
    enabled: !!userId,
  });
}

/**
 * Fetch single event
 */
export function useCalendarEvent(id: string, userId: string) {
  return useQuery({
    queryKey: calendarKeys.event(id, userId),
    queryFn: () => WellnessCalendarRepository.getEventById(id, userId),
    enabled: !!id && !!userId,
  });
}

/**
 * Fetch upcoming events
 */
export function useUpcomingEvents(userId: string, limit = 5) {
  return useQuery({
    queryKey: calendarKeys.upcoming(userId),
    queryFn: () => WellnessCalendarRepository.getUpcomingEvents(userId, limit),
    enabled: !!userId,
  });
}

/**
 * Create calendar event
 */
export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      eventData,
    }: {
      userId: string;
      eventData: CreateCalendarEventRequest;
    }) => WellnessCalendarRepository.createEvent(userId, eventData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.userEvents(userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.upcoming(userId) });
    },
  });
}

/**
 * Update calendar event
 */
export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      updates,
    }: {
      eventId: string;
      userId: string;
      updates: Partial<CreateCalendarEventRequest>;
    }) => WellnessCalendarRepository.updateEvent(eventId, userId, updates),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(data.id, userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.userEvents(userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.upcoming(userId) });
    },
  });
}

/**
 * Complete calendar event
 */
export function useCompleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      WellnessCalendarRepository.completeEvent(eventId, userId),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(data.id, userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.userEvents(userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.upcoming(userId) });
    },
  });
}

/**
 * Delete calendar event
 */
export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      WellnessCalendarRepository.deleteEvent(eventId, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.userEvents(userId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.upcoming(userId) });
    },
  });
}
