import { generateThemeCssVars } from './tailwindTheme';
import { MoniteTheme } from '@/core/context/MoniteContext';
import { ButtonStyleConfig, ThemeConfig } from '@/core/theme/types';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';

/**
 * Tests for CSS variable generation.
 *
 * ## Testing Strategy
 *
 * We test `generateThemeCssVars()` directly, which contains all the business logic
 * for extracting theme values as CSS custom properties. `getTailwindTheme()` is a
 * thin wrapper that passes this output to emotion's `css` template literal.
 *
 * ### Why We Don't Test getTailwindTheme() Directly
 *
 * Testing `getTailwindTheme()` in Jest presents challenges:
 *
 * 1. **Emotion's Internal Serialization**: The `css` template tag uses emotion's
 *    internal serialization (`@emotion/serialize`) which calls `.toString()` on
 *    interpolated values. Mocking `css` alone doesn't prevent this serialization.
 *
 * 2. **CSS Import Complications**: `tailwindApp` is imported from a CSS file, which
 *    Jest's `identity-obj-proxy` turns into a Proxy object that emotion can't serialize.
 *
 * 3. **Complex Mocking Required**: To properly mock emotion, we'd need to mock:
 *    - `@emotion/react`'s `css` function
 *    - `@emotion/serialize`'s serialization logic
 *    - The CSS import from `../app.css`
 *
 *    This level of mocking tests our mocks more than our code.
 *
 * ### What We Test Instead
 *
 * By testing `generateThemeCssVars()` directly, we validate:
 * - ✅ All theme colors are extracted correctly
 * - ✅ Button customizations generate proper CSS variables
 * - ✅ CSS syntax is correct (semicolons, colons, values)
 * - ✅ State-specific variables (hover, active, focus, disabled) are generated
 * - ✅ All button variants (primary, secondary, tertiary, destructive) work
 *
 */

const createTestTheme = (
  buttonOverrides?: {
    primary?: ButtonStyleConfig;
    secondary?: ButtonStyleConfig;
    tertiary?: ButtonStyleConfig;
    destructive?: ButtonStyleConfig;
  }
): MoniteTheme => {
  const themeConfig: ThemeConfig = {
    components: buttonOverrides
      ? {
          styles: {
            payables: {
              button: buttonOverrides,
            },
          },
        }
      : undefined,
  };

  return createThemeWithDefaults(themeConfig);
};

