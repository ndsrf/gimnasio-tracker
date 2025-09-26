import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Machine } from '../types';
import { machineService } from '../services/machines';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export function Machines() {
  const { dispatch } = useApp();
  const { t } = useTranslation();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '' });

  useEffect(() => {
    loadMachines();
  }, []);

  async function loadMachines() {
    try {
      const machineList = await machineService.getAll();
      setMachines(machineList);
      dispatch({ type: 'SET_MACHINES', payload: machineList });
    } catch (error) {
      console.error('Failed to load machines:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const machine = await machineService.create(formData);
      setMachines(prev => [...prev, machine]);
      dispatch({ type: 'ADD_MACHINE', payload: machine });
      setFormData({ name: '', type: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  }

  const machineTypes = ['Cardio', 'Strength', 'Functional', 'Free Weights'];

  return (
    <Layout title={t('machines')}>
      <div className="space-y-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{machine.name}</h3>
                <p className="text-sm text-gray-600">{machine.type}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(machine.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

        {machines.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('noMachines')}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('addMachine')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('machineName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('machineNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('type')} *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('selectType')}</option>
                  {machineTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
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
                  {t('addMachine')}
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