import React, { ReactNode, useMemo } from 'react';

import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import {
  I18nLocaleProvider,
  MoniteLocale,
} from '@/core/context/I18nLocaleProvider';
import { MoniteScopedProvider } from '@/core/context/MoniteScopedProvider';
import {
  createThemeWithDefaults,
  MoniteThemeContext,
} from '@/core/context/MoniteThemeProvider';
import { MoniteSDK } from '@monite/sdk-api';
import { Theme, ThemeOptions } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { GlobalToast } from '../GlobalToast';
import { MoniteContextProvider } from './MoniteContext';

export interface MoniteProviderProps {
  children?: ReactNode;

  /**
   * `theme` responsible for global styling of all Widgets provided.
   * If `theme` is not provided, `Monite` uses default theme.
   *
   * `Monite` uses `Material UI` for styling. If you want to know
   *  more how to customize theme, please visit:
   * @see {@link https://mui.com/customization/default-theme/ Default theme}
   */
  theme?: ThemeOptions | Theme;

  /** An instance of `MoniteSDK` */
  monite: MoniteSDK;

  /**
   * `locale` responsible for internationalisation
   *  of all Widgets provided.
   *
   * `locale.code` is used for global Widgets translation. (e.g. `en`)
   * `locale.messages` is used for translation for some of the Widgets.
   */
  locale?: Partial<MoniteLocale>;
}

export interface IMoniteGeneralProviderProps {
  children: MoniteProviderProps['children'];
}

/**
 * Provides Monite theme and global styles
 * Fetches theme from global `MoniteProvider` and apply it to the Material `ThemeProvider`
 */
export const MoniteStyleProvider = ({
  children,
}: Pick<MoniteProviderProps, 'children'>) => {
  return <MoniteScopedProvider>{children}</MoniteScopedProvider>;
};

export const MoniteProvider = ({
  monite,
  theme,
  children,
  locale,
}: MoniteProviderProps) => {
  const userLocale =
    locale?.code ??
    (typeof navigator === 'undefined' ? 'en' : navigator.language);

  const muiTheme = useMemo(() => createThemeWithDefaults(theme), [theme]);

  return (
    <I18nLocaleProvider
      locale={{
        code: userLocale,
        messages: locale?.messages,
      }}
    >
      <MoniteThemeContext.Provider value={muiTheme}>
        <MoniteContextProvider monite={monite} code={userLocale}>
          <EmotionCacheProvider cacheKey="monite-css-baseline">
            <MuiThemeProvider theme={muiTheme}>
              <ContainerCssBaseline enableColorScheme />
              <GlobalToast />
            </MuiThemeProvider>
          </EmotionCacheProvider>
          {children}
        </MoniteContextProvider>
      </MoniteThemeContext.Provider>
    </I18nLocaleProvider>
  );
};
