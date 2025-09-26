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
        version: '1.0.0',
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
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields
    if (!data.version || !data.exportDate || !Array.isArray(data.customers) ||
        !Array.isArray(data.machines) || !Array.isArray(data.workouts)) {
      return false;
    }

    // Validate customer structure
    for (const customer of data.customers) {
      if (!customer.id || !customer.name || !customer.createdAt || !customer.updatedAt) {
        return false;
      }
    }

    // Validate machine structure
    for (const machine of data.machines) {
      if (!machine.id || !machine.name || !machine.type || !machine.createdAt) {
        return false;
      }
    }

    // Validate workout structure
    for (const workout of data.workouts) {
      if (!workout.id || !workout.customerId || !workout.machineId ||
          !workout.date || typeof workout.sets !== 'number' ||
          typeof workout.reps !== 'number' || typeof workout.weight !== 'number' ||
          !workout.createdAt) {
        return false;
      }
    }

    return true;
  },

  async importData(data: ExportData): Promise<ImportResult> {
    try {
      if (!this.validateImportData(data)) {
        return {
          success: false,
          message: 'Invalid data format. Please check the file and try again.',
        };
      }

      let importedCounts = {
        customers: 0,
        machines: 0,
        workouts: 0,
      };

      // Import data and let duplicates be handled by the database constraints

      // Import customers
      for (const customer of data.customers) {
        try {
          await customerService.create({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          });
          importedCounts.customers++;
        } catch (error) {
          // Customer might already exist, skip or handle as needed
          console.warn(`Failed to import customer ${customer.name}:`, error);
        }
      }

      // Import machines
      for (const machine of data.machines) {
        try {
          await machineService.create({
            name: machine.name,
            type: machine.type,
          });
          importedCounts.machines++;
        } catch (error) {
          // Machine might already exist, skip or handle as needed
          console.warn(`Failed to import machine ${machine.name}:`, error);
        }
      }

      // Import workouts
      for (const workout of data.workouts) {
        try {
          await workoutService.create({
            customerId: workout.customerId,
            machineId: workout.machineId,
            date: new Date(workout.date),
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            notes: workout.notes,
          });
          importedCounts.workouts++;
        } catch (error) {
          // Workout might already exist or reference invalid IDs, skip
          console.warn(`Failed to import workout ${workout.id}:`, error);
        }
      }

      return {
        success: true,
        message: `Successfully imported ${importedCounts.customers} customers, ${importedCounts.machines} machines, and ${importedCounts.workouts} workouts.`,
        imported: importedCounts,
      };

    } catch (error) {
      console.error('Failed to import data:', error);
      return {
        success: false,
        message: 'Failed to import data. Please try again.',
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
        } catch (error) {
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
      // Get all data
      const [customers, machines, workouts] = await Promise.all([
        customerService.getAll(),
        machineService.getAll(),
        workoutService.getAll(),
      ]);

      // Delete all workouts first (to avoid foreign key issues)
      for (const workout of workouts) {
        await workoutService.delete(workout.id);
      }

      // Delete all customers
      for (const customer of customers) {
        await customerService.delete(customer.id);
      }

      // Delete all machines
      for (const machine of machines) {
        await machineService.delete(machine.id);
      }

    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('Failed to clear all data');
    }
  },
};