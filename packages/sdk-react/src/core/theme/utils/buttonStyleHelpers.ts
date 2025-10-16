import { ButtonStyleConfig } from '../types';
import type { CSSProperties } from 'react';

/**
 * CSS-in-JS style object type that matches React.CSSProperties
 * but allows for string | number values for flexibility
 */
export type CSSInJSStyles = {
  [K in keyof CSSProperties]?: CSSProperties[K] | string | number;
};

/**
 * Detects if a background value is a CSS gradient
 * @param background - The background value to check
 * @returns true if the background is a gradient, false otherwise
 *
 * @example
 * isGradient('linear-gradient(90deg, #fff, #000)') // true
 * isGradient('radial-gradient(circle, #fff, #000)') // true
 * isGradient('#ffffff') // false
 */
export function isGradient(background: string): boolean {
  return /gradient\(/.test(background);
}

/**
 * Applies background and background-image CSS properties
 * Handles both solid colors and gradients
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyBackgroundStyles({ background: '#667eea' }, styles);
 * // styles = { background: '#667eea', backgroundImage: 'none' }
 *
 * @example
 * const styles = {};
 * applyBackgroundStyles({ background: 'linear-gradient(...)' }, styles);
 * // styles = { background: 'linear-gradient(...)', backgroundImage: 'linear-gradient(...)' }
 */
export function applyBackgroundStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (!config.background) return;

  if (isGradient(config.background)) {
    styles.backgroundImage = config.background;
    styles.background = config.background;
  } else {
    styles.background = config.background;
    styles.backgroundImage = 'none';
  }
}

/**
 * Applies color CSS property
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyColorStyles({ color: '#ffffff' }, styles);
 * // styles = { color: '#ffffff' }
 */
export function applyColorStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (!config.color) return;
  styles.color = config.color;
}

/**
 * Applies border and border-radius CSS properties
 * Converts numeric borderRadius values to px
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyBorderStyles({ border: '2px solid #667eea', borderRadius: 12 }, styles);
 * // styles = { border: '2px solid #667eea', borderRadius: '12px' }
 */
export function applyBorderStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (config.border) {
    styles.border = config.border;
  }

  if (config.borderRadius !== undefined) {
    styles.borderRadius =
      typeof config.borderRadius === 'number'
        ? `${config.borderRadius}px`
        : config.borderRadius;
  }
}

/**
 * Applies typography-related CSS properties (fontWeight)
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyTypographyStyles({ fontWeight: 600 }, styles);
 * // styles = { fontWeight: 600 }
 */
export function applyTypographyStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (config.fontWeight !== undefined) {
    styles.fontWeight = config.fontWeight;
  }
}

/**
 * Applies box-shadow CSS property
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyShadowStyles({ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }, styles);
 * // styles = { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
 */
export function applyShadowStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (config.boxShadow !== undefined) {
    styles.boxShadow = config.boxShadow;
  }
}

/**
 * Applies transition CSS property
 * Constructs transition shorthand from individual properties
 *
 * @param config - The button style configuration
 * @param styles - The styles object to mutate
 *
 * @example
 * const styles = {};
 * applyTransitionStyles({
 *   transitionDuration: '200ms',
 *   transitionTimingFunction: 'ease-in-out'
 * }, styles);
 * // styles = { transition: 'all 200ms ease-in-out' }
 */
export function applyTransitionStyles(
  config: ButtonStyleConfig,
  styles: CSSInJSStyles
): void {
  if (
    !config.transitionDuration &&
    !config.transitionTimingFunction &&
    !config.transitionProperty
  ) {
    return;
  }

  const transitionParts: string[] = [];

  const property = config.transitionProperty || 'all';
  transitionParts.push(property);

  if (config.transitionDuration) {
    transitionParts.push(config.transitionDuration);
  }

  if (config.transitionTimingFunction) {
    transitionParts.push(config.transitionTimingFunction);
  }

  styles.transition = transitionParts.join(' ');
}

/**
 * Converts ButtonStyleConfig to CSS-in-JS object
 * Handles gradients, border radius conversion, and all button style properties
 *
 * @param config - The button style configuration
 * @returns CSS-in-JS object ready for MUI or styled-components
 *
 * @example
 * const styles = getButtonStyles({
 *   background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
 *   color: '#ffffff',
 *   border: '2px solid #667eea',
 *   borderRadius: 12,
 *   fontWeight: 600,
 * });
 * // Returns:
 * // {
 * //   background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
 * //   backgroundImage: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
 * //   color: '#ffffff',
 * //   border: '2px solid #667eea',
 * //   borderRadius: '12px',
 * //   fontWeight: 600,
 * // }
 */
