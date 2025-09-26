import type { NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';

const tabIcons: Record<NavigationTab, string> = {
  customers: '👥',
  machines: '🏋️',
  sessions: '📊',
  settings: '⚙️',
};

export function BottomNavigation() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const tabs: NavigationTab[] = ['customers', 'machines', 'sessions', 'settings'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tabId) => (
          <button
            key={tabId}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tabId })}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              state.currentTab === tabId
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="text-xl mb-1">{tabIcons[tabId]}</span>
            <span className="text-xs font-medium">{t(tabId)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}