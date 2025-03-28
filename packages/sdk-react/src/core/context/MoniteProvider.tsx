import { ReactNode } from 'react';

import { components } from '@/api';
import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import type { ComponentSettings } from '@/core/componentSettings';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import {
  MoniteAPIProvider,
  MoniteQraftContext,
} from '@/core/context/MoniteAPIProvider';
import { MoniteLocale } from '@/core/context/MoniteI18nProvider';
import { ThemeConfig } from '@/core/theme/types';
import { Global, css } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { Theme } from 'mui-styles';

import { GlobalToast } from '../GlobalToast';
import { MoniteContextProvider, useMoniteContext } from './MoniteContext';

export interface MoniteSettings {
  entityId: string;
  apiUrl?: string;
  fetchToken: () => Promise<components['schemas']['AccessTokenResponse']>;
}

export interface MoniteProviderProps {
  children?: ReactNode;

  /**
   * `theme` responsible for global styling of all Widgets provided.
   * If `theme` is not provided, `Monite` uses default theme.
   */
  theme?: ThemeConfig;

  /** Monite initial settings  */
  monite: MoniteSettings;

  /**
   * `locale` responsible for internationalisation
   *  of all Widgets provided.
   */
  locale?: MoniteLocale;

  /**
   * Component settings
   */
  componentSettings?: Partial<ComponentSettings>;
}

export const MoniteProvider = ({
  monite,
  theme,
  componentSettings,
  children,
  locale,
}: MoniteProviderProps) => {
  return (
    <MoniteContextProvider
      monite={monite}
      locale={locale}
      theme={theme}
      componentSettings={componentSettings}
    >
      <EmotionCacheProvider cacheKey="monite-css-baseline">
        <MoniteThemeProvider>
          <ContainerCssBaseline enableColorScheme />
          <GlobalToast />
        </MoniteThemeProvider>
      </EmotionCacheProvider>
      <MoniteAPIProvider APIContext={MoniteQraftContext}>
        {children}
      </MoniteAPIProvider>
    </MoniteContextProvider>
  );
};

const getTailwindTheme = (theme: Theme) => css`
  :root {
    --monite-color-primary: ${theme.palette.primary.main};
    --monite-color-secondary: ${theme.palette.secondary.main};
  }
`;

const MoniteThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useMoniteContext();
  console.log(theme);
  return (
    <>
      <Global styles={getTailwindTheme(theme)} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </>
  );
};
