import { ReactNode } from 'react';

import { components } from '@/api';
import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import type { ComponentSettings } from '@/core/componentSettings';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import { MoniteAPIProvider } from '@/core/context/MoniteAPIProvider';
import { ThemeConfig } from '@/core/theme/types';

import { GlobalToast } from '../GlobalToast';
import { MoniteThemeProvider } from '../theme/MoniteThemeProvider';
import { MoniteLocale } from './i18nUtils';
import { KanmonContextProvider } from './KanmonContext';
import {
  MoniteContextProvider,
  MoniteQraftContext,
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
