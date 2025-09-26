import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { TranslationContext, createTranslationFunction, createMachineTypeTranslation } from './useTranslation';
import type { Language } from './translations';

interface TranslationProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = 'gym-tracker-language';

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('es'); // Spanish as default

  useEffect(() => {
    // Load saved language preference or default to Spanish
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = createTranslationFunction(language);
  const translateMachineType = createMachineTypeTranslation(language);

  return (
    <TranslationContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      translateMachineType
    }}>
      {children}
    </TranslationContext.Provider>
  );
}