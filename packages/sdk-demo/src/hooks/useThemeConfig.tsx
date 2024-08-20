import { useLocalStorage } from 'react-use';

import { ThemeConfig } from '@/types';
import {
  materialDark as themeMaterialDark,
  materialLight as themeMaterialLight,
  moniteDark as themeMoniteDark,
  moniteLight as themeMoniteLight,
} from '@team-monite/sdk-themes';

export const getThemeOptions = (themeConfig: ThemeConfig) => {
  const { variant, mode } = themeConfig;

  if (variant === 'material') {
    return Object.assign(
      {
        components: {
          MoniteInvoiceStatusChip: {
            defaultProps: {
              icon: true,
            },
          },
          MonitePayableStatusChip: {
            defaultProps: {
              icon: true,
            },
          },
          MoniteApprovalRequestStatusChip: {
            defaultProps: {
              icon: false,
            },
          },
          MoniteTablePagination: {
            defaultProps: {
              pageSizeOptions: [10, 15, 20],
            },
          },
        },
      },
      mode === 'light' ? themeMaterialLight : themeMaterialDark
    );
  }

  return mode === 'light' ? themeMoniteLight : themeMoniteDark;
};

export const useThemeConfig = () => {
  const defaultThemeConfig: ThemeConfig = {
    variant: 'material',
    mode: 'light',
  };
  const [themeConfig, setThemeConfig] = useLocalStorage<ThemeConfig>(
    'themeConfig',
    defaultThemeConfig
  );

  return {
    themeConfig: themeConfig || defaultThemeConfig,
    setThemeConfig,
  };
};
