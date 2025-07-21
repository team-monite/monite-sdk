import { GlobalToast } from '../GlobalToast';
import { MoniteThemeProvider } from '../theme/MoniteThemeProvider';
import { KanmonContextProvider } from './KanmonContext';
import { MoniteContextProvider } from './MoniteContext';
import { components } from '@/api';
import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import type { ComponentSettings } from '@/core/componentSettings';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import { MoniteAPIProvider } from '@/core/context/MoniteAPIProvider';
import { MoniteLocale } from '@/core/context/MoniteI18nProvider';
import { MoniteQraftContext } from '@/core/context/MoniteQraftContext';
import { ThemeConfig } from '@/core/theme/types';
import { ReactNode } from 'react';

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

  /**
   * Callback function that is called when the theme is mounted
   */
  onThemeMounted?: () => void;
}

export const MoniteProvider = ({
  monite,
  theme,
  componentSettings,
  children,
  locale,
  onThemeMounted,
}: MoniteProviderProps) => {
  return (
    <MoniteContextProvider
      monite={monite}
      locale={locale}
      theme={theme}
      componentSettings={componentSettings}
    >
      <EmotionCacheProvider cacheKey="monite-css-baseline">
        <MoniteThemeProvider
          onThemeMounted={() => {
            onThemeMounted?.();
          }}
        >
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
