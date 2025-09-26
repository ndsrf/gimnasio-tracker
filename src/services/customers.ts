import { v4 as uuidv4 } from 'uuid';
import type { Customer } from '../types';
import { db } from './database';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return db.getAll<Customer>('customers');
  },

  async getById(id: string): Promise<Customer | undefined> {
    return db.getById<Customer>('customers', id);
  },

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const customer: Customer = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.add('customers', customer);
    return customer;
  },

  async update(id: string, data: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer> {
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
    await db.delete('customers', id);
  },
};