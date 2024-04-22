import { useLocalStorage } from 'react-use';

import { ThemeConfig } from '@/types';
import {
  materialDark as themeMaterialDark,
  materialLight as themeMaterialLight,
  moniteDark as themeMoniteDark,
  moniteLight as themeMoniteLight,
} from '@team-monite/sdk-themes';

const getTheme = (themeConfig: ThemeConfig) => {
  const { themeIndex, colorMode } = themeConfig;

  if (themeIndex === 'material') {
    return colorMode === 'light' ? themeMaterialLight : themeMaterialDark;
  }

  return colorMode === 'light' ? themeMoniteLight : themeMoniteDark;
};

export const useTheme = () => {
  const defaultThemeConfig: ThemeConfig = {
    themeIndex: 'material',
    colorMode: 'light',
  };
  const [themeConfig, setThemeConfig] = useLocalStorage<ThemeConfig>(
    'themeConfig',
    defaultThemeConfig
  );

  return {
    theme: getTheme(themeConfig || defaultThemeConfig),
    themeConfig: themeConfig || defaultThemeConfig,
    setThemeConfig,
  };
};
