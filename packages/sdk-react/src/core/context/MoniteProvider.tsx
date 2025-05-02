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

import { GlobalToast } from '../GlobalToast';
// @ts-expect-error - This is a global css file
import tailwindApp from '../theme/app.css';
import { KanmonContextProvider } from './KanmonContext';
import {
  MoniteContextProvider,
  MoniteTheme,
  useMoniteContext,
} from './MoniteContext';

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
        <KanmonContextProvider>{children}</KanmonContextProvider>
      </MoniteAPIProvider>
    </MoniteContextProvider>
  );
};

const getTailwindTheme = (theme: MoniteTheme) => css`
  :root {
    --mtw-color-primary-10: ${theme.palette.primary[10]};
    --mtw-color-primary-20: ${theme.palette.primary[20]};
    --mtw-color-primary-30: ${theme.palette.primary[30]};
    --mtw-color-primary-40: ${theme.palette.primary[40]};
    --mtw-color-primary-50: ${theme.palette.primary[50]};
    --mtw-color-primary-55: ${theme.palette.primary[55]};
    --mtw-color-primary-60: ${theme.palette.primary[60]};
    --mtw-color-primary-80: ${theme.palette.primary[80]};
    --mtw-color-primary-85: ${theme.palette.primary[85]};
    --mtw-color-primary-90: ${theme.palette.primary[90]};
    --mtw-color-primary-95: ${theme.palette.primary[95]};

    --mtw-color-neutral-10: ${theme.palette.neutral[10]};
    --mtw-color-neutral-30: ${theme.palette.neutral[30]};
    --mtw-color-neutral-50: ${theme.palette.neutral[50]};
    --mtw-color-neutral-70: ${theme.palette.neutral[70]};
    --mtw-color-neutral-80: ${theme.palette.neutral[80]};
    --mtw-color-neutral-90: ${theme.palette.neutral[90]};
    --mtw-color-neutral-95: ${theme.palette.neutral[95]};

    --mtw-color-danger-10: ${theme.palette.error[10]};
    --mtw-color-danger-30: ${theme.palette.error[30]};
    --mtw-color-danger-40: ${theme.palette.error[40]};
    --mtw-color-danger-50: ${theme.palette.error[50]};
    --mtw-color-danger-60: ${theme.palette.error[60]};
    --mtw-color-danger-80: ${theme.palette.error[80]};
    --mtw-color-danger-90: ${theme.palette.error[90]};
    --mtw-color-danger-95: ${theme.palette.error[95]};

    --mtw-color-success-10: ${theme.palette.success[10]};
    --mtw-color-success-30: ${theme.palette.success[30]};
    --mtw-color-success-50: ${theme.palette.success[50]};
    --mtw-color-success-60: ${theme.palette.success[60]};
    --mtw-color-success-80: ${theme.palette.success[80]};
    --mtw-color-success-90: ${theme.palette.success[90]};
    --mtw-color-success-95: ${theme.palette.success[95]};

    --mtw-color-warning-10: ${theme.palette.warning[10]};
    --mtw-color-warning-30: ${theme.palette.warning[30]};
    --mtw-color-warning-50: ${theme.palette.warning[50]};
    --mtw-color-warning-60: ${theme.palette.warning[60]};
    --mtw-color-warning-80: ${theme.palette.warning[80]};
    --mtw-color-warning-90: ${theme.palette.warning[90]};
    --mtw-color-warning-95: ${theme.palette.warning[95]};

    --mtw-table-background-color: ${theme.palette.primary[65]};
  }

  ${tailwindApp}
`;

const MoniteThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useMoniteContext();

  return (
    <>
      <Global styles={getTailwindTheme(theme)} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </>
  );
};
