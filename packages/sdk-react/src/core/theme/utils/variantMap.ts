/**
 * Central source of truth for button variant mappings across MUI and Tailwind
 *
 * This map ensures consistency between:
 * - MUI button variants (contained, outlined, text)
 * - Tailwind button variants (default, outline, ghost, destructive)
 * - CSS variable prefixes (primary, secondary, tertiary, destructive)
 *
 * Note: Destructive buttons in MUI use variant="contained" with color="error".
 * The MUI theme selector targets: `.MuiButton-contained.MuiButton-colorError`
 *
 * @example
 * ```typescript
 * import { BUTTON_VARIANT_MAP, getMuiVariant } from './variantMap';
 *
 * const muiVariant = getMuiVariant('primary'); // 'contained'
 * const tailwindVariant = getTailwindVariant('primary'); // 'default'
 * ```
 */

export const BUTTON_VARIANT_MAP = {
  primary: {
    mui: 'contained',
    tailwind: 'default',
    cssPrefix: 'primary',
  },
  secondary: {
    mui: 'outlined',
    tailwind: 'outline',
    cssPrefix: 'secondary',
  },
  tertiary: {
    mui: 'text',
    tailwind: 'ghost',
    cssPrefix: 'tertiary',
  },
  destructive: {
    mui: 'contained',
    tailwind: 'destructive',
    cssPrefix: 'destructive',
  },
} as const;

/**
 * Union type of all button variant keys
 */
export type ButtonVariantKey = keyof typeof BUTTON_VARIANT_MAP;

/**
 * Get the MUI variant name for a semantic button variant
 * @param key - Semantic variant key (primary, secondary, tertiary, destructive)
 * @returns MUI variant name (contained, outlined, text)
 */
export const getMuiVariant = (key: ButtonVariantKey): string =>
  BUTTON_VARIANT_MAP[key].mui;

/**
 * Get the Tailwind variant name for a semantic button variant
 * @param key - Semantic variant key (primary, secondary, tertiary, destructive)
 * @returns Tailwind variant name (default, outline, ghost, destructive)
 */
export const getTailwindVariant = (key: ButtonVariantKey): string =>
  BUTTON_VARIANT_MAP[key].tailwind;

/**
 * Get the CSS variable prefix for a semantic button variant
 * @param key - Semantic variant key (primary, secondary, tertiary, destructive)
 * @returns CSS prefix (primary, secondary, tertiary, destructive)
 */
export const getCssPrefix = (key: ButtonVariantKey): string =>
  BUTTON_VARIANT_MAP[key].cssPrefix;

/**
 * Get all variant keys
 * @returns Array of all semantic variant keys
 */
export const getVariantKeys = (): ButtonVariantKey[] =>
  Object.keys(BUTTON_VARIANT_MAP) as ButtonVariantKey[];
