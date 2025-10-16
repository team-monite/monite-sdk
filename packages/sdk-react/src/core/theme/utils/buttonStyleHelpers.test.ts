import {
  isGradient,
  getButtonStyles,
  getButtonStateStyles,
  applyBackgroundStyles,
  applyColorStyles,
  applyBorderStyles,
  applyTypographyStyles,
  applyShadowStyles,
  applyTransitionStyles,
  CSSInJSStyles,
} from './buttonStyleHelpers';
import { ButtonStyleConfig } from '../types';

describe('buttonStyleHelpers', () => {
  describe('Composable Helper Functions', () => {
    describe('applyBackgroundStyles', () => {
      test('applies solid background color', () => {
        const styles: CSSInJSStyles = {};
        applyBackgroundStyles({ background: '#667eea' }, styles);

        expect(styles).toEqual({
          background: '#667eea',
          backgroundImage: 'none',
        });
      });

      test('applies linear gradient background', () => {
        const styles: CSSInJSStyles = {};
        applyBackgroundStyles(
          { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          styles
        );

        expect(styles).toEqual({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        });
      });

      test('applies radial gradient background', () => {
        const styles: CSSInJSStyles = {};
        applyBackgroundStyles(
          { background: 'radial-gradient(circle, #fff, #000)' },
          styles
        );

        expect(styles).toEqual({
          background: 'radial-gradient(circle, #fff, #000)',
          backgroundImage: 'radial-gradient(circle, #fff, #000)',
        });
      });

      test('does nothing when background is not provided', () => {
        const styles: CSSInJSStyles = {};
        applyBackgroundStyles({}, styles);

        expect(styles).toEqual({});
      });

      test('handles transparent background', () => {
        const styles: CSSInJSStyles = {};
        applyBackgroundStyles({ background: 'transparent' }, styles);

        expect(styles).toEqual({
          background: 'transparent',
          backgroundImage: 'none',
        });
      });
    });

    describe('applyColorStyles', () => {
      test('applies text color', () => {
        const styles: CSSInJSStyles = {};
        applyColorStyles({ color: '#ffffff' }, styles);

        expect(styles).toEqual({
          color: '#ffffff',
        });
      });

      test('does nothing when color is not provided', () => {
        const styles: CSSInJSStyles = {};
        applyColorStyles({}, styles);

        expect(styles).toEqual({});
      });

      test('applies rgb color', () => {
        const styles: CSSInJSStyles = {};
        applyColorStyles({ color: 'rgb(102, 126, 234)' }, styles);

        expect(styles).toEqual({
          color: 'rgb(102, 126, 234)',
        });
      });
    });

    describe('applyBorderStyles', () => {
      test('applies border shorthand', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({ border: '2px solid #667eea' }, styles);

        expect(styles).toEqual({
          border: '2px solid #667eea',
        });
      });

      test('applies numeric borderRadius as px', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({ borderRadius: 12 }, styles);

        expect(styles).toEqual({
          borderRadius: '12px',
        });
      });

      test('applies string borderRadius as-is', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({ borderRadius: '0.5rem' }, styles);

        expect(styles).toEqual({
          borderRadius: '0.5rem',
        });
      });

      test('applies both border and borderRadius', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({ border: '1px dashed red', borderRadius: 8 }, styles);

        expect(styles).toEqual({
          border: '1px dashed red',
          borderRadius: '8px',
        });
      });

      test('applies borderRadius of 0', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({ borderRadius: 0 }, styles);

        expect(styles).toEqual({
          borderRadius: '0px',
        });
      });

      test('does nothing when no border properties provided', () => {
        const styles: CSSInJSStyles = {};
        applyBorderStyles({}, styles);

        expect(styles).toEqual({});
      });
    });

    describe('applyTypographyStyles', () => {
      test('applies numeric fontWeight', () => {
        const styles: CSSInJSStyles = {};
        applyTypographyStyles({ fontWeight: 600 }, styles);

        expect(styles).toEqual({
          fontWeight: 600,
        });
      });

      test('applies string fontWeight', () => {
        const styles: CSSInJSStyles = {};
        applyTypographyStyles({ fontWeight: 'bold' }, styles);

        expect(styles).toEqual({
          fontWeight: 'bold',
        });
      });

      test('applies fontWeight of 0', () => {
        const styles: CSSInJSStyles = {};
        applyTypographyStyles({ fontWeight: 0 }, styles);

        expect(styles).toEqual({
          fontWeight: 0,
        });
      });

      test('does nothing when fontWeight is not provided', () => {
        const styles: CSSInJSStyles = {};
        applyTypographyStyles({}, styles);

        expect(styles).toEqual({});
      });
    });

    describe('applyShadowStyles', () => {
      test('applies single box shadow', () => {
        const styles: CSSInJSStyles = {};
        applyShadowStyles(
          { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
          styles
        );

        expect(styles).toEqual({
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        });
      });

      test('applies multiple box shadows', () => {
        const styles: CSSInJSStyles = {};
        applyShadowStyles(
          {
            boxShadow:
              '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
          },
          styles
        );

        expect(styles).toEqual({
          boxShadow:
            '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
        });
      });

      test('applies none to remove shadow', () => {
        const styles: CSSInJSStyles = {};
        applyShadowStyles({ boxShadow: 'none' }, styles);

        expect(styles).toEqual({
          boxShadow: 'none',
        });
      });

      test('does nothing when boxShadow is not provided', () => {
        const styles: CSSInJSStyles = {};
        applyShadowStyles({}, styles);

        expect(styles).toEqual({});
      });
    });

    describe('applyTransitionStyles', () => {
      test('applies transition with duration only', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles({ transitionDuration: '300ms' }, styles);

        expect(styles).toEqual({
          transition: 'all 300ms',
        });
      });

      test('applies transition with duration and timing function', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles(
          {
            transitionDuration: '200ms',
            transitionTimingFunction: 'ease-in-out',
          },
          styles
        );

        expect(styles).toEqual({
          transition: 'all 200ms ease-in-out',
        });
      });

      test('applies complete transition config', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles(
          {
            transitionProperty: 'background, color, box-shadow',
            transitionDuration: '150ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
          styles
        );

        expect(styles).toEqual({
          transition:
            'background, color, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        });
      });

      test('applies custom property without duration', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles({ transitionProperty: 'transform' }, styles);

        expect(styles).toEqual({
          transition: 'transform',
        });
      });

      test('applies timing function without duration', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles(
          { transitionTimingFunction: 'ease-out' },
          styles
        );

        expect(styles).toEqual({
          transition: 'all ease-out',
        });
      });

      test('does nothing when no transition properties provided', () => {
        const styles: CSSInJSStyles = {};
        applyTransitionStyles({}, styles);

        expect(styles).toEqual({});
      });
    });

    describe('Combined composable function usage', () => {
      test('applies multiple style groups together', () => {
        const config: ButtonStyleConfig = {
          background: '#667eea',
          color: '#ffffff',
          border: '2px solid #667eea',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transitionDuration: '200ms',
        };

        const styles: CSSInJSStyles = {};
        applyBackgroundStyles(config, styles);
        applyColorStyles(config, styles);
        applyBorderStyles(config, styles);
        applyTypographyStyles(config, styles);
        applyShadowStyles(config, styles);
        applyTransitionStyles(config, styles);

        expect(styles).toEqual({
          background: '#667eea',
          backgroundImage: 'none',
          color: '#ffffff',
          border: '2px solid #667eea',
          borderRadius: '12px',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 200ms',
        });
      });
    });
  });

  describe('isGradient', () => {
    test('detects linear gradients', () => {
      expect(isGradient('linear-gradient(90deg, #fff, #000)')).toBe(true);
      expect(
        isGradient('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
      ).toBe(true);
    });

    test('detects radial gradients', () => {
      expect(isGradient('radial-gradient(circle, #fff, #000)')).toBe(true);
      expect(
        isGradient('radial-gradient(circle at center, #667eea, #764ba2)')
      ).toBe(true);
    });

    test('detects conic gradients', () => {
      expect(isGradient('conic-gradient(#fff, #000)')).toBe(true);
    });

    test('returns false for solid colors', () => {
      expect(isGradient('#ffffff')).toBe(false);
      expect(isGradient('rgb(255, 255, 255)')).toBe(false);
      expect(isGradient('rgba(255, 255, 255, 0.5)')).toBe(false);
      expect(isGradient('red')).toBe(false);
    });

    test('handles edge cases', () => {
      expect(isGradient('')).toBe(false);
      expect(isGradient('transparent')).toBe(false);
      expect(isGradient('inherit')).toBe(false);
    });
  });

  describe('getButtonStyles', () => {
    test('returns empty object for undefined config', () => {
      expect(getButtonStyles(undefined)).toEqual({});
    });

    test('returns empty object for empty config', () => {
      expect(getButtonStyles({})).toEqual({});
    });

    test('handles solid background color', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
      };

      expect(getButtonStyles(config)).toEqual({
        background: '#667eea',
        backgroundImage: 'none',
      });
    });

    test('handles gradient background', () => {
      const config: ButtonStyleConfig = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };

      expect(getButtonStyles(config)).toEqual({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      });
    });

    test('handles text color', () => {
      const config: ButtonStyleConfig = {
        color: '#ffffff',
      };

      expect(getButtonStyles(config)).toEqual({
        color: '#ffffff',
      });
    });

    test('handles border shorthand with spaces', () => {
      const config: ButtonStyleConfig = {
        border: '2px solid #667eea',
      };

      expect(getButtonStyles(config)).toEqual({
        border: '2px solid #667eea',
      });
    });

    test('handles border shorthand variations', () => {
      expect(getButtonStyles({ border: 'none' })).toEqual({ border: 'none' });
      expect(getButtonStyles({ border: '1px dashed red' })).toEqual({
        border: '1px dashed red',
      });
    });

    test('converts numeric borderRadius to px', () => {
      const config: ButtonStyleConfig = {
        borderRadius: 12,
      };

      expect(getButtonStyles(config)).toEqual({
        borderRadius: '12px',
      });
    });

    test('keeps string borderRadius as-is', () => {
      const config: ButtonStyleConfig = {
        borderRadius: '0.5rem',
      };

      expect(getButtonStyles(config)).toEqual({
        borderRadius: '0.5rem',
      });
    });

    test('handles fontWeight as number', () => {
      const config: ButtonStyleConfig = {
        fontWeight: 600,
      };

      expect(getButtonStyles(config)).toEqual({
        fontWeight: 600,
      });
    });

    test('handles fontWeight as string', () => {
      const config: ButtonStyleConfig = {
        fontWeight: 'bold',
      };

      expect(getButtonStyles(config)).toEqual({
        fontWeight: 'bold',
      });
    });

    test('handles complete button config', () => {
      const config: ButtonStyleConfig = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: 12,
        fontWeight: 600,
      };

      expect(getButtonStyles(config)).toEqual({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: '12px',
        fontWeight: 600,
      });
    });

    test('handles borderRadius of 0', () => {
      const config: ButtonStyleConfig = {
        borderRadius: 0,
      };

      expect(getButtonStyles(config)).toEqual({
        borderRadius: '0px',
      });
    });

    test('handles boxShadow', () => {
      const config: ButtonStyleConfig = {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      };

      expect(getButtonStyles(config)).toEqual({
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      });
    });

    test('handles multiple boxShadows', () => {
      const config: ButtonStyleConfig = {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
      };

      expect(getButtonStyles(config)).toEqual({
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
      });
    });

    test('handles transition with duration only', () => {
      const config: ButtonStyleConfig = {
        transitionDuration: '300ms',
      };

      expect(getButtonStyles(config)).toEqual({
        transition: 'all 300ms',
      });
    });

    test('handles transition with duration and timing function', () => {
      const config: ButtonStyleConfig = {
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in-out',
      };

      expect(getButtonStyles(config)).toEqual({
        transition: 'all 300ms ease-in-out',
      });
    });

    test('handles complete transition config', () => {
      const config: ButtonStyleConfig = {
        transitionProperty: 'background, color, box-shadow',
        transitionDuration: '200ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      };

      expect(getButtonStyles(config)).toEqual({
        transition: 'background, color, box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      });
    });

    test('handles transition with custom property', () => {
      const config: ButtonStyleConfig = {
        transitionProperty: 'transform',
        transitionDuration: '150ms',
      };

      expect(getButtonStyles(config)).toEqual({
        transition: 'transform 150ms',
      });
    });

    test('handles all properties including new ones', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: 12,
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in-out',
      };

      expect(getButtonStyles(config)).toEqual({
        background: '#667eea',
        backgroundImage: 'none',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: '12px',
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
        transition: 'all 200ms ease-in-out',
      });
    });
  });

  describe('getButtonStateStyles', () => {
    test('returns empty object for undefined config', () => {
      expect(getButtonStateStyles('hover', undefined)).toEqual({});
    });

    test('returns empty object when state is not defined', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
      };

      expect(getButtonStateStyles('hover', config)).toEqual({});
    });

    test('returns hover state styles', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        hover: {
          background: '#5568d3',
        },
      };

      expect(getButtonStateStyles('hover', config)).toEqual({
        background: '#5568d3',
        backgroundImage: 'none',
      });
    });

    test('returns active state styles', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        active: {
          background: '#4557bd',
        },
      };

      expect(getButtonStateStyles('active', config)).toEqual({
        background: '#4557bd',
        backgroundImage: 'none',
      });
    });

    test('returns focus state styles', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        focus: {
          background: '#7788ee',
        },
      };

      expect(getButtonStateStyles('focus', config)).toEqual({
        background: '#7788ee',
        backgroundImage: 'none',
      });
    });

    test('returns disabled state styles', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        color: '#ffffff',
        disabled: {
          background: '#e5e7eb',
          color: '#9ca3af',
        },
      };

      expect(getButtonStateStyles('disabled', config)).toEqual({
        background: '#e5e7eb',
        backgroundImage: 'none',
        color: '#9ca3af',
      });
    });

    test('handles gradient in state override', () => {
      const config: ButtonStyleConfig = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        hover: {
          background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
        },
      };

      expect(getButtonStateStyles('hover', config)).toEqual({
        background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
        backgroundImage: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
      });
    });

    test('handles complete state override', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        color: '#ffffff',
        border: '2px solid #667eea',
        borderRadius: 12,
        fontWeight: 600,
        hover: {
          background: '#5568d3',
          color: '#f0f0f0',
          border: '2px solid #5568d3',
          borderRadius: 10,
          fontWeight: 700,
        },
      };

      expect(getButtonStateStyles('hover', config)).toEqual({
        background: '#5568d3',
        backgroundImage: 'none',
        color: '#f0f0f0',
        border: '2px solid #5568d3',
        borderRadius: '10px',
        fontWeight: 700,
      });
    });

    test('handles boxShadow in hover state', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        hover: {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        },
      };

      expect(getButtonStateStyles('hover', config)).toEqual({
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      });
    });

    test('handles boxShadow in disabled state (removal)', () => {
      const config: ButtonStyleConfig = {
        background: '#667eea',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        disabled: {
          background: '#e5e7eb',
          boxShadow: 'none',
        },
      };

      expect(getButtonStateStyles('disabled', config)).toEqual({
        background: '#e5e7eb',
        backgroundImage: 'none',
        boxShadow: 'none',
      });
    });
  });

  describe('integration scenarios', () => {
    test('handles real-world primary button config with elevation', () => {
      const config: ButtonStyleConfig = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: 12,
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in-out',
        hover: {
          background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
          boxShadow: '0 6px 12px rgba(102, 126, 234, 0.4)',
        },
        active: {
          background: 'linear-gradient(135deg, #4557bd 0%, #54376f 100%)',
          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
        },
        disabled: {
          background: '#e5e7eb',
          color: '#9ca3af',
          boxShadow: 'none',
        },
      };

      expect(getButtonStyles(config)).toMatchObject({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
        transition: 'all 200ms ease-in-out',
      });

      expect(getButtonStateStyles('hover', config)).toMatchObject({
        background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
        backgroundImage: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
        boxShadow: '0 6px 12px rgba(102, 126, 234, 0.4)',
      });

      expect(getButtonStateStyles('active', config)).toMatchObject({
        background: 'linear-gradient(135deg, #4557bd 0%, #54376f 100%)',
        backgroundImage: 'linear-gradient(135deg, #4557bd 0%, #54376f 100%)',
        boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
      });

      expect(getButtonStateStyles('disabled', config)).toMatchObject({
        background: '#e5e7eb',
        backgroundImage: 'none',
        color: '#9ca3af',
        boxShadow: 'none',
      });
    });

    test('handles real-world secondary button config', () => {
      const config: ButtonStyleConfig = {
        background: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
        borderRadius: 12,
        fontWeight: 500,
        hover: {
          background: '#f3f4f6',
        },
      };

      expect(getButtonStyles(config)).toEqual({
        background: 'transparent',
        backgroundImage: 'none',
        color: '#667eea',
        border: '2px solid #667eea',
        borderRadius: '12px',
        fontWeight: 500,
      });

      expect(getButtonStateStyles('hover', config)).toEqual({
        background: '#f3f4f6',
        backgroundImage: 'none',
      });
    });
  });
});
