import { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Customer, Machine, Workout, NavigationTab } from '../types';
import { db } from '../services/database';
import { AppContext } from './AppContext';

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

const initialState: AppState = {
  currentTab: 'customers',
  customers: [],
  machines: [],
  workouts: [],
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'SET_MACHINES':
      return { ...state, machines: action.payload };
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload };
    case 'SET_SELECTED_CUSTOMER':
      return { ...state, selectedCustomerId: action.payload };
    case 'SET_SELECTED_MACHINE':
      return { ...state, selectedMachineId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'ADD_MACHINE':
      return { ...state, machines: [...state.machines, action.payload] };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [...state.workouts, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'UPDATE_MACHINE':
      return {
        ...state,
        machines: state.machines.map(m => m.id === action.payload.id ? action.payload : m),
      };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(w => w.id === action.payload.id ? action.payload : w),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload),
      };
    case 'DELETE_MACHINE':
      return {
        ...state,
        machines: state.machines.filter(m => m.id !== action.payload),
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(w => w.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function initializeApp() {
      try {
        await db.init();
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize database' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    initializeApp();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}