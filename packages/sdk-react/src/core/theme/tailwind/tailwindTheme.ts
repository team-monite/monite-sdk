// @ts-expect-error - This is a global css file
import tailwindApp from '../app.css';
import { MoniteTheme } from '@/core/context/MoniteContext';
import { ButtonStyleConfig } from '@/core/theme/types';
import { generatePayablesButtonCssVars } from '@/core/theme/utils/buttonStyleHelpers';
import { css } from '@emotion/react';

/**
 * Helper function to indent multiline strings
 * @param str - The string to indent
 * @param spaces - Number of spaces to indent
 * @returns Indented string
 */
const indent = (str: string, spaces: number): string => {
  const indentation = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line) => (line ? indentation + line : line))
    .join('\n');
};

/**
 * Helper to generate CSS custom properties for button styles
 * Reuses logic from buttonStyleHelpers.ts and transforms the output to CSS string format
 * @param prefix - The CSS variable prefix (e.g., 'payables-primary')
 * @param config - The button style configuration
 * @returns Array of CSS property strings (without semicolons or trailing newlines)
 */
const generateButtonVars = (
  prefix: string,
  config?: ButtonStyleConfig
): string[] => {
  if (!config) return [];

  const cssVars = generatePayablesButtonCssVars({
    [prefix.replace('payables-', '')]: config,
  });

  return Object.entries(cssVars).map(([key, value]) => `${key}: ${value}`);
};

/**
 * Extracts theme values as CSS custom properties string
 * This helper extracts primitive values before passing to emotion's css template
 * to avoid Jest/Emotion serialization issues with complex MUI Theme objects
 * @param theme - The MoniteTheme object
 * @returns CSS string with custom properties
 */
export const generateThemeCssVars = (theme: MoniteTheme): string => {
  const buttonStyles = theme.components?.styles?.payables?.button;

  const vars: string[] = [
    `--mtw-font-family: ${theme.typography.fontFamily}`,
    `--mtw-color-primary-10: ${theme.palette.primary[10]}`,
    `--mtw-color-primary-20: ${theme.palette.primary[20]}`,
    `--mtw-color-primary-30: ${theme.palette.primary[30]}`,
    `--mtw-color-primary-40: ${theme.palette.primary[40]}`,
    `--mtw-color-primary-50: ${theme.palette.primary[50]}`,
    `--mtw-color-primary-55: ${theme.palette.primary[55]}`,
    `--mtw-color-primary-60: ${theme.palette.primary[60]}`,
    `--mtw-color-primary-65: ${theme.palette.primary[65]}`,
    `--mtw-color-primary-80: ${theme.palette.primary[80]}`,
    `--mtw-color-primary-85: ${theme.palette.primary[85]}`,
    `--mtw-color-primary-90: ${theme.palette.primary[90]}`,
    `--mtw-color-primary-95: ${theme.palette.primary[95]}`,
    `--mtw-color-primary-foreground: ${theme.palette.primary.foreground?.main || theme.palette.primary.contrastText}`,
    `--mtw-color-neutral-10: ${theme.palette.neutral[10]}`,
    `--mtw-color-neutral-30: ${theme.palette.neutral[30]}`,
    `--mtw-color-neutral-50: ${theme.palette.neutral[50]}`,
    `--mtw-color-neutral-70: ${theme.palette.neutral[70]}`,
    `--mtw-color-neutral-80: ${theme.palette.neutral[80]}`,
    `--mtw-color-neutral-90: ${theme.palette.neutral[90]}`,
    `--mtw-color-neutral-95: ${theme.palette.neutral[95]}`,
    `--mtw-color-danger-10: ${theme.palette.error[10]}`,
    `--mtw-color-danger-25: ${theme.palette.error[25]}`,
    `--mtw-color-danger-50: ${theme.palette.error[50]}`,
    `--mtw-color-danger-75: ${theme.palette.error[75]}`,
    `--mtw-color-danger-100: ${theme.palette.error[100]}`,
    `--mtw-color-success-10: ${theme.palette.success[10]}`,
    `--mtw-color-success-30: ${theme.palette.success[30]}`,
    `--mtw-color-success-50: ${theme.palette.success[50]}`,
    `--mtw-color-success-60: ${theme.palette.success[60]}`,
    `--mtw-color-success-80: ${theme.palette.success[80]}`,
    `--mtw-color-success-90: ${theme.palette.success[90]}`,
    `--mtw-color-success-95: ${theme.palette.success[95]}`,
    `--mtw-color-warning-10: ${theme.palette.warning[10]}`,
    `--mtw-color-warning-30: ${theme.palette.warning[30]}`,
    `--mtw-color-warning-50: ${theme.palette.warning[50]}`,
    `--mtw-color-warning-60: ${theme.palette.warning[60]}`,
    `--mtw-color-warning-80: ${theme.palette.warning[80]}`,
    `--mtw-color-warning-90: ${theme.palette.warning[90]}`,
    `--mtw-color-warning-95: ${theme.palette.warning[95]}`,
  ];

  const buttonVars = [
    ...generateButtonVars('payables-primary', buttonStyles?.primary),
    ...generateButtonVars('payables-secondary', buttonStyles?.secondary),
    ...generateButtonVars('payables-tertiary', buttonStyles?.tertiary),
    ...generateButtonVars('payables-destructive', buttonStyles?.destructive),
  ];

  if (buttonVars.length > 0) {
    vars.push('', ...buttonVars);
  }

  return vars.join(';\n') + ';';
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
  const themeCssVars = generateThemeCssVars(theme);

  return css`
    :root,
    :host {
${indent(themeCssVars, 6)}
    }

    ${tailwindApp}
  `;
};
