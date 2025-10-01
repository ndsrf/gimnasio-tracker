import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Customer } from '../types';
import { customerService } from '../services/customers';
import { useApp } from '../context/useApp';
import { useTranslation } from '../i18n/useTranslation';

export function Customers() {
  const { dispatch } = useApp();
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});

  const loadCustomers = useCallback(async () => {
    try {
      const customerList = await customerService.getAll();
      setCustomers(customerList);
      dispatch({ type: 'SET_CUSTOMERS', payload: customerList });
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const customer = await customerService.create(formData);
      const customerList = await customerService.getAll();
      setCustomers(customerList);
      dispatch({ type: 'ADD_CUSTOMER', payload: customer });
      setFormData({ name: '', email: '', phone: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      const updatedCustomer = await customerService.update(editingCustomer.id, editFormData);
      const customerList = await customerService.getAll();
      setCustomers(customerList);
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      setShowEditForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  }

  function openEditForm(customer: Customer) {
    setEditingCustomer(customer);
    setEditFormData(customer);
    setShowEditForm(true);
  }

  function selectCustomer(customerId: string) {
    dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: customerId });
    dispatch({ type: 'SET_TAB', payload: 'sessions' });
  }

  return (
    <Layout title={t('customers')}>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`p-4 rounded-lg shadow-sm border ${customer.deactivated ? 'bg-gray-200' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center">
              <div onClick={() => !customer.deactivated && selectCustomer(customer.id)} className={`cursor-pointer ${customer.deactivated ? 'cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                <h3 className={`font-medium ${customer.deactivated ? 'text-gray-500' : 'text-gray-900'}`}>{customer.name}</h3>
                {customer.email && (
                  <p className={`text-sm ${customer.deactivated ? 'text-gray-500' : 'text-gray-600'}`}>{customer.email}</p>
                )}
                {customer.phone && (
                  <p className={`text-sm ${customer.deactivated ? 'text-gray-500' : 'text-gray-600'}`}>{customer.phone}</p>
                )}
              </div>
              <button onClick={() => openEditForm(customer)} className="text-blue-600 hover:underline">
                {t('edit')}
              </button>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('noCustomers')}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('addCustomer')}</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('addCustomer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('editCustomer')}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="deactivated"
                  type="checkbox"
                  checked={editFormData.deactivated || false}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, deactivated: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="deactivated" className="ml-2 block text-sm text-gray-900">
                  {t('deactivated')}
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
      >
        +
      </button>
    </Layout>
  );
}
