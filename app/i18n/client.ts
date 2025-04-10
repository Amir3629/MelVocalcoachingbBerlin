'use client';

import i18n from 'i18next';
import { useTranslation as useTranslationOrg } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly
import translationEN from '../../public/locales/en/common.json';
import translationDE from '../../public/locales/de/common.json';

const resources = {
  en: {
    common: translationEN
  },
  de: {
    common: translationDE
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'de',
      defaultNS: 'common',
      ns: ['common'],
      
      interpolation: {
        escapeValue: false,
      },
      
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'preferredLanguage',
        caches: ['localStorage'],
      },
      
      react: {
        useSuspense: false,
      },
    });
}

export function useTranslation() {
  return useTranslationOrg('common');
}

// Helper functions for language switching
export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => {
  return i18n.language || 'de';
}; 