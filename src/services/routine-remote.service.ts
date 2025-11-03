import { supabase } from '../lib/supabase';
import type { Routine, CreateRoutineInput, UpdateRoutineInput } from '../types/routine';

export class RoutineRemoteService {
  async getAll(userId: string): Promise<Routine[]> {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('time', { ascending: true });

    if (error) throw new Error(`Failed to fetch routines: ${error.message}`);
    return data as Routine[];
  }

  async getById(id: string): Promise<Routine | null> {
    const { data, error } = await supabase.from('routines').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch routine: ${error.message}`);
    }
    return data as Routine;
  }

  async create(userId: string, input: CreateRoutineInput): Promise<Routine> {
    const { data, error } = await supabase
      .from('routines')
      .insert({
        user_id: userId,
        ...input,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create routine: ${error.message}`);
    return data as Routine;
  }

  async update(input: UpdateRoutineInput): Promise<Routine> {
    const { id, ...updateData } = input;
    const { data, error } = await supabase
      .from('routines')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update routine: ${error.message}`);
    return data as Routine;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('routines').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete routine: ${error.message}`);
  }

  async toggleComplete(id: string, completed: boolean): Promise<Routine> {
    return this.update({
      id,
      completed_at: completed ? new Date().toISOString() : null,
    });
  }

  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('routine-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'routines',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}

export const routineRemoteService = new RoutineRemoteService();
