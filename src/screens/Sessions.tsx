import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Customer, Machine, WorkoutWithDetails } from '../types';
import { customerService } from '../services/customers';
import { machineService } from '../services/machines';
import { workoutService } from '../services/workouts';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

export function Sessions() {
  const { state, dispatch } = useApp();
  const { t, translateMachineType } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutWithDetails | null>(null);
  const [workoutForm, setWorkoutForm] = useState({
    machineId: '',
    date: new Date().toISOString().split('T')[0],
    sets: '',
    reps: '',
    weight: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (state.selectedCustomerId) {
      setSelectedCustomerId(state.selectedCustomerId);
      loadWorkouts(state.selectedCustomerId);
    }
  }, [state.selectedCustomerId]);

  useEffect(() => {
    if (selectedCustomerId) {
      loadWorkouts(selectedCustomerId, selectedMachineId || undefined);
    }
  }, [selectedCustomerId, selectedMachineId]);

  async function loadData() {
    try {
      const [customerList, machineList] = await Promise.all([
        customerService.getAll(),
        machineService.getAll(),
      ]);
      setCustomers(customerList);
      setMachines(machineList);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function loadWorkouts(customerId: string, machineId?: string) {
    try {
      const workoutList = await workoutService.getByCustomer(customerId, machineId);
      setWorkouts(workoutList);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    }
  }

  async function handleWorkoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomerId) return;

    try {
      if (editingWorkout) {
        // Update existing workout
        await workoutService.update(editingWorkout.id, {
          machineId: workoutForm.machineId,
          date: new Date(workoutForm.date),
          sets: parseInt(workoutForm.sets),
          reps: parseInt(workoutForm.reps),
          weight: parseFloat(workoutForm.weight),
          notes: workoutForm.notes || undefined,
        });

        const updatedWorkout = await workoutService.getById(editingWorkout.id);
        if (updatedWorkout) {
          dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
        }
      } else {
        // Create new workout
        const workout = await workoutService.create({
          customerId: selectedCustomerId,
          machineId: workoutForm.machineId,
          date: new Date(workoutForm.date),
          sets: parseInt(workoutForm.sets),
          reps: parseInt(workoutForm.reps),
          weight: parseFloat(workoutForm.weight),
          notes: workoutForm.notes || undefined,
        });

        dispatch({ type: 'ADD_WORKOUT', payload: workout });
      }

      loadWorkouts(selectedCustomerId, selectedMachineId || undefined);
      resetForm();
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  }

  function resetForm() {
    setWorkoutForm({
      machineId: selectedMachineId || '',
      date: new Date().toISOString().split('T')[0],
      sets: '',
      reps: '',
      weight: '',
      notes: '',
    });
    setShowWorkoutForm(false);
    setEditingWorkout(null);
  }

  function openWorkoutForm() {
    resetForm();
    setWorkoutForm(prev => ({
      ...prev,
      machineId: selectedMachineId || '',
    }));
    setShowWorkoutForm(true);
  }

  function editWorkout(workout: WorkoutWithDetails) {
    setEditingWorkout(workout);
    setWorkoutForm({
      machineId: workout.machineId,
      date: new Date(workout.date).toISOString().split('T')[0],
      sets: workout.sets.toString(),
      reps: workout.reps.toString(),
      weight: workout.weight.toString(),
      notes: workout.notes || '',
    });
    setShowWorkoutForm(true);
  }

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <Layout title={t('trainingSessions')}>
      <div className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectCustomer')}
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('chooseCustomer')}</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCustomerId && (
          <>
            {/* Machine Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filterByMachine')}
              </label>
              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('allMachines')}</option>
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} ({translateMachineType(machine.type)})
                  </option>
                ))}
              </select>
            </div>

            {/* Workout History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('workoutHistory')} - {selectedCustomer?.name}
                </h2>
                <button
                  onClick={openWorkoutForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  {t('addWorkout')}
                </button>
              </div>

              {workouts.length > 0 ? (
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div
                      key={workout.id}
                      onClick={() => editWorkout(workout)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {workout.machineName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(workout.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {workout.sets} {t('setsReps').split(' × ')[0]} × {workout.reps} {t('setsReps').split(' × ')[1]}
                          </p>
                          <p className="text-sm text-gray-600">
                            {workout.weight} kg
                          </p>
                        </div>
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          {workout.notes}
                        </p>
                      )}
                      <p className="text-xs text-blue-600 mt-2">
                        {t('edit')} →
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('noWorkouts')}
                  {selectedMachineId && ` ${t('removeFilter')} `}
                  {t('addFirst')}
                </div>
              )}
            </div>
          </>
        )}

        {!selectedCustomerId && (
          <div className="text-center py-8 text-gray-500">
            {t('selectCustomerFirst')}
          </div>
        )}
      </div>

      {/* Add/Edit Workout Modal */}
      {showWorkoutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingWorkout ? t('editWorkout') : t('addWorkout')}
            </h2>
            <form onSubmit={handleWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('machine')} *
                </label>
                <select
                  required
                  value={workoutForm.machineId}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, machineId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('selectMachine')}</option>
                  {machines.map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name} ({translateMachineType(machine.type)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('date')} *
                </label>
                <input
                  type="date"
                  required
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sets')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={workoutForm.sets}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, sets: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reps')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={workoutForm.reps}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, reps: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('weight')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={workoutForm.weight}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notes')}
                </label>
                <textarea
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('workoutNotes')}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingWorkout ? t('updateWorkout') : t('addWorkout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}