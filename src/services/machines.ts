import { v4 as uuidv4 } from 'uuid';
import type { Machine } from '../types';
import { db } from './database';

export const machineService = {
  async getAll(): Promise<Machine[]> {
    return db.getAll<Machine>('machines');
  },

  async getById(id: string): Promise<Machine | undefined> {
    return db.getById<Machine>('machines', id);
  },

  async create(data: Omit<Machine, 'id' | 'createdAt'>): Promise<Machine> {
    const machine: Machine = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
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
    await db.delete('machines', id);
  },
};