import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Theme } from 'consts';

type ThemeProviderProps = {
  theme: Theme;
  children: any;
};
const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
  <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);

export default ThemeProvider;
