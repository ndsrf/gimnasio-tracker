import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Customer } from '../types';
import { customerService } from '../services/customers';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export function Customers() {
  const { dispatch } = useApp();
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const customerList = await customerService.getAll();
      const sortedCustomers = customerList.sort((a, b) => a.name.localeCompare(b.name));
      setCustomers(sortedCustomers);
      dispatch({ type: 'SET_CUSTOMERS', payload: sortedCustomers });
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const customer = await customerService.create(formData);
      setCustomers(prev => [...prev, customer].sort((a, b) => a.name.localeCompare(b.name)));
      dispatch({ type: 'ADD_CUSTOMER', payload: customer });
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
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
            onClick={() => selectCustomer(customer.id)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">{customer.name}</h3>
            {customer.email && (
              <p className="text-sm text-gray-600">{customer.email}</p>
            )}
            {customer.phone && (
              <p className="text-sm text-gray-600">{customer.phone}</p>
            )}
          </div>
        ))}

        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('noCustomers')}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('addCustomer')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onClick={() => setShowForm(false)}
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

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
      >
        +
      </button>
    </Layout>
  );
}