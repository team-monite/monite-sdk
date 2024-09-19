import { ReactNode, useMemo } from 'react';

import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import {
  MoniteAPIProvider,
  MoniteQraftContext,
} from '@/core/context/MoniteAPIProvider';
import { MoniteChatClient } from '@/core/context/MoniteChatClient';
import { MoniteLocale } from '@/core/context/MoniteI18nProvider';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
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

  /** An instance of `MoniteChatClient` */
  chatClient?: MoniteChatClient;

  /**
   * `locale` responsible for internationalisation
   *  of all Widgets provided.
   */
  locale?: MoniteLocale;
}

export const MoniteProvider = ({
  monite,
  theme,
  children,
  locale,
}: MoniteProviderProps) => {
  const muiTheme = useMemo(() => createThemeWithDefaults(theme), [theme]);

  return (
    <MoniteContextProvider monite={monite} locale={locale} theme={muiTheme}>
      <EmotionCacheProvider cacheKey="monite-css-baseline">
        <MuiThemeProvider theme={muiTheme}>
          <ContainerCssBaseline enableColorScheme />
          <GlobalToast />
        </MuiThemeProvider>
      </EmotionCacheProvider>
      <MoniteAPIProvider APIContext={MoniteQraftContext}>
        {children}
      </MoniteAPIProvider>
    </MoniteContextProvider>
  );
};
