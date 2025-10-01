import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext.tsx';
import { useApp } from './context/useApp';
import { TranslationProvider } from './i18n/TranslationProvider';
import { useTranslation } from './i18n/useTranslation';
import { Customers } from './screens/Customers';
import { Machines } from './screens/Machines';
import { Sessions } from './screens/Sessions';
import { Settings } from './screens/Settings';
import { NewFeaturesPopup } from './components/NewFeaturesPopup';

const APP_VERSION = '1.1.0';
const LOCAL_STORAGE_KEY = `gym-tracker-features-popup-shown-${APP_VERSION}`;

function AppContent() {
  const { state } = useApp();
  const { t } = useTranslation();
  const [showNewFeaturesPopup, setShowNewFeaturesPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasSeenPopup) {
      setShowNewFeaturesPopup(true);
    }
  }, []);

  const handleCloseNewFeaturesPopup = () => {
    setShowNewFeaturesPopup(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

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

  return (
    <>
      {showNewFeaturesPopup && <NewFeaturesPopup onClose={handleCloseNewFeaturesPopup} />}
      {(() => {
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
      })()}
    </>
  );
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
