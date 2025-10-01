import { createContext, useContext } from 'react';
import { translations } from './translations';
import type { Language, TranslationKey } from './translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  translateMachineType: (type: string) => string;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export function createTranslationFunction(language: Language) {
  return (key: TranslationKey): string => {
    const value = translations[language][key];
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    // Handle nested objects like machineTypes
    if (typeof value === 'object' && value !== null) {
      return String(value);
    }
    return key;
  };
}

export function createMachineTypeTranslation(language: Language) {
  return (type: string): string => {
    const machineTypes = translations[language].machineTypes as Record<string, string>;
    return machineTypes[type] || type;
  };
}