import React, { useEffect } from 'react';
import { MoniteApp } from '@monite/js-sdk';
import { THEMES, ThemeProvider as UIThemeProvider } from '@monite/ui';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { I18nextProvider } from 'react-i18next';

import i18n from '../i18n';
import { ComponentsContext } from './ComponentsContext';

import '../../index.less';

interface MoniteProviderProps {
  monite: MoniteApp;
  children?: any;
  theme?: any;
}

const MoniteProvider = ({ monite, theme, children }: MoniteProviderProps) => {
  const finalTheme = theme || THEMES.default;

  useEffect(() => {
    i18n.changeLanguage(monite.locale);
  }, [monite.locale, i18n.changeLanguage]);

  return (
    <ComponentsContext.Provider
      value={{
        monite,
      }}
    >
      <EmotionThemeProvider theme={finalTheme}>
        <UIThemeProvider theme={finalTheme}>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </UIThemeProvider>
      </EmotionThemeProvider>
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
