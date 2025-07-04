import { MoniteTheme } from '@/core/context/MoniteContext';
import { css } from '@emotion/react';

import tailwindApp from '../app.css';

/**
 * Sets the Tailwind Theme variables to the :root element
 * Based on the MoniteTheme object
 * @param theme - The MoniteTheme object
 * @uses tailwindApp - The Tailwind App CSS file
 * @returns The Tailwind Theme variables
 */
export const getTailwindTheme = (theme: MoniteTheme) => css`
  :root {
    /* Spacing */
    --mtw-spacing: 0.25rem;

    /* Border radius */
    --mtw-radius: ${theme.shape?.borderRadius
      ? `${theme.shape.borderRadius}px`
      : '0.625rem'};

    /* Primary colors with all variations */
    --mtw-color-primary-10: ${theme.palette.primary[10]};
    --mtw-color-primary-20: ${theme.palette.primary[20]};
    --mtw-color-primary-30: ${theme.palette.primary[30]};
    --mtw-color-primary-40: ${theme.palette.primary[40]};
    --mtw-color-primary-50: ${theme.palette.primary[50]};
    --mtw-color-primary-55: ${theme.palette.primary[55]};
    --mtw-color-primary-60: ${theme.palette.primary[60]};
    --mtw-color-primary-65: ${theme.palette.primary[65]};
    --mtw-color-primary-80: ${theme.palette.primary[80]};
    --mtw-color-primary-85: ${theme.palette.primary[85]};
    --mtw-color-primary-90: ${theme.palette.primary[90]};
    --mtw-color-primary-95: ${theme.palette.primary[95]};

    /* Neutral colors */
    --mtw-color-neutral-10: ${theme.palette.neutral[10]};
    --mtw-color-neutral-30: ${theme.palette.neutral[30]};
    --mtw-color-neutral-50: ${theme.palette.neutral[50]};
    --mtw-color-neutral-70: ${theme.palette.neutral[70]};
    --mtw-color-neutral-80: ${theme.palette.neutral[80]};
    --mtw-color-neutral-90: ${theme.palette.neutral[90]};
    --mtw-color-neutral-95: ${theme.palette.neutral[95]};

    /* Error/Danger colors */
    --mtw-color-error-10: ${theme.palette.error[10]};
    --mtw-color-error-30: ${theme.palette.error[30]};
    --mtw-color-error-40: ${theme.palette.error[40]};
    --mtw-color-error-50: ${theme.palette.error[50]};
    --mtw-color-error-60: ${theme.palette.error[60]};
    --mtw-color-error-80: ${theme.palette.error[80]};
    --mtw-color-error-90: ${theme.palette.error[90]};
    --mtw-color-error-95: ${theme.palette.error[95]};

    /* Success colors */
    --mtw-color-success-10: ${theme.palette.success[10]};
    --mtw-color-success-30: ${theme.palette.success[30]};
    --mtw-color-success-50: ${theme.palette.success[50]};
    --mtw-color-success-60: ${theme.palette.success[60]};
    --mtw-color-success-80: ${theme.palette.success[80]};
    --mtw-color-success-90: ${theme.palette.success[90]};
    --mtw-color-success-95: ${theme.palette.success[95]};

    /* Warning colors */
    --mtw-color-warning-10: ${theme.palette.warning[10]};
    --mtw-color-warning-30: ${theme.palette.warning[30]};
    --mtw-color-warning-50: ${theme.palette.warning[50]};
    --mtw-color-warning-60: ${theme.palette.warning[60]};
    --mtw-color-warning-80: ${theme.palette.warning[80]};
    --mtw-color-warning-90: ${theme.palette.warning[90]};
    --mtw-color-warning-95: ${theme.palette.warning[95]};

    --mtw-primary: ${theme.palette.primary[50]};
    --mtw-primary-foreground: #ffffff;
    --mtw-background: #ffffff;
    --mtw-foreground: ${theme.palette.neutral[10]};
    --mtw-popover: #ffffff;
    --mtw-popover-foreground: ${theme.palette.neutral[10]};
    --mtw-card: #ffffff;
    --mtw-card-foreground: ${theme.palette.neutral[10]};
    --mtw-border: ${theme.palette.neutral[80]};
    --mtw-input: ${theme.palette.neutral[80]};
    --mtw-ring: ${theme.palette.primary[50]};
    --mtw-muted: ${theme.palette.neutral[95]};
    --mtw-muted-foreground: ${theme.palette.neutral[50]};
    --mtw-accent: ${theme.palette.neutral[95]};
    --mtw-accent-foreground: ${theme.palette.neutral[10]};
    --mtw-destructive: ${theme.palette.error[50]};
    --mtw-destructive-foreground: #ffffff;
    --mtw-secondary: ${theme.palette.neutral[95]};
    --mtw-secondary-foreground: ${theme.palette.neutral[10]};
  }

  ${tailwindApp}
`;
