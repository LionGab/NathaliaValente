import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { routineLocalService } from '../services/routine-local.service';
import { routineRemoteService } from '../services/routine-remote.service';
import type { Routine, CreateRoutineInput, UpdateRoutineInput } from '../types/routine';
import { useEffect } from 'react';

const ROUTINES_QUERY_KEY = 'routines';

// Hook principal - cache-first com background sync
export function useRoutines() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Busca local primeiro (instantâneo)
  const { data: localRoutines = [], isLoading: localLoading } = useQuery({
    queryKey: [ROUTINES_QUERY_KEY, 'local'],
    queryFn: () => routineLocalService.getAll(),
    staleTime: Infinity // Cache local nunca expira
  });

  // 2. Background sync com Supabase
  const { data: remoteRoutines, isLoading: remoteLoading } = useQuery({
    queryKey: [ROUTINES_QUERY_KEY, 'remote', user?.id],
    queryFn: () => user ? routineRemoteService.getAll(user.id) : Promise.resolve([]),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
    onSuccess: async (remote) => {
      // Sincronizar local com remote
      const local = await routineLocalService.getAll();
      const toUpdate = remote.filter(r => {
        const localItem = local.find(l => l.id === r.id);
        return !localItem || new Date(r.updated_at) > new Date(localItem.updated_at);
      });

      for (const routine of toUpdate) {
        await routineLocalService.save(routine);
      }

      if (toUpdate.length > 0) {
        queryClient.invalidateQueries([ROUTINES_QUERY_KEY, 'local']);
      }
    }
  });

  // 3. Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const subscription = routineRemoteService.subscribeToChanges(user.id, async (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        await routineLocalService.save(payload.new as Routine);
      } else if (payload.eventType === 'DELETE') {
        await routineLocalService.delete(payload.old.id);
      }
      queryClient.invalidateQueries([ROUTINES_QUERY_KEY, 'local']);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);

  return {
    routines: localRoutines,
    loading: localLoading,
    syncing: remoteLoading
  };
}

export function useCreateRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRoutineInput) => {
      if (!user) throw new Error('User not authenticated');
      
      // 1. Criar no Supabase
      const routine = await routineRemoteService.create(user.id, input);
      
      // 2. Salvar no cache local
      await routineLocalService.save(routine);
      
      return routine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([ROUTINES_QUERY_KEY]);
    }
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoutineInput) => {
      // 1. Atualizar no Supabase
      const routine = await routineRemoteService.update(input);
      
      // 2. Atualizar cache local
      await routineLocalService.save(routine);
      
      return routine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([ROUTINES_QUERY_KEY]);
    }
  });
}

export function useToggleRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const routine = await routineRemoteService.toggleComplete(id, completed);
      await routineLocalService.save(routine);
      return routine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([ROUTINES_QUERY_KEY]);
    }
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await routineRemoteService.delete(id);
      await routineLocalService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([ROUTINES_QUERY_KEY]);
    }
  });
}
