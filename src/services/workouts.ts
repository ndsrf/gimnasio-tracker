import { v4 as uuidv4 } from 'uuid';
import type { Workout, WorkoutWithDetails } from '../types';
import { db } from './database';
import { customerService } from './customers';
import { machineService } from './machines';

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    return db.getAll<Workout>('workouts');
  },

  async getById(id: string): Promise<Workout | undefined> {
    return db.getById<Workout>('workouts', id);
  },

  async getByCustomer(customerId: string, machineId?: string): Promise<WorkoutWithDetails[]> {
    const workouts = await db.getWorkoutsByCustomerAndMachine(customerId, machineId);
    const workoutsWithDetails: WorkoutWithDetails[] = [];

    for (const workout of workouts) {
      const customer = await customerService.getById(workout.customerId);
      const machine = await machineService.getById(workout.machineId);

      if (customer && machine) {
        workoutsWithDetails.push({
          ...workout,
          customerName: customer.name,
          machineName: machine.name,
        });
      }
    }

    // Sort by date descending, then by machine name
    return workoutsWithDetails.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.machineName.localeCompare(b.machineName);
    });
  },

  async create(data: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    const workout: Workout = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };

    await db.add('workouts', workout);
    return workout;
  },

  async update(id: string, data: Partial<Omit<Workout, 'id' | 'createdAt'>>): Promise<Workout> {
    const existing = await db.getById<Workout>('workouts', id);
    if (!existing) throw new Error('Workout not found');

    const updated: Workout = {
      ...existing,
      ...data,
    };

    await db.update('workouts', updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    await db.delete('workouts', id);
  },
};