export function getButtonStyles(
  config?: ButtonStyleConfig
): CSSInJSStyles {
  if (!config) return {};

  const styles: CSSInJSStyles = {};

  applyBackgroundStyles(config, styles);
  applyColorStyles(config, styles);
  applyBorderStyles(config, styles);
  applyTypographyStyles(config, styles);
  applyShadowStyles(config, styles);
  applyTransitionStyles(config, styles);

  return styles;
}

/**
 * Gets the styles for a specific button state (hover, active, focus, disabled)
 * @param state - The button state to get styles for
 * @param config - The button style configuration
 * @returns CSS-in-JS object for the specified state
 *
 * @example
 * const hoverStyles = getButtonStateStyles('hover', {
 *   background: '#667eea',
 *   hover: {
 *     background: '#5568d3',
 *   },
 * });
 * // Returns: { background: '#5568d3', backgroundImage: 'none' }
 */
export function getButtonStateStyles(
  state: 'hover' | 'active' | 'focus' | 'disabled',
  config?: ButtonStyleConfig
): CSSInJSStyles {
  if (!config || !config[state]) return {};
  return getButtonStyles(config[state]);
}

/**
 * Generates CSS custom properties (variables) for Tailwind button customization
 * These variables are consumed by packages/sdk-react/src/core/theme/tailwind/payables-buttons.css
 *
 * @param buttonStyles - Object containing button configurations for all variants
 * @returns Object with CSS variable names as keys and values as strings
 *
 * @example
 * const cssVars = generatePayablesButtonCssVars({
 *   primary: {
 *     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *     color: '#ffffff',
 *     borderRadius: 8,
 *     hover: { background: '#5568d3' }
 *   }
 * });
 * // Returns:
 * // {
 * //   '--mtw-btn-payables-primary-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 * //   '--mtw-btn-payables-primary-color': '#ffffff',
 * //   '--mtw-btn-payables-primary-radius': '8px',
 * //   '--mtw-btn-payables-primary-hover-bg': '#5568d3',
 * //   ...
 * // }
 */
export function generatePayablesButtonCssVars(buttonStyles?: {
  primary?: ButtonStyleConfig;
  secondary?: ButtonStyleConfig;
  tertiary?: ButtonStyleConfig;
  destructive?: ButtonStyleConfig;
}): Record<string, string> {
  if (!buttonStyles) return {};

  const cssVars: Record<string, string> = {};

  const variants: Array<keyof typeof buttonStyles> = [
    'primary',
    'secondary',
    'tertiary',
    'destructive',
  ];

  variants.forEach((variant) => {
    const config = buttonStyles[variant];
    if (!config) return;

    const prefix = `--mtw-btn-payables-${variant}`;

    // Base styles
    if (config.background) {
      cssVars[`${prefix}-bg`] = config.background;
    }
    if (config.color) {
      cssVars[`${prefix}-color`] = config.color;
    }
    if (config.border) {
      cssVars[`${prefix}-border`] = config.border;
    }
    if (config.borderRadius !== undefined) {
      cssVars[`${prefix}-radius`] =
        typeof config.borderRadius === 'number'
          ? `${config.borderRadius}px`
          : config.borderRadius;
    }
    if (config.fontWeight !== undefined) {
      cssVars[`${prefix}-weight`] = String(config.fontWeight);
    }
    if (config.boxShadow) {
      cssVars[`${prefix}-shadow`] = config.boxShadow;
    }
    if (config.transitionProperty) {
      cssVars[`${prefix}-transition-property`] = config.transitionProperty;
    }
    if (config.transitionDuration) {
      cssVars[`${prefix}-transition-duration`] = config.transitionDuration;
    }
    if (config.transitionTimingFunction) {
      cssVars[`${prefix}-transition-timing`] = config.transitionTimingFunction;
    }

    // State styles (hover, active, focus, disabled)
    const states: Array<'hover' | 'active' | 'focus' | 'disabled'> = [
      'hover',
      'active',
      'focus',
      'disabled',
    ];

    states.forEach((state) => {
      const stateConfig = config[state];
      if (!stateConfig) return;

      const statePrefix = `${prefix}-${state}`;

      if (stateConfig.background) {
        cssVars[`${statePrefix}-bg`] = stateConfig.background;
      }
      if (stateConfig.color) {
        cssVars[`${statePrefix}-color`] = stateConfig.color;
      }
      if (stateConfig.border) {
        cssVars[`${statePrefix}-border`] = stateConfig.border;
      }
      if (stateConfig.boxShadow) {
        cssVars[`${statePrefix}-shadow`] = stateConfig.boxShadow;
      }
    });
  });

  return cssVars;
}
