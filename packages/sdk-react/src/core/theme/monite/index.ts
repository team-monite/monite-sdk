/* eslint-disable lingui/no-unlocalized-strings */
import { ThemeConfig } from '@/core/theme/types';

export const getTheme = (theme: ThemeConfig) => {
  return {
    borderRadius: theme.borderRadius ?? 6,
    buttonBorderRadius: 8,
    spacing: theme.spacing ?? 8,

    colors: {
      primary: theme.colors?.primary || '#3737FF',
      primaryForeground: theme.colors?.primaryForeground || '#ffffff',
      secondary: theme.colors?.secondary || '#707070',
      neutral: theme.colors?.neutral || '#707070',

      info: theme.colors?.info || theme.colors?.primary || '#3737FF',
      success: theme.colors?.success || '#1FBCA0',
      warning: theme.colors?.warning || '#C78032',
      error: theme.colors?.error || '#CC394B',

      background: theme.colors?.background || '#FFFFFF',

      text: theme.colors?.text || '#292929',
    },

    typography: {
      fontFamily:
        theme?.typography?.fontFamily ||
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontSize: theme?.typography?.fontSize ?? 16,

      h1: {
        fontSize: theme.typography?.h1?.fontSize ?? 48,
        fontWeight: theme.typography?.h1?.fontWeight ?? 600,
        lineHeight: theme.typography?.h1?.lineHeight ?? '68px',
        textTransform: theme.typography?.h1?.textTransform ?? 'none',
      },
      h2: {
        fontSize: theme.typography?.h2?.fontSize ?? 34,
        fontWeight: theme.typography?.h2?.fontWeight ?? 640,
        lineHeight: theme.typography?.h2?.lineHeight ?? '40px',
        textTransform: theme.typography?.h2?.textTransform ?? 'none',
      },
      h3: {
        fontSize: theme.typography?.h3?.fontSize ?? 24,
        fontWeight: theme.typography?.h3?.fontWeight ?? 600,
        lineHeight: theme.typography?.h3?.lineHeight ?? '32px',
        textTransform: theme.typography?.h3?.textTransform ?? 'none',
      },
      subtitle1: {
        fontSize: theme.typography?.subtitle1?.fontSize ?? 20,
        fontWeight: theme.typography?.subtitle1?.fontWeight ?? 600,
        lineHeight: theme.typography?.subtitle1?.lineHeight ?? '24px',
        textTransform: theme.typography?.subtitle1?.textTransform ?? 'none',
      },
      subtitle2: {
        fontSize: theme.typography?.subtitle2?.fontSize ?? 18,
        fontWeight: theme.typography?.subtitle2?.fontWeight ?? 600,
        lineHeight: theme.typography?.subtitle2?.lineHeight ?? '24px',
        textTransform: theme.typography?.subtitle2?.textTransform ?? 'none',
      },
      body1: {
        fontSize: theme.typography?.body1?.fontSize ?? 16,
        fontWeight: theme.typography?.body1?.fontWeight ?? 500,
        lineHeight: theme.typography?.body1?.lineHeight ?? '24px',
      },
      body2: {
        fontSize: theme.typography?.body2?.fontSize ?? 14,
        fontWeight: theme.typography?.body2?.fontWeight ?? 400,
        lineHeight: theme.typography?.body2?.lineHeight ?? '20px',
      },
    },

    components: {
      invoiceStatusChip: {
        icon: theme.components?.invoiceStatusChip?.icon || false,
        size: theme.components?.invoiceStatusChip?.size || 'small',
        variant: theme.components?.invoiceStatusChip?.variant || 'filled',
      },
      payableStatusChip: {
        icon:
          theme.components?.payableStatusChip?.icon !== undefined
            ? theme.components?.payableStatusChip?.icon
            : false,
        size: theme.components?.payableStatusChip?.size || 'small',
        variant: theme.components?.payableStatusChip?.variant || 'filled',
        colors: theme.components?.payableStatusChip?.colors,
      },
      approvalRequestStatusChip: {
        icon: theme.components?.approvalRequestStatusChip?.icon || false,
        size: theme.components?.approvalRequestStatusChip?.size || 'small',
        variant:
          theme.components?.approvalRequestStatusChip?.variant || 'filled',
      },
      invoiceRecurrenceStatusChip: {
        icon: theme.components?.invoiceRecurrenceStatusChip?.icon || false,
        size: theme.components?.invoiceRecurrenceStatusChip?.size || 'small',
        variant:
          theme.components?.invoiceRecurrenceStatusChip?.variant || 'filled',
      },
      invoiceRecurrenceIterationStatusChip: {
        icon:
          theme.components?.invoiceRecurrenceIterationStatusChip?.icon || false,
        size:
          theme.components?.invoiceRecurrenceIterationStatusChip?.size ||
          'small',
        variant:
          theme.components?.invoiceRecurrenceIterationStatusChip?.variant ||
          'filled',
      },
      counterpartStatusChip: {
        size: theme.components?.counterpartStatusChip?.size || 'small',
        variant: theme.components?.counterpartStatusChip?.variant || 'filled',
      },
      approvalStatusChip: {
        icon: theme.components?.approvalStatusChip?.icon || false,
        size: theme.components?.approvalStatusChip?.size || 'small',
        variant: theme.components?.approvalStatusChip?.variant || 'filled',
      },
    },
  };
};
