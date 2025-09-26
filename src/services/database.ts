import type { Workout } from '../types';

const DB_NAME = 'gym_tracker_db';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create customers store
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('name', 'name');
        }

        // Create machines store
        if (!db.objectStoreNames.contains('machines')) {
          const machineStore = db.createObjectStore('machines', { keyPath: 'id' });
          machineStore.createIndex('name', 'name');
          machineStore.createIndex('type', 'type');
        }

        // Create workouts store
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
          workoutStore.createIndex('customerId', 'customerId');
          workoutStore.createIndex('machineId', 'machineId');
          workoutStore.createIndex('date', 'date');
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.transaction([storeName], mode).objectStore(storeName);
  }

  // Generic CRUD operations
  async add<T>(storeName: string, item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.add(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Specific query methods
  async getWorkoutsByCustomer(customerId: string): Promise<Workout[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('workouts');
      const index = store.index('customerId');
      const request = index.getAll(customerId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkoutsByMachine(machineId: string): Promise<Workout[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('workouts');
      const index = store.index('machineId');
      const request = index.getAll(machineId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkoutsByCustomerAndMachine(customerId: string, machineId?: string): Promise<Workout[]> {
    const customerWorkouts = await this.getWorkoutsByCustomer(customerId);
    if (!machineId) return customerWorkouts;
    return customerWorkouts.filter(workout => workout.machineId === machineId);
  }
}

export const db = new DatabaseService();