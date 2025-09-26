import { useState, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTranslation } from '../i18n/useTranslation';
import { dataExportService } from '../services/dataExport';

export function Settings() {
  const { t, language, setLanguage } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await dataExportService.exportAndDownload();
      setMessage({ type: 'success', text: t('exportSuccess') });
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({ type: 'error', text: t('exportError') });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    handleImport(file);
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true);
      const result = await dataExportService.importFromFile(file);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload the page to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Import failed:', error);
      setMessage({ type: 'error', text: t('importError') });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      await dataExportService.clearAllData();
      setMessage({ type: 'success', text: 'All data cleared successfully' });
      setShowClearConfirm(false);
      // Reload the page to refresh all data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Clear data failed:', error);
      setMessage({ type: 'error', text: 'Failed to clear data' });
    }
  };

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  // Clear message after 5 seconds
  if (message) {
    clearMessage();
  }

  return (
    <Layout title={t('settings')}>
      <div className="space-y-6">
        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Language Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('language')}</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="language"
                value="es"
                checked={language === 'es'}
                onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                className="mr-3"
              />
              <span>Español</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                className="mr-3"
              />
              <span>English</span>
            </label>
          </div>
        </div>

        {/* Data Backup Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dataBackup')}</h2>

          {/* Export Data */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">{t('exportData')}</h3>
            <p className="text-sm text-gray-600 mb-3">{t('exportDescription')}</p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </>
              ) : (
                <>
                  📥 {t('exportButton')}
                </>
              )}
            </button>
          </div>

          {/* Import Data */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">{t('importData')}</h3>
            <p className="text-sm text-gray-600 mb-3">{t('importDescription')}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer inline-flex items-center ${
                isImporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </>
              ) : (
                <>
                  📤 {t('importButton')}
                </>
              )}
            </label>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('data')}</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {t('dataDescription')}
            </p>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              {t('clearAllData')}
            </button>
            <p className="text-xs text-gray-500">
              {t('clearDataWarning')}
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('about')}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Gym Tracker</strong></p>
            <p>{t('version')} 1.0.0</p>
            <p>{t('appDescription')}</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('features')}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {language === 'es' ? (
              <>
                <p>• Gestionar clientes y máquinas</p>
                <p>• Rastrear sesiones de entrenamiento con series, repeticiones y peso</p>
                <p>• Filtrar entrenamientos por máquina</p>
                <p>• Hacer clic para editar entrenamientos</p>
                <p>• Exportar e importar datos de respaldo</p>
                <p>• Funciona sin conexión - no requiere internet</p>
                <p>• Diseño responsivo móvil</p>
              </>
            ) : (
              <>
                <p>• Manage customers and machines</p>
                <p>• Track workout sessions with sets, reps, and weight</p>
                <p>• Filter workouts by machine</p>
                <p>• Click to edit workouts</p>
                <p>• Export and import backup data</p>
                <p>• Works offline - no internet required</p>
                <p>• Mobile-first responsive design</p>
              </>
            )}
          </div>
        </div>

        {/* GitHub Repository Link */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <a
              href="https://github.com/ndsrf/gimnasio-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              {language === 'es' ? 'Ver código fuente en GitHub' : 'View source code on GitHub'}
            </a>
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              {t('clearAllData')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('confirmClearData')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}