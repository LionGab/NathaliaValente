/**
 * React Query hooks for Wellness Checklists
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WellnessChecklistsRepository } from '../repositories';
import type { UpdateChecklistItemRequest } from '../../../types/postpartum-wellness';

// Query keys
export const checklistKeys = {
  all: ['wellness-checklists'] as const,
  lists: () => [...checklistKeys.all, 'list'] as const,
  detail: (id: string) => [...checklistKeys.all, 'detail', id] as const,
  userItems: (userId: string) => [...checklistKeys.all, 'user-items', userId] as const,
  userItemsForChecklist: (userId: string, checklistId: string) =>
    [...checklistKeys.userItems(userId), checklistId] as const,
};

/**
 * Fetch all checklists
 */
export function useWellnessChecklists() {
  return useQuery({
    queryKey: checklistKeys.lists(),
    queryFn: () => WellnessChecklistsRepository.getChecklists(),
  });
}

/**
 * Fetch single checklist by ID
 */
export function useWellnessChecklistDetail(id: string) {
  return useQuery({
    queryKey: checklistKeys.detail(id),
    queryFn: () => WellnessChecklistsRepository.getChecklistById(id),
    enabled: !!id,
  });
}

/**
 * Fetch user's checklist items
 */
export function useUserChecklistItems(userId: string, checklistId?: string) {
  return useQuery({
    queryKey: checklistId
      ? checklistKeys.userItemsForChecklist(userId, checklistId)
      : checklistKeys.userItems(userId),
    queryFn: () => WellnessChecklistsRepository.getUserChecklistItems(userId, checklistId),
    enabled: !!userId,
  });
}

/**
 * Update checklist item
 */
export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      checklistId,
      itemId,
      updates,
    }: {
      userId: string;
      checklistId: string;
      itemId: string;
      updates: UpdateChecklistItemRequest;
    }) => WellnessChecklistsRepository.updateChecklistItem(userId, checklistId, itemId, updates),
    onSuccess: (_, { userId, checklistId }) => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.userItems(userId) });
      queryClient.invalidateQueries({
        queryKey: checklistKeys.userItemsForChecklist(userId, checklistId),
      });
    },
  });
}

/**
 * Get user's completed items count
 */
export function useUserCompletedItemsCount(userId: string) {
  return useQuery({
    queryKey: [...checklistKeys.userItems(userId), 'completed-count'],
    queryFn: () => WellnessChecklistsRepository.getUserCompletedItemsCount(userId),
    enabled: !!userId,
  });
}
