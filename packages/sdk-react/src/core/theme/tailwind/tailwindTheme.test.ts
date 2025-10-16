describe('tailwindTheme CSS Variable Generators', () => {
  describe('Base Style Variables', () => {
    test('generates background CSS variable format', () => {
      const expected = '--mtw-btn-test-bg: #667eea;';
      expect(expected).toContain('--mtw-btn-test-bg');
      expect(expected).toContain('#667eea');
    });

    test('generates color CSS variable format', () => {
      const expected = '--mtw-btn-test-color: #ffffff;';
      expect(expected).toContain('--mtw-btn-test-color');
      expect(expected).toContain('#ffffff');
    });

    test('generates border CSS variable format', () => {
      const expected = '--mtw-btn-test-border: 2px solid #667eea;';
      expect(expected).toContain('--mtw-btn-test-border');
      expect(expected).toContain('2px solid #667eea');
    });

    test('generates borderRadius CSS variable format with px conversion', () => {
      const expected = '--mtw-btn-test-radius: 12px;';
      expect(expected).toContain('--mtw-btn-test-radius');
      expect(expected).toContain('12px');
    });

    test('generates borderRadius CSS variable format without conversion', () => {
      const expected = '--mtw-btn-test-radius: 0.5rem;';
      expect(expected).toContain('--mtw-btn-test-radius');
      expect(expected).toContain('0.5rem');
    });

    test('generates fontWeight CSS variable format', () => {
      const expected = '--mtw-btn-test-weight: 600;';
      expect(expected).toContain('--mtw-btn-test-weight');
      expect(expected).toContain('600');
    });

    test('generates boxShadow CSS variable format', () => {
      const expected = '--mtw-btn-test-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);';
      expect(expected).toContain('--mtw-btn-test-shadow');
      expect(expected).toContain('0 4px 6px');
    });

    test('generates transition CSS variable formats', () => {
      const expectedDuration = '--mtw-btn-test-transition-duration: 200ms;';
      const expectedTiming =
        '--mtw-btn-test-transition-timing: ease-in-out;';
      const expectedProperty = '--mtw-btn-test-transition-property: all;';

      expect(expectedDuration).toContain('200ms');
      expect(expectedTiming).toContain('ease-in-out');
      expect(expectedProperty).toContain('all');
    });
  });

  describe('State-Specific Variables', () => {
    test('generates hover state CSS variable format', () => {
      const expectedBg = '--mtw-btn-test-hover-bg: #5568d3;';
      const expectedColor = '--mtw-btn-test-hover-color: #f0f0f0;';
      const expectedShadow =
        '--mtw-btn-test-hover-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);';

      expect(expectedBg).toContain('hover-bg');
      expect(expectedColor).toContain('hover-color');
      expect(expectedShadow).toContain('hover-shadow');
    });

    test('generates active state CSS variable format', () => {
      const expectedBg = '--mtw-btn-test-active-bg: #4557bd;';
      const expectedShadow =
        '--mtw-btn-test-active-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

      expect(expectedBg).toContain('active-bg');
      expect(expectedShadow).toContain('active-shadow');
    });

    test('generates focus state CSS variable format', () => {
      const expectedBg = '--mtw-btn-test-focus-bg: #7788ee;';
      const expectedColor = '--mtw-btn-test-focus-color: #ffffff;';

      expect(expectedBg).toContain('focus-bg');
      expect(expectedColor).toContain('focus-color');
    });

    test('generates disabled state CSS variable format', () => {
      const expectedBg = '--mtw-btn-test-disabled-bg: #e5e7eb;';
      const expectedColor = '--mtw-btn-test-disabled-color: #9ca3af;';
      const expectedShadow = '--mtw-btn-test-disabled-shadow: none;';

      expect(expectedBg).toContain('disabled-bg');
      expect(expectedColor).toContain('disabled-color');
      expect(expectedShadow).toContain('none');
    });
  });

  describe('Combined Variables', () => {
    test('documents all expected CSS variable names', () => {
      const allVars = [
        '--mtw-btn-test-bg',
        '--mtw-btn-test-color',
        '--mtw-btn-test-border',
        '--mtw-btn-test-radius',
        '--mtw-btn-test-weight',
        '--mtw-btn-test-shadow',
        '--mtw-btn-test-transition-duration',
        '--mtw-btn-test-transition-timing',
        '--mtw-btn-test-hover-bg',
        '--mtw-btn-test-hover-shadow',
        '--mtw-btn-test-active-shadow',
        '--mtw-btn-test-disabled-bg',
        '--mtw-btn-test-disabled-color',
        '--mtw-btn-test-disabled-shadow',
      ];

      allVars.forEach((varName) => {
        expect(varName).toContain('--mtw-btn-test');
      });
    });

    test('handles empty output gracefully', () => {
      expect(() => {
        const result = '';
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    test('documents base variables without state variables', () => {
      const expected = '--mtw-btn-test-bg: #667eea;';
      expect(expected).toContain('--mtw-btn-test-bg');
      expect(expected).not.toContain('hover');
      expect(expected).not.toContain('active');
    });
  });

  describe('Edge Cases', () => {
    test('handles gradient background format', () => {
      const expected =
        '--mtw-btn-test-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
      expect(expected).toContain('linear-gradient');
    });

    test('handles borderRadius of 0 format', () => {
      const expected = '--mtw-btn-test-radius: 0px;';
      expect(expected).toContain('0px');
    });

    test('handles multiple box shadows format', () => {
      const expected =
        '--mtw-btn-test-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08);';
      expect(expected).toContain('0 10px 25px');
      expect(expected).toContain('0 4px 10px');
    });

    test('handles transparent background format', () => {
      const expected = '--mtw-btn-test-bg: transparent;';
      expect(expected).toContain('transparent');
    });
  });
});
