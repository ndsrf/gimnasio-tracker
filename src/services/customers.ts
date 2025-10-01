import { v4 as uuidv4 } from 'uuid';
import type { Customer } from '../types';
import { db } from './database';
import { workoutService } from './workouts';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const customers = await db.getAll<Customer>('customers');
    return customers.sort((a, b) => {
      if (a.deactivated && !b.deactivated) return 1;
      if (!a.deactivated && b.deactivated) return -1;
      return 0;
    });
  },

  async getActive(): Promise<Customer[]> {
    const customers = await this.getAll();
    return customers.filter(customer => !customer.deactivated);
  },

  async getById(id: string): Promise<Customer | undefined> {
    return db.getById<Customer>('customers', id);
  },

  async create(data: Partial<Customer>): Promise<Customer> {
    if (data.id) {
      const existing = await this.getById(data.id);
      if (existing) {
        return this.update(data.id, data);
      }
    }

    const customer: Customer = {
      id: data.id || uuidv4(),
      name: data.name!,
      email: data.email,
      phone: data.phone,
      deactivated: data.deactivated || false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };

    await db.add('customers', customer);
    return customer;
  },

  async update(id: string, data: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & { deactivated?: boolean }>): Promise<Customer> {
    const existing = await db.getById<Customer>('customers', id);
    if (!existing) throw new Error('Customer not found');

    const updated: Customer = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    await db.update('customers', updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const workouts = await workoutService.getByCustomer(id);
    for (const workout of workouts) {
      await workoutService.delete(workout.id);
    }
    await db.delete('customers', id);
  },
};