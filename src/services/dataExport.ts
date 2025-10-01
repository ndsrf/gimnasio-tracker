import type { Customer, Machine, Workout } from '../types';
import { customerService } from './customers';
import { machineService } from './machines';
import { workoutService } from './workouts';

export interface ExportData {
  version: string;
  exportDate: string;
  customers: Customer[];
  machines: Machine[];
  workouts: Workout[];
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported?: {
    customers: number;
    machines: number;
    workouts: number;
  };
}

export const dataExportService = {
  async exportAllData(): Promise<ExportData> {
    try {
      const [customers, machines, workouts] = await Promise.all([
        customerService.getAll(),
        machineService.getAll(),
        workoutService.getAll(),
      ]);

      const exportData: ExportData = {
        version: '1.1.0', // Bump version for new structure
        exportDate: new Date().toISOString(),
        customers,
        machines,
        workouts,
      };

      return exportData;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  },

  downloadDataAsFile(data: ExportData, filename?: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const defaultFilename = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    const finalFilename = filename || defaultFilename;

    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async exportAndDownload(filename?: string): Promise<void> {
    try {
      const data = await this.exportAllData();
      this.downloadDataAsFile(data, filename);
    } catch (error) {
      console.error('Failed to export and download data:', error);
      throw error;
    }
  },

  validateImportData(data: any): data is ExportData {
    if (!data || typeof data !== 'object') return false;

    const hasBaseProps = data.version && data.exportDate && Array.isArray(data.customers) &&
                         Array.isArray(data.machines) && Array.isArray(data.workouts);
    if (!hasBaseProps) return false;

    const areCustomersValid = (data.customers as any[]).every((c: any) => c.id && c.name && c.createdAt && c.updatedAt);
    if (!areCustomersValid) return false;

    const areMachinesValid = (data.machines as any[]).every((m: any) => m.id && m.name && m.type && m.createdAt);
    if (!areMachinesValid) return false;

    const areWorkoutsValid = (data.workouts as any[]).every((w: any) => {
      const hasBaseFields = w.id && w.customerId && w.machineId && w.date && w.createdAt;
      if (!hasBaseFields) return false;

      const hasNewSeries = Array.isArray(w.series) && (w.series as any[]).every(
        (s: any) => typeof s.sets === 'number' && typeof s.reps === 'number' && typeof s.weight === 'number'
      );
      const hasOldSeries = typeof w.sets === 'number' && typeof w.reps === 'number' && typeof w.weight === 'number';

      return hasNewSeries || hasOldSeries;
    });
    if (!areWorkoutsValid) return false;

    return true;
  },

  async importData(data: ExportData): Promise<ImportResult> {
    if (!this.validateImportData(data)) {
      return {
        success: false,
        message: 'Invalid data format. Please check the file and try again.',
      };
    }

    try {
      await this.clearAllData();

      for (const customer of data.customers) {
        await customerService.create(customer);
      }

      for (const machine of data.machines) {
        await machineService.create(machine);
      }

      for (const workout of data.workouts) {
        const series = (workout.series && workout.series.length > 0)
          ? workout.series
          : (typeof workout.sets === 'number'
            ? [{ sets: workout.sets, reps: workout.reps as number, weight: workout.weight as number }]
            : []);

        if (series.length > 0) {
          await workoutService.create({ ...workout, series });
        }
      }

      return {
        success: true,
        message: `Successfully imported ${data.customers.length} customers, ${data.machines.length} machines, and ${data.workouts.length} workouts.`,
        imported: {
          customers: data.customers.length,
          machines: data.machines.length,
          workouts: data.workouts.length,
        },
      };
    } catch (error) {
      console.error('Failed to import data:', error);
      return {
        success: false,
        message: 'An error occurred during the import process. Please check the data and try again.',
      };
    }
  },

  async importFromFile(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const jsonString = event.target?.result as string;
          const data = JSON.parse(jsonString);
          const result = await this.importData(data);
          resolve(result);
        } catch {
          resolve({
            success: false,
            message: 'Invalid JSON file. Please check the file format and try again.',
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          message: 'Failed to read the file. Please try again.',
        });
      };

      reader.readAsText(file);
    });
  },

  async clearAllData(): Promise<void> {
    try {
      const [customers, machines, workouts] = await Promise.all([
        customerService.getAll(),
        machineService.getAll(),
        workoutService.getAll(),
      ]);

      for (const workout of workouts) {
        await workoutService.delete(workout.id);
      }

      for (const customer of customers) {
        await customerService.delete(customer.id);
      }

      for (const machine of machines) {
        await machineService.delete(machine.id);
      }

    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('Failed to clear all data');
    }
  },
};