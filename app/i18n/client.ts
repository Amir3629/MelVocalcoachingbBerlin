'use client';

import { useEffect, useState } from 'react';

// Simple i18n implementation for client components
type Translations = {
  [key: string]: {
    [key: string]: string | { [key: string]: string };
  };
};

// Basic translations
const translations: Translations = {
  en: {
    features: {
      title: 'Why Choose Us',
      subtitle: 'Expert Vocal Coaching in Berlin',
      feature1Title: 'Professional Training',
      feature1Desc: 'Personalized vocal coaching from experienced professionals',
      feature2Title: 'Modern Techniques',
      feature2Desc: 'Learn the latest vocal techniques and styles',
      feature3Title: 'Performance Ready',
      feature3Desc: 'Prepare for performances, recordings, and auditions',
      feature4Title: 'Scientific Approach',
      feature4Desc: 'Voice training based on vocal science and pedagogy',
    },
    // Add more translation keys as needed
  },
  de: {
    features: {
      title: 'Warum Uns Wählen',
      subtitle: 'Experten Stimmtraining in Berlin',
      feature1Title: 'Professionelles Training',
      feature1Desc: 'Personalisiertes Stimmtraining von erfahrenen Profis',
      feature2Title: 'Moderne Techniken',
      feature2Desc: 'Lerne die neuesten Gesangstechniken und Stile',
      feature3Title: 'Auftrittsbereit',
      feature3Desc: 'Vorbereitung für Auftritte, Aufnahmen und Vorsingen',
      feature4Title: 'Wissenschaftlicher Ansatz',
      feature4Desc: 'Stimmtraining basierend auf Stimmwissenschaft und Pädagogik',
    },
    // Add more translation keys as needed
  },
};

// Create i18n hook
export function useTranslation() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Try to get the language from localStorage or browser settings
    const savedLocale = localStorage.getItem('locale') || navigator.language.substring(0, 2);
    // Only use supported languages
    if (savedLocale in translations) {
      setLocale(savedLocale);
    }
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = translations[locale];
    
    for (const k of keys) {
      if (!result[k]) {
        // Fallback to English if translation is missing
        result = translations['en'];
        for (const fallbackK of keys) {
          if (!result[fallbackK]) {
            return key; // Return the key if even the fallback is missing
          }
          result = result[fallbackK];
        }
        return result;
      }
      result = result[k];
    }
    
    return result;
  };

  const changeLanguage = (newLocale: string) => {
    if (newLocale in translations) {
      localStorage.setItem('locale', newLocale);
      setLocale(newLocale);
    }
  };

  return {
    t,
    locale,
    changeLanguage,
  };
} 