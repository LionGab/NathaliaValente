/**
 * React Query hooks for Wellness Content
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WellnessContentRepository } from '../repositories';
import type {
  ContentFilters,
  PaginationParams,
  InteractionType,
} from '../../../types/postpartum-wellness';

// Query keys
export const contentKeys = {
  all: ['wellness-content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters: ContentFilters, pagination: PaginationParams) =>
    [...contentKeys.lists(), filters, pagination] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
  featured: () => [...contentKeys.all, 'featured'] as const,
  saved: (userId: string) => [...contentKeys.all, 'saved', userId] as const,
};

/**
 * Fetch wellness content with filters
 */
export function useWellnessContent(
  filters: ContentFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: contentKeys.list(filters, pagination),
    queryFn: () => WellnessContentRepository.getContent(filters, pagination),
  });
}

/**
 * Fetch single content item by ID
 */
export function useWellnessContentDetail(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => WellnessContentRepository.getContentById(id),
    enabled: !!id,
  });
}

/**
 * Fetch featured content
 */
export function useFeaturedContent(limit = 5) {
  return useQuery({
    queryKey: contentKeys.featured(),
    queryFn: () => WellnessContentRepository.getFeaturedContent(limit),
  });
}

/**
 * Fetch user's saved content
 */
export function useSavedContent(userId: string) {
  return useQuery({
    queryKey: contentKeys.saved(userId),
    queryFn: () => WellnessContentRepository.getUserSavedContent(userId),
    enabled: !!userId,
  });
}

/**
 * Check if user has interacted with content
 */
export function useContentInteraction(
  userId: string,
  contentId: string,
  interactionType: InteractionType
) {
  return useQuery({
    queryKey: ['content-interaction', userId, contentId, interactionType],
    queryFn: () => WellnessContentRepository.hasUserInteracted(userId, contentId, interactionType),
    enabled: !!userId && !!contentId,
  });
}

/**
 * Record user interaction with content (like, save)
 */
export function useRecordInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      contentId,
      interactionType,
    }: {
      userId: string;
      contentId: string;
      interactionType: InteractionType;
    }) => WellnessContentRepository.recordInteraction(userId, contentId, interactionType),
    onSuccess: (_, { userId, contentId }) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: contentKeys.saved(userId) });
      queryClient.invalidateQueries({ queryKey: ['content-interaction'] });
    },
  });
}

/**
 * Remove user interaction
 */
export function useRemoveInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      contentId,
      interactionType,
    }: {
      userId: string;
      contentId: string;
      interactionType: InteractionType;
    }) => WellnessContentRepository.removeInteraction(userId, contentId, interactionType),
    onSuccess: (_, { userId, contentId }) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: contentKeys.saved(userId) });
      queryClient.invalidateQueries({ queryKey: ['content-interaction'] });
    },
  });
}