describe('tailwindTheme CSS Variable Generators', () => {
  describe('generateThemeCssVars', () => {
    test('generates CSS with base color variables', () => {
      const theme = createTestTheme();
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-color-primary-10');
      expect(result).toContain('--mtw-color-neutral-50');
      expect(result).toContain('--mtw-color-danger-50');
      expect(result).toContain('--mtw-font-family');
    });

    test('generates button CSS variables when config is provided', () => {
      const buttonConfig: ButtonStyleConfig = {
        background: '#667eea',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: 12,
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-primary-bg: #667eea');
      expect(result).toContain('--mtw-btn-payables-primary-color: #ffffff');
      expect(result).toContain('--mtw-btn-payables-primary-border: 2px solid #667eea');
      expect(result).toContain('--mtw-btn-payables-primary-radius: 12px');
      expect(result).toContain('--mtw-btn-payables-primary-weight: 600');
      expect(result).toContain('--mtw-btn-payables-primary-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)');
    });

    test('generates hover state CSS variables', () => {
      const buttonConfig: ButtonStyleConfig = {
        background: '#667eea',
        hover: {
          background: '#5568d3',
          color: '#f0f0f0',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        },
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-primary-hover-bg: #5568d3');
      expect(result).toContain('--mtw-btn-payables-primary-hover-color: #f0f0f0');
      expect(result).toContain('--mtw-btn-payables-primary-hover-shadow: 0 6px 12px rgba(0, 0, 0, 0.2)');
    });

    test('generates all state CSS variables (hover, active, focus, disabled)', () => {
      const buttonConfig: ButtonStyleConfig = {
        background: '#667eea',
        hover: { background: '#5568d3' },
        active: { background: '#4557bd' },
        focus: { background: '#7788ee' },
        disabled: {
          background: '#e5e7eb',
          color: '#9ca3af',
        },
      };

      const theme = createTestTheme({ secondary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-secondary-hover-bg: #5568d3');
      expect(result).toContain('--mtw-btn-payables-secondary-active-bg: #4557bd');
      expect(result).toContain('--mtw-btn-payables-secondary-focus-bg: #7788ee');
      expect(result).toContain('--mtw-btn-payables-secondary-disabled-bg: #e5e7eb');
      expect(result).toContain('--mtw-btn-payables-secondary-disabled-color: #9ca3af');
    });

    test('generates variables for all button variants', () => {
      const theme = createTestTheme({
        primary: { background: '#667eea' },
        secondary: { background: '#ffffff' },
        tertiary: { background: 'transparent' },
        destructive: { background: '#ef4444' },
      });

      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-primary-bg: #667eea');
      expect(result).toContain('--mtw-btn-payables-secondary-bg: #ffffff');
      expect(result).toContain('--mtw-btn-payables-tertiary-bg: transparent');
      expect(result).toContain('--mtw-btn-payables-destructive-bg: #ef4444');
    });

    test('generates transition CSS variables', () => {
      const buttonConfig: ButtonStyleConfig = {
        background: '#667eea',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in-out',
        transitionProperty: 'all',
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-primary-transition-duration: 200ms');
      expect(result).toContain('--mtw-btn-payables-primary-transition-timing: ease-in-out');
      expect(result).toContain('--mtw-btn-payables-primary-transition-property: all');
    });

    test('handles gradient backgrounds correctly', () => {
      const buttonConfig: ButtonStyleConfig = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        hover: {
          background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
        },
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      expect(result).toContain('linear-gradient(135deg, #5568d3 0%, #65408b 100%)');
    });

    test('handles borderRadius as string (CSS value)', () => {
      const buttonConfig: ButtonStyleConfig = {
        borderRadius: '0.5rem',
      };

      const theme = createTestTheme({ tertiary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-tertiary-radius: 0.5rem');
    });

    test('handles borderRadius as number (converted to px)', () => {
      const buttonConfig: ButtonStyleConfig = {
        borderRadius: 8,
      };

      const theme = createTestTheme({ destructive: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-destructive-radius: 8px');
    });

    test('handles empty button config gracefully', () => {
      const theme = createTestTheme({});
      const result = generateThemeCssVars(theme);

      expect(result).toBeDefined();
      expect(result).toBeDefined();
      expect(result).toContain('--mtw-color-primary-10');
    });

    test('handles undefined button config gracefully', () => {
      const theme = createTestTheme();

      const result = generateThemeCssVars(theme);

      expect(result).toBeDefined();
      expect(result).toBeDefined();
    });

    test('handles complex box shadow with multiple values', () => {
      const buttonConfig: ButtonStyleConfig = {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)');
    });

    test('handles borderRadius of 0', () => {
      const buttonConfig: ButtonStyleConfig = {
        borderRadius: 0,
      };

      const theme = createTestTheme({ primary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-primary-radius: 0px');
    });

    test('handles fontWeight as string', () => {
      const buttonConfig: ButtonStyleConfig = {
        fontWeight: 'bold',
      };

      const theme = createTestTheme({ secondary: buttonConfig });
      const result = generateThemeCssVars(theme);

      expect(result).toContain('--mtw-btn-payables-secondary-weight: bold');
    });

    test('does not generate double semicolons', () => {
      const theme = createTestTheme({
        primary: { background: '#667eea' },
        secondary: { background: '#ffffff' },
      });

      const result = generateThemeCssVars(theme);

      expect(result).not.toContain(';;');
    });

    test('generates properly formatted CSS variables', () => {
      const theme = createTestTheme({
        primary: { background: '#667eea' },
      });
      const result = generateThemeCssVars(theme);

      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(1);

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed !== '' && trimmed !== ';') {
          expect(line).toMatch(/^--[\w-]+: .+;?$/);
        }
      });
    });

    test('adds blank line separator between color vars and button vars', () => {
      const theme = createTestTheme({
        primary: { background: '#667eea' },
      });

      const result = generateThemeCssVars(theme);
      const vars = result.split(';\n');
      const hasBlankLine = vars.some(v => v.trim() === '');

      expect(hasBlankLine).toBe(true);
    });

    test('snapshot: complete CSS output with all button variants', () => {
      const theme = createTestTheme({
        primary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
          hover: {
            background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
          },
        },
        secondary: {
          background: '#ffffff',
          color: '#667eea',
          border: '2px solid #667eea',
          borderRadius: 8,
          hover: {
            background: '#f5f7ff',
          },
        },
      });

      const result = generateThemeCssVars(theme);

      expect(result).toMatchSnapshot();
    });
  });
});
