import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Translations } from '../types/i18n';
import { zhTranslations, enTranslations } from '../i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh'); // Chinese as default
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };
  
  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage,
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};