export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
}

export interface Workout {
  id: string;
  customerId: string;
  machineId: string;
  date: Date;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
  createdAt: Date;
}

export interface WorkoutWithDetails extends Workout {
  customerName: string;
  machineName: string;
}

export type NavigationTab = 'customers' | 'machines' | 'sessions' | 'settings';