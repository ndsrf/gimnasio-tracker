import { v4 as uuidv4 } from 'uuid';
import type { Workout, WorkoutWithDetails } from '../types';
import { db } from './database';
import { customerService } from './customers';
import { machineService } from './machines';

// Helper to migrate a single workout
async function migrateWorkout(workout: Workout): Promise<Workout> {
  // If series is missing or empty, and legacy fields exist, migrate.
  if ((!workout.series || workout.series.length === 0) && typeof workout.sets === 'number') {
    const migratedWorkout: Workout = {
      ...workout,
      series: [{
        sets: workout.sets,
        reps: workout.reps as number,
        weight: workout.weight as number,
      }],
    };
    delete migratedWorkout.sets;
    delete migratedWorkout.reps;
    delete migratedWorkout.weight;

    await db.update('workouts', migratedWorkout);
    return migratedWorkout;
  }
  if (!workout.series) {
    workout.series = [];
  }
  return workout;
}

// Helper to process and migrate a list of workouts
async function processWorkouts(workouts: Workout[]): Promise<Workout[]> {
  return Promise.all(workouts.map(migrateWorkout));
}

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    const workouts = await db.getAll<Workout>('workouts');
    return processWorkouts(workouts);
  },

  async getById(id: string): Promise<Workout | undefined> {
    const workout = await db.getById<Workout>('workouts', id);
    if (!workout) return undefined;
    return migrateWorkout(workout);
  },

  async getByCustomer(customerId: string, machineId?: string): Promise<WorkoutWithDetails[]> {
    const workouts = await db.getWorkoutsByCustomerAndMachine(customerId, machineId);
    const migratedWorkouts = await processWorkouts(workouts);

    const workoutsWithDetails: WorkoutWithDetails[] = [];

    for (const workout of migratedWorkouts) {
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

  async create(data: Partial<Workout>): Promise<Workout> {
    if (data.id) {
      const existing = await this.getById(data.id);
      if (existing) {
        return this.update(data.id, data);
      }
    }

    const workout: Workout = {
      id: data.id || uuidv4(),
      customerId: data.customerId!,
      machineId: data.machineId!,
      date: data.date ? new Date(data.date) : new Date(),
      series: data.series || [],
      notes: data.notes,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
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