// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../sdk-react/mui-styles.d.ts" />
import { useLocalStorage } from 'react-use';

import { ThemeConfig } from '@/types';
import { ThemeOptions } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { deepmerge } from '@mui/utils';
import {
  materialDark as themeMaterialDark,
  materialLight as themeMaterialLight,
  moniteDark as themeMoniteDark,
  moniteLight as themeMoniteLight,
} from '@team-monite/sdk-themes';

export const getThemeOptions = (themeConfig: ThemeConfig) => {
  const { variant, mode } = themeConfig;

  if (variant === 'material') {
    return deepmerge(
      mode === 'light' ? themeMaterialLight : themeMaterialDark,
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
              icon: true,
            },
          },
          MoniteInvoiceRecurrenceStatusChip: {
            defaultProps: {
              icon: true,
            },
          },
          MoniteInvoiceRecurrenceIterationStatusChip: {
            defaultProps: {
              icon: true,
            },
          },
          MoniteTablePagination: {
            defaultProps: {
              pageSizeOptions: [10, 15, 20],
            },
          },
        },
      } satisfies ThemeOptions
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
