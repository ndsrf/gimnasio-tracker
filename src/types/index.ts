export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  deactivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
}

export interface WorkoutSeries {
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  customerId: string;
  machineId: string;
  date: Date;
  series: WorkoutSeries[];
  notes?: string;
  createdAt: Date;
  // Legacy fields for migration
  sets?: number;
  reps?: number;
  weight?: number;
}

export interface WorkoutWithDetails extends Workout {
  customerName: string;
  machineName: string;
}

export type NavigationTab = 'customers' | 'machines' | 'sessions' | 'settings';