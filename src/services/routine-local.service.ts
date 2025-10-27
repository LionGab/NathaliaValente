import localforage from 'localforage';
import type { Routine } from '../types/routine';

const ROUTINE_STORE = 'routines';
const SYNC_QUEUE_STORE = 'routine_sync_queue';

// Configurar localforage
localforage.config({
  name: 'ClubNath',
  storeName: ROUTINE_STORE,
  description: 'Offline storage for routines'
});

export class RoutineLocalService {
  private store: LocalForage;
  private syncQueue: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'ClubNath',
      storeName: ROUTINE_STORE
    });
    
    this.syncQueue = localforage.createInstance({
      name: 'ClubNath',
      storeName: SYNC_QUEUE_STORE
    });
  }

  async getAll(): Promise<Routine[]> {
    const routines: Routine[] = [];
    await this.store.iterate<Routine, void>((routine) => {
      routines.push(routine);
    });
    return routines.sort((a, b) => a.time.localeCompare(b.time));
  }

  async getById(id: string): Promise<Routine | null> {
    return await this.store.getItem<Routine>(id);
  }

  async save(routine: Routine): Promise<void> {
    await this.store.setItem(routine.id, routine);
    await this.addToSyncQueue('upsert', routine.id);
  }

  async delete(id: string): Promise<void> {
    await this.store.removeItem(id);
    await this.addToSyncQueue('delete', id);
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }

  private async addToSyncQueue(action: 'upsert' | 'delete', routineId: string): Promise<void> {
    const queueKey = `${action}_${routineId}_${Date.now()}`;
    await this.syncQueue.setItem(queueKey, { action, routineId, timestamp: Date.now() });
  }

  async getSyncQueue(): Promise<Array<{ action: 'upsert' | 'delete'; routineId: string }>> {
    const queue: Array<{ action: 'upsert' | 'delete'; routineId: string }> = [];
    await this.syncQueue.iterate<{ action: 'upsert' | 'delete'; routineId: string }, void>((item) => {
      queue.push(item);
    });
    return queue;
  }

  async clearSyncQueue(): Promise<void> {
    await this.syncQueue.clear();
  }
}

export const routineLocalService = new RoutineLocalService();
