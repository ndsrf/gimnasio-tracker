
import { useTranslation } from '../i18n/useTranslation';

interface NewFeaturesPopupProps {
  onClose: () => void;
}

export function NewFeaturesPopup({ onClose }: NewFeaturesPopupProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('newFeaturesTitle')}</h2>
        <p className="text-gray-700 mb-4">{t('newFeaturesDescription')}</p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>{t('featureEditDeactivateUsers')}</li>
          <li>{t('featureMultipleSeriesReps')}</li>
        </ul>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('gotIt')}
        </button>
      </div>
    </div>
  );
}
