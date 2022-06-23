import React from 'react';
import { MoniteApp } from '@monite/js-sdk';
import { THEMES, ThemeProvider as UIThemeProvider } from '@monite/ui';
import ConfigProvider from 'antd/es/config-provider';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';

import { ComponentsContext } from './ComponentsContext';

import '../../index.less';

interface MoniteProviderProps {
  monite: MoniteApp;
  children?: any;
  theme?: any;
}

const MoniteProvider = ({ monite, theme, children }: MoniteProviderProps) => {
  const finalTheme = theme || THEMES.default;

  return (
    <ComponentsContext.Provider
      value={{
        monite,
      }}
    >
      <EmotionThemeProvider theme={finalTheme}>
        <UIThemeProvider theme={finalTheme}>
          <ConfigProvider prefixCls="monite">{children}</ConfigProvider>
        </UIThemeProvider>
      </EmotionThemeProvider>
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
