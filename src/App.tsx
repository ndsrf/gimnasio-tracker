import { AppProvider, useApp } from './context/AppContext';
import { TranslationProvider } from './i18n/TranslationProvider';
import { useTranslation } from './i18n/useTranslation';
import { Customers } from './screens/Customers';
import { Machines } from './screens/Machines';
import { Sessions } from './screens/Sessions';
import { Settings } from './screens/Settings';

function AppContent() {
  const { state } = useApp();
  const { t } = useTranslation();

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingGymTracker')}</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('error')}</h1>
          <p className="text-gray-600">{state.error}</p>
        </div>
      </div>
    );
  }

  switch (state.currentTab) {
    case 'customers':
      return <Customers />;
    case 'machines':
      return <Machines />;
    case 'sessions':
      return <Sessions />;
    case 'settings':
      return <Settings />;
    default:
      return <Customers />;
  }
}

function App() {
  return (
    <TranslationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TranslationProvider>
  );
}

export default App;
