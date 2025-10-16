// @ts-expect-error - This is a global css file
import tailwindApp from '../app.css';
import { MoniteTheme } from '@/core/context/MoniteContext';
import { ButtonStyleConfig } from '@/core/theme/types';
import { css } from '@emotion/react';

/**
 * Generates CSS custom properties for base button styles
 * @param prefix - The CSS variable prefix (e.g., 'payables-primary')
 * @param config - The button style configuration
 * @param vars - Array to push CSS variables into
 */
/* eslint-disable lingui/no-unlocalized-strings */
const generateBaseStyleVars = (
  prefix: string,
  config: ButtonStyleConfig,
  vars: string[]
): void => {
  if (config.background) {
    vars.push(`--mtw-btn-${prefix}-bg: ${config.background};`);
  }
  if (config.color) {
    vars.push(`--mtw-btn-${prefix}-color: ${config.color};`);
  }
  if (config.border) {
    vars.push(`--mtw-btn-${prefix}-border: ${config.border};`);
  }
  if (config.borderRadius !== undefined) {
    const radius =
      typeof config.borderRadius === 'number'
        ? `${config.borderRadius}px`
        : config.borderRadius;
    vars.push(`--mtw-btn-${prefix}-radius: ${radius};`);
  }
  if (config.fontWeight !== undefined) {
    vars.push(`--mtw-btn-${prefix}-weight: ${config.fontWeight};`);
  }
  if (config.boxShadow !== undefined) {
    vars.push(`--mtw-btn-${prefix}-shadow: ${config.boxShadow};`);
  }
};

/**
 * Generates CSS custom properties for button transition styles
 * @param prefix - The CSS variable prefix (e.g., 'payables-primary')
 * @param config - The button style configuration
 * @param vars - Array to push CSS variables into
 */
const generateTransitionStyleVars = (
  prefix: string,
  config: ButtonStyleConfig,
  vars: string[]
): void => {
  if (config.transitionDuration !== undefined) {
    vars.push(`--mtw-btn-${prefix}-transition-duration: ${config.transitionDuration};`);
  }
  if (config.transitionTimingFunction !== undefined) {
    vars.push(`--mtw-btn-${prefix}-transition-timing: ${config.transitionTimingFunction};`);
  }
  if (config.transitionProperty !== undefined) {
    vars.push(`--mtw-btn-${prefix}-transition-property: ${config.transitionProperty};`);
  }
};

/**
 * Generates CSS custom properties for a specific button state
 * @param prefix - The CSS variable prefix (e.g., 'payables-primary')
 * @param state - The state name ('hover', 'active', 'focus', 'disabled')
 * @param stateConfig - The state-specific configuration
 * @param vars - Array to push CSS variables into
 */
const generateStateStyleVars = (
  prefix: string,
  state: 'hover' | 'active' | 'focus' | 'disabled',
  stateConfig: Partial<ButtonStyleConfig> | undefined,
  vars: string[]
): void => {
  if (!stateConfig) return;

  if (stateConfig.background) {
    vars.push(`--mtw-btn-${prefix}-${state}-bg: ${stateConfig.background};`);
  }
  if (stateConfig.color) {
    vars.push(`--mtw-btn-${prefix}-${state}-color: ${stateConfig.color};`);
  }
  if (stateConfig.boxShadow !== undefined) {
    vars.push(`--mtw-btn-${prefix}-${state}-shadow: ${stateConfig.boxShadow};`);
  }
};

/**
 * Helper to generate CSS custom properties for button styles
 * @param prefix - The CSS variable prefix (e.g., 'payables-primary')
 * @param config - The button style configuration
 * @returns CSS string with custom properties
 */
const generateButtonVars = (prefix: string, config?: ButtonStyleConfig): string => {
  if (!config) return '';

  const vars: string[] = [];

  generateBaseStyleVars(prefix, config, vars);
  generateTransitionStyleVars(prefix, config, vars);
  generateStateStyleVars(prefix, 'hover', config.hover, vars);
  generateStateStyleVars(prefix, 'active', config.active, vars);
  generateStateStyleVars(prefix, 'focus', config.focus, vars);
  generateStateStyleVars(prefix, 'disabled', config.disabled, vars);

  return vars.map(v => `    ${v}`).join('\n');
};
/* eslint-enable lingui/no-unlocalized-strings */

/**
 * Sets the Tailwind Theme variables to the :root element
 * Based on the MoniteTheme object
 * @param theme - The MoniteTheme object
 * @uses tailwindApp - The Tailwind App CSS file
 * @returns The Tailwind Theme variables
 */
export const getTailwindTheme = (theme: MoniteTheme) => {
  const buttonStyles = theme.components?.styles?.payables?.button;

  return css`
    :root,
    :host {
      --mtw-font-family: ${theme.typography.fontFamily};

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
    --mtw-color-primary-foreground: ${theme.palette.primary.foreground?.main || theme.palette.primary.contrastText};

    --mtw-color-neutral-10: ${theme.palette.neutral[10]};
    --mtw-color-neutral-30: ${theme.palette.neutral[30]};
    --mtw-color-neutral-50: ${theme.palette.neutral[50]};
    --mtw-color-neutral-70: ${theme.palette.neutral[70]};
    --mtw-color-neutral-80: ${theme.palette.neutral[80]};
    --mtw-color-neutral-90: ${theme.palette.neutral[90]};
    --mtw-color-neutral-95: ${theme.palette.neutral[95]};

    --mtw-color-danger-10: ${theme.palette.error[10]};
    --mtw-color-danger-25: ${theme.palette.error[25]};
    --mtw-color-danger-50: ${theme.palette.error[50]};
    --mtw-color-danger-75: ${theme.palette.error[75]};
    --mtw-color-danger-100: ${theme.palette.error[100]};

    --mtw-color-success-10: ${theme.palette.success[10]};
    --mtw-color-success-30: ${theme.palette.success[30]};
    --mtw-color-success-50: ${theme.palette.success[50]};
    --mtw-color-success-60: ${theme.palette.success[60]};
    --mtw-color-success-80: ${theme.palette.success[80]};
    --mtw-color-success-90: ${theme.palette.success[90]};
    --mtw-color-success-95: ${theme.palette.success[95]};

    --mtw-color-warning-10: ${theme.palette.warning[10]};
    --mtw-color-warning-30: ${theme.palette.warning[30]};
    --mtw-color-warning-50: ${theme.palette.warning[50]};
    --mtw-color-warning-60: ${theme.palette.warning[60]};
    --mtw-color-warning-80: ${theme.palette.warning[80]};
    --mtw-color-warning-90: ${theme.palette.warning[90]};
    --mtw-color-warning-95: ${theme.palette.warning[95]};

${generateButtonVars('payables-primary', buttonStyles?.primary)}
${generateButtonVars('payables-secondary', buttonStyles?.secondary)}
${generateButtonVars('payables-tertiary', buttonStyles?.tertiary)}
${generateButtonVars('payables-destructive', buttonStyles?.destructive)}
  }

  ${tailwindApp}
`
};
