import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Machine } from '../types';
import { machineService } from '../services/machines';
import { useApp } from '../context/useApp';
import { useTranslation } from '../i18n/useTranslation';

export function Machines() {
  const { dispatch } = useApp();
  const { t, translateMachineType } = useTranslation();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [machineToDeleteId, setMachineToDeleteId] = useState<string | null>(null);

  const loadMachines = useCallback(async () => {
    try {
      const machineList = await machineService.getAll();
      setMachines(machineList);
      dispatch({ type: 'SET_MACHINES', payload: machineList });
    } catch (error) {
      console.error('Failed to load machines:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadMachines();
  }, [loadMachines]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingMachine) {
        const updatedMachine = await machineService.update(editingMachine.id, { name: formData.name, type: formData.type });
        setMachines(prev => prev.map(m => (m.id === updatedMachine.id ? updatedMachine : m)));
        dispatch({ type: 'UPDATE_MACHINE', payload: updatedMachine });
      } else {
        const newMachine = await machineService.create({ name: formData.name, type: formData.type });
        setMachines(prev => [...prev, newMachine]);
        dispatch({ type: 'ADD_MACHINE', payload: newMachine });
      }
      setFormData({ id: '', name: '', type: '' });
      setEditingMachine(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save machine:', error);
    }
  }

  const handleEditClick = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData({ id: machine.id, name: machine.name, type: machine.type });
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setMachineToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (machineToDeleteId) {
      try {
        await machineService.delete(machineToDeleteId);
        setMachines(prev => prev.filter(m => m.id !== machineToDeleteId));
        dispatch({ type: 'DELETE_MACHINE', payload: machineToDeleteId });
        setMachineToDeleteId(null);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Failed to delete machine:', error);
      }
    }
  };

  const cancelDelete = () => {
    setMachineToDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const machineTypes = ['Cardio', 'Strength', 'Functional', 'Free Weights'];

  return (
    <Layout title={t('machines')}>
      <div className="space-y-4">
        {machines
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((machine) => (
          <div
            key={machine.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{machine.name}</h3>
                <p className="text-sm text-gray-600">{translateMachineType(machine.type)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(machine)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDeleteClick(machine.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('delete')}
                </button>
              </div>
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
            <h2 className="text-lg font-semibold mb-4">{editingMachine ? t('editMachine') : t('addMachine')}</h2>
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
                    <option key={type} value={type}>{translateMachineType(type)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMachine(null);
                    setFormData({ id: '', name: '', type: '' });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingMachine ? t('saveChanges') : t('addMachine')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('confirmDelete')}</h2>
            <p>{t('confirmDeleteMachineMessage')}</p>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setShowForm(true);
          setEditingMachine(null);
          setFormData({ id: '', name: '', type: '' });
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
      >
        +
      </button>
    </Layout>
  );
}