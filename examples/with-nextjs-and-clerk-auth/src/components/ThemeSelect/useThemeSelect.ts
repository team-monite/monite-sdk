import { useMemo } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

interface UseThemeSelectOptions {
  selectedTheme: ThemeConfig;
}

export const useThemeSelect = (options: UseThemeSelectOptions) => {
  const { selectedTheme } = options;
  const { i18n } = useLingui();

  const themeName = useMemo(() => {
    switch (selectedTheme.variant) {
      default:
      case 'monite':
        return t(i18n)`Monite`;

      case 'material':
        return t(i18n)`Material UI`;
    }
  }, [i18n, selectedTheme.variant]);

  const modeName = useMemo(() => {
    switch (selectedTheme.mode) {
      default:
      case 'light':
        return t(i18n)`Light Mode`;

      case 'dark':
        return t(i18n)`Dark Mode`;
    }
  }, [i18n, selectedTheme.mode]);

  return { modeName, themeName };
};
