/**
 * React Query hooks for Wellness Routines
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WellnessRoutinesRepository } from '../repositories';
import type {
  RoutineFilters,
  PaginationParams,
  RateRoutineRequest,
} from '../../../types/postpartum-wellness';

// Query keys
export const routineKeys = {
  all: ['wellness-routines'] as const,
  lists: () => [...routineKeys.all, 'list'] as const,
  list: (filters: RoutineFilters, pagination: PaginationParams) =>
    [...routineKeys.lists(), filters, pagination] as const,
  details: () => [...routineKeys.all, 'detail'] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
  featured: () => [...routineKeys.all, 'featured'] as const,
  userProgress: (userId: string) => [...routineKeys.all, 'progress', userId] as const,
};

/**
 * Fetch wellness routines with filters
 */
export function useWellnessRoutines(
  filters: RoutineFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: routineKeys.list(filters, pagination),
    queryFn: () => WellnessRoutinesRepository.getRoutines(filters, pagination),
  });
}

/**
 * Fetch single routine by ID
 */
export function useWellnessRoutineDetail(id: string) {
  return useQuery({
    queryKey: routineKeys.detail(id),
    queryFn: () => WellnessRoutinesRepository.getRoutineById(id),
    enabled: !!id,
  });
}

/**
 * Fetch featured routines
 */
export function useFeaturedRoutines(limit = 5) {
  return useQuery({
    queryKey: routineKeys.featured(),
    queryFn: () => WellnessRoutinesRepository.getFeaturedRoutines(limit),
  });
}

/**
 * Fetch user's routine progress
 */
export function useUserRoutineProgress(userId: string, routineId?: string) {
  return useQuery({
    queryKey: routineKeys.userProgress(userId),
    queryFn: () => WellnessRoutinesRepository.getUserRoutineProgress(userId, routineId),
    enabled: !!userId,
  });
}

/**
 * Start a routine
 */
export function useStartRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, routineId }: { userId: string; routineId: string }) =>
      WellnessRoutinesRepository.startRoutine(userId, routineId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.userProgress(userId) });
    },
  });
}

/**
 * Update routine progress
 */
export function useUpdateRoutineProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      progressId,
      currentStep,
      completed,
    }: {
      progressId: string;
      currentStep: number;
      completed?: boolean;
    }) => WellnessRoutinesRepository.updateRoutineProgress(progressId, currentStep, completed),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.userProgress(data.user_id) });
      if (data.routine_id) {
        queryClient.invalidateQueries({ queryKey: routineKeys.detail(data.routine_id) });
      }
    },
  });
}

/**
 * Rate a routine
 */
export function useRateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ progressId, rateData }: { progressId: string; rateData: RateRoutineRequest }) =>
      WellnessRoutinesRepository.rateRoutine(progressId, rateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.userProgress(data.user_id) });
      if (data.routine_id) {
        queryClient.invalidateQueries({ queryKey: routineKeys.detail(data.routine_id) });
      }
    },
  });
}

/**
 * Get user's completed routines count
 */
export function useUserCompletedRoutinesCount(userId: string) {
  return useQuery({
    queryKey: [...routineKeys.userProgress(userId), 'completed-count'],
    queryFn: () => WellnessRoutinesRepository.getUserCompletedCount(userId),
    enabled: !!userId,
  });
}
