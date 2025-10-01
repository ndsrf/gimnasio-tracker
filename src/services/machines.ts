import { v4 as uuidv4 } from 'uuid';
import type { Machine, Workout } from '../types';
import { db } from './database';
import { workoutService } from './workouts';

export const machineService = {
  async getAll(): Promise<Machine[]> {
    return db.getAll<Machine>('machines');
  },

  async getById(id: string): Promise<Machine | undefined> {
    return db.getById<Machine>('machines', id);
  },

  async create(data: Partial<Machine>): Promise<Machine> {
    if (data.id) {
      const existing = await this.getById(data.id);
      if (existing) {
        return this.update(data.id, data);
      }
    }

    const machine: Machine = {
      id: data.id || uuidv4(),
      name: data.name!,
      type: data.type!,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };

    await db.add('machines', machine);
    return machine;
  },

  async update(id: string, data: Partial<Omit<Machine, 'id' | 'createdAt'>>): Promise<Machine> {
    const existing = await db.getById<Machine>('machines', id);
    if (!existing) throw new Error('Machine not found');

    const updated: Machine = {
      ...existing,
      ...data,
    };

    await db.update('machines', updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const workouts = await db.getAll<Workout>('workouts');
    const workoutsByMachine = workouts.filter(w => w.machineId === id);
    for (const workout of workoutsByMachine) {
      await workoutService.delete(workout.id);
    }
    await db.delete('machines', id);
  },
};