import { Layout } from '../components/layout/Layout';
import { useTranslation } from '../i18n/useTranslation';

export function Settings() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <Layout title={t('settings')}>
      <div className="space-y-6">
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

        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('about')}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Gym Tracker</strong></p>
            <p>{t('version')} 1.0.0</p>
            <p>{t('appDescription')}</p>
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('data')}</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {t('dataDescription')}
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
              {t('clearAllData')}
            </button>
            <p className="text-xs text-gray-500">
              {t('clearDataWarning')}
            </p>
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
                <p>• Funciona sin conexión - no requiere internet</p>
                <p>• Diseño responsivo móvil</p>
              </>
            ) : (
              <>
                <p>• Manage customers and machines</p>
                <p>• Track workout sessions with sets, reps, and weight</p>
                <p>• Filter workouts by machine</p>
                <p>• Works offline - no internet required</p>
                <p>• Mobile-first responsive design</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}