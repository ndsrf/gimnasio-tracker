import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import type { Customer, Machine, WorkoutWithDetails, WorkoutSeries } from '../types';
import { customerService } from '../services/customers';
import { machineService } from '../services/machines';
import { workoutService } from '../services/workouts';
import { useApp } from '../context/useApp';
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
    series: [{ sets: '', reps: '', weight: '' }],
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
        customerService.getActive(),
        machineService.getAll(),
      ]);
      const sortedCustomers = customerList.sort((a, b) => a.name.localeCompare(b.name));
      setCustomers(sortedCustomers);
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

    const workoutData = {
      machineId: workoutForm.machineId,
      date: new Date(workoutForm.date),
      series: workoutForm.series.map(s => ({
        sets: parseInt(s.sets, 10) || 0,
        reps: parseInt(s.reps, 10) || 0,
        weight: parseFloat(s.weight) || 0,
      })).filter(s => s.sets > 0 && s.reps > 0),
      notes: workoutForm.notes || undefined,
    };

    if (workoutData.series.length === 0) {
      // TODO: Show an error to the user
      console.error("Cannot save a workout with no series data.");
      return;
    }

    try {
      if (editingWorkout) {
        await workoutService.update(editingWorkout.id, workoutData);
        const updatedWorkout = await workoutService.getById(editingWorkout.id);
        if (updatedWorkout) {
          dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
        }
      } else {
        const workout = await workoutService.create({
          customerId: selectedCustomerId,
          ...workoutData,
          series: workoutData.series as WorkoutSeries[],
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
      series: [{ sets: '', reps: '', weight: '' }],
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
      series: [{ sets: '', reps: '', weight: '' }],
    }));
    setShowWorkoutForm(true);
  }

  function editWorkout(workout: WorkoutWithDetails) {
    setEditingWorkout(workout);
    setWorkoutForm({
      machineId: workout.machineId,
      date: new Date(workout.date).toISOString().split('T')[0],
      series: workout.series && workout.series.length > 0 ? workout.series.map(s => ({
        sets: s.sets.toString(),
        reps: s.reps.toString(),
        weight: s.weight.toString(),
      })) : [{ sets: '', reps: '', weight: '' }],
      notes: workout.notes || '',
    });
    setShowWorkoutForm(true);
  }

  function handleSeriesChange(index: number, field: 'sets' | 'reps' | 'weight', value: string) {
    const newSeries = [...workoutForm.series];
    newSeries[index][field] = value;
    setWorkoutForm(prev => ({ ...prev, series: newSeries }));
  }

  function addSeriesRow() {
    setWorkoutForm(prev => ({
      ...prev,
      series: [...prev.series, { sets: '', reps: '', weight: '' }],
    }));
  }

  function removeSeriesRow(index: number) {
    const newSeries = [...workoutForm.series];
    newSeries.splice(index, 1);
    setWorkoutForm(prev => ({ ...prev, series: newSeries }));
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
            onChange={(e) => dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: e.target.value })}
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
                {machines
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(machine => (
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
                        <div className="text-right text-sm">
                          {workout.series?.map((s, i) => (
                            <div key={i}>{s.sets} {t('setsReps').split(' × ')[0]} × {s.reps} {t('setsReps').split(' × ')[1]} @ {s.weight} kg</div>
                          ))}
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
                  {selectedMachineId && ` ${t('removeFilter')}`} {' '}
                  <button onClick={openWorkoutForm} className='text-blue-500 hover:underline'>{t('addFirst')}</button>
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
                  {machines
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(machine => (
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

              {/* Series Inputs */}
              <div className='space-y-3'>
                {workoutForm.series.map((s, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className='col-span-3'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('sets')}</label>
                      <input
                        type="number" required min="1" value={s.sets}
                        onChange={(e) => handleSeriesChange(index, 'sets', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div className='col-span-3'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('reps')}</label>
                      <input
                        type="number" required min="1" value={s.reps}
                        onChange={(e) => handleSeriesChange(index, 'reps', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div className='col-span-4'>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('weight')} (kg)</label>
                      <input
                        type="number" required min="0" step="0.5" value={s.weight}
                        onChange={(e) => handleSeriesChange(index, 'weight', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div className='col-span-2 flex items-end h-full'>
                      <button
                        type="button"
                        onClick={() => removeSeriesRow(index)}
                        disabled={workoutForm.series.length <= 1}
                        className="w-full text-red-500 disabled:text-gray-300 text-center font-bold text-xl"
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSeriesRow}
                  className="w-full text-sm py-1 text-blue-600 border-2 border-dashed border-blue-300 rounded-md hover:bg-blue-50"
                >
                  + {t('addSet')}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('notes')}
                </label>
                <textarea
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
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
