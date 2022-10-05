import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Theme } from '../../theme_deprecated';

type ThemeProviderProps = {
  theme: Theme;
  children: any;
};
const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
  <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);

export default ThemeProvider;
