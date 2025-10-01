import { createContext } from 'react';
import type { Customer, Machine, Workout, NavigationTab } from '../types';

interface AppState {
  currentTab: NavigationTab;
  customers: Customer[];
  machines: Machine[];
  workouts: Workout[];
  selectedCustomerId?: string;
  selectedMachineId?: string;
  isLoading: boolean;
  error?: string;
}

type AppAction =
  | { type: 'SET_TAB'; payload: NavigationTab }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_MACHINES'; payload: Machine[] }
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'SET_SELECTED_CUSTOMER'; payload?: string }
  | { type: 'SET_SELECTED_MACHINE'; payload?: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload?: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'ADD_MACHINE'; payload: Machine }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_MACHINE'; payload: Machine }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'DELETE_MACHINE'; payload: string }
  | { type: 'DELETE_WORKOUT'; payload: string };

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);