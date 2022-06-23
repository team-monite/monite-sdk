import { Theme, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { THEMES } from '../../consts';

type ThemeProviderProps = {
  theme: Theme;
  children: any;
};
const ThemeProvider = ({
  theme = THEMES.default,
  children,
}: ThemeProviderProps) => (
  <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);

export default ThemeProvider;
