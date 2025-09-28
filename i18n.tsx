import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations } from './translations';

type Language = 'en' | 'hi';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey | string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey | string, vars?: Record<string, string | number>): string => {
    let text = (translations[language] as any)[key] || (translations.en as any)[key] || key;
    
    if (vars) {
      Object.keys(vars).forEach(varKey => {
        const regex = new RegExp(`{{${varKey}}}`, 'g');
        text = text.replace(regex, String(vars[varKey]));
      });
    }
    
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
