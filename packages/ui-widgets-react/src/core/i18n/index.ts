import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import de from './de.json';

const i18n = createInstance({
  resources: {
    en,
    de,
  },
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

i18n.use(initReactI18next).init();

export default i18n;
