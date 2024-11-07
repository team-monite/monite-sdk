import { ThemeConfig } from '@/core/theme/types';

export const getTheme = (theme: ThemeConfig) => {
  return {
    colors: {
      primary: theme.colors?.primary || '#3737FF',
      secondary: theme.colors?.secondary || '#707070',
      neutral: theme.colors?.neutral || '#707070',

      background: theme.colors?.background || '#FAFAFA',

      text: theme.colors?.text || '#292929',
    },

    typography: {
      fontFamily:
        theme?.typography?.fontFamily ??
        '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
  };
};
