export const translations = {
  es: {
    // Navigation
    customers: 'Clientes',
    machines: 'Máquinas',
    sessions: 'Sesiones',
    settings: 'Configuración',

    // Common
    add: 'Agregar',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    date: 'Fecha',
    notes: 'Notas',
    type: 'Tipo',
    loading: 'Cargando...',
    error: 'Error',

    // Customers
    addCustomer: 'Agregar Cliente',
    editCustomer: 'Editar Cliente',
    saveChanges: 'Guardar Cambios',
    deactivated: 'Desactivado',
    customerName: 'Nombre del Cliente',
    noCustomers: 'No hay clientes aún. ¡Agrega tu primer cliente!',
    customerAdded: 'Cliente agregado',

    // Machines
    addMachine: 'Agregar Máquina',
    editMachine: 'Editar Máquina',
    machineName: 'Nombre de la Máquina',
    machineNamePlaceholder: 'ej. Cinta de correr, Press de banca',
    selectType: 'Seleccionar tipo',
    noMachines: 'No hay máquinas aún. ¡Agrega tu primera máquina!',
    confirmDelete: 'Confirmar Eliminación',
    confirmDeleteMachineMessage: '¿Estás seguro de que quieres eliminar esta máquina? Esto también eliminará todos los entrenamientos asociados a ella.',
    machineTypes: {
      Cardio: 'Cardio',
      Strength: 'Fuerza',
      Functional: 'Funcional',
      'Free Weights': 'Pesas Libres'
    },

    // Sessions
    trainingSessions: 'Sesiones de Entrenamiento',
    selectCustomer: 'Seleccionar Cliente',
    chooseCustomer: 'Elegir un cliente',
    filterByMachine: 'Filtrar por Máquina (Opcional)',
    allMachines: 'Todas las máquinas',
    workoutHistory: 'Historial de Entrenamientos',
    addWorkout: 'Agregar Entrenamiento',
    editWorkout: 'Editar Entrenamiento',
    updateWorkout: 'Actualizar Entrenamiento',
    noWorkouts: 'No hay entrenamientos registrados aún.',
    removeFilter: 'Intenta quitar el filtro de máquina o ',
    addFirst: '¡Agrega el primer entrenamiento!',
    selectCustomerFirst: 'Selecciona un cliente para ver y gestionar sus entrenamientos',
    machine: 'Máquina',
    selectMachine: 'Seleccionar máquina',
    sets: 'Series',
    reps: 'Repeticiones',
    weight: 'Peso (kg)',
    workoutNotes: 'Notas sobre el entrenamiento...',
    setsReps: 'series × repeticiones',
    addSet: 'Añadir Serie',

    // Settings
    about: 'Acerca de',
    version: 'Versión',
    appDescription: 'Un rastreador de gimnasio profesional para entrenadores para gestionar clientes, máquinas y sesiones de entrenamiento.',
    data: 'Datos',
    dataDescription: 'Todos los datos se almacenan localmente en tu dispositivo usando IndexedDB. No se envían datos a servidores externos.',
    clearAllData: 'Borrar Todos los Datos',
    clearDataWarning: 'Advertencia: Esto eliminará permanentemente todos los datos de clientes, máquinas y entrenamientos.',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    exportDescription: 'Descargar todos los datos como archivo JSON de respaldo.',
    importDescription: 'Importar datos desde un archivo JSON de respaldo.',
    exportButton: 'Exportar a JSON',
    importButton: 'Seleccionar Archivo JSON',
    importSuccess: 'Datos importados exitosamente',
    importError: 'Error al importar datos',
    exportSuccess: 'Datos exportados exitosamente',
    exportError: 'Error al exportar datos',
    confirmClearData: '¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.',
    confirm: 'Confirmar',
    dataBackup: 'Respaldo de Datos',
    features: 'Características',
    featuresList: [
      '• Gestionar clientes y máquinas',
      '• Rastrear sesiones de entrenamiento con series, repeticiones y peso',
      '• Filtrar entrenamientos por máquina',
      '• Funciona sin conexión - no requiere internet',
      '• Diseño responsivo móvil'
    ],
    language: 'Idioma',

    // Loading and Error states
    loadingGymTracker: 'Cargando Gym Tracker...',
    failedToInitialize: 'Error al inicializar la base de datos',

    // New Features Popup
    newFeaturesTitle: '¡Nuevas Características en la Versión 1.1.0!',
    newFeaturesDescription: 'Hemos añadido algunas mejoras emocionantes para ti:',
    featureEditDeactivateUsers: 'Ahora puedes editar y desactivar clientes existentes.',
    featureMultipleSeriesReps: 'Registra múltiples series y repeticiones para cada entrenamiento.',
    gotIt: '¡Entendido!',

    // Form validation
    required: 'requerido',

    // Date formatting
    createdAt: 'Creado el'
  },

  en: {
    // Navigation
    customers: 'Customers',
    machines: 'Machines',
    sessions: 'Sessions',
    settings: 'Settings',

    // Common
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    date: 'Date',
    notes: 'Notes',
    type: 'Type',
    loading: 'Loading...',
    error: 'Error',

    // Customers
    addCustomer: 'Add Customer',
    editCustomer: 'Edit Customer',
    saveChanges: 'Save Changes',
    deactivated: 'Deactivated',
    customerName: 'Customer Name',
    noCustomers: 'No customers yet. Add your first customer!',
    customerAdded: 'Customer added',

    // Machines
    addMachine: 'Add Machine',
    editMachine: 'Edit Machine',
    machineName: 'Machine Name',
    machineNamePlaceholder: 'e.g. Treadmill, Bench Press',
    selectType: 'Select type',
    noMachines: 'No machines yet. Add your first machine!',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMachineMessage: 'Are you sure you want to delete this machine? This will also delete all workouts associated with it.',
    machineTypes: {
      Cardio: 'Cardio',
      Strength: 'Strength',
      Functional: 'Functional',
      'Free Weights': 'Free Weights'
    },

    // Sessions
    trainingSessions: 'Training Sessions',
    selectCustomer: 'Select Customer',
    chooseCustomer: 'Choose a customer',
    filterByMachine: 'Filter by Machine (Optional)',
    allMachines: 'All machines',
    workoutHistory: 'Workout History',
    addWorkout: 'Add Workout',
    editWorkout: 'Edit Workout',
    updateWorkout: 'Update Workout',
    noWorkouts: 'No workouts recorded yet.',
    removeFilter: 'Try removing the machine filter or ',
    addFirst: 'Add the first workout!',
    selectCustomerFirst: 'Select a customer to view and manage their workouts',
    machine: 'Machine',
    selectMachine: 'Select machine',
    sets: 'Sets',
    reps: 'Reps',
    weight: 'Weight (kg)',
    workoutNotes: 'Any notes about the workout...',
    setsReps: 'sets × reps',
    addSet: 'Add Set',

    // Settings
    about: 'About',
    version: 'Version',
    appDescription: 'A professional gym tracker for trainers to manage customers, machines, and workout sessions.',
    data: 'Data',
    dataDescription: 'All data is stored locally on your device using IndexedDB. No data is sent to external servers.',
    clearAllData: 'Clear All Data',
    clearDataWarning: 'Warning: This will permanently delete all customers, machines, and workout data.',
    exportData: 'Export Data',
    importData: 'Import Data',
    exportDescription: 'Download all data as a backup JSON file.',
    importDescription: 'Import data from a backup JSON file.',
    exportButton: 'Export to JSON',
    importButton: 'Select JSON File',
    importSuccess: 'Data imported successfully',
    importError: 'Error importing data',
    exportSuccess: 'Data exported successfully',
    exportError: 'Error exporting data',
    confirmClearData: 'Are you sure you want to clear all data? This action cannot be undone.',
    confirm: 'Confirm',
    dataBackup: 'Data Backup',
    features: 'Features',
    featuresList: [
      '• Manage customers and',
      '• Track workout sessions with sets, reps, and weight',
      '• Filter workouts by machine',
      '• Works offline - no internet required',
      '• Mobile-first responsive design'
    ],
    language: 'Language',

    // Loading and Error states
    loadingGymTracker: 'Loading Gym Tracker...',
    failedToInitialize: 'Failed to initialize database',

    // New Features Popup
    newFeaturesTitle: 'New Features in Version 1.1.0!',
    newFeaturesDescription: 'We\'ve added some exciting improvements for you:',
    featureEditDeactivateUsers: 'You can now edit and deactivate existing customers.',
    featureMultipleSeriesReps: 'Record multiple series and repetitions for each workout.',
    gotIt: 'Got It!',

    // Form validation
    required: 'required',

    // Date formatting
    createdAt: 'Created on'
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;