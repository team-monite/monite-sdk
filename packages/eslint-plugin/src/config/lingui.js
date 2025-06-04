/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['lingui'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: true,
  },
  rules: {
    'lingui/no-unlocalized-strings': [
      'warn',
      {
        useTsTypes: true,
        // Ignore literal string values (CSS values, colors, identifiers, etc.)
        ignore: [
          // CSS keywords and basic values
          'none', 'auto', 'inherit', 'initial', 'unset', 'currentColor', 'transparent',
          'right', 'left', 'center', 'top', 'bottom', 'middle', 'bold', 'normal', 'italic', 'error', '0',
          // MUI prop values
          'row', 'column', 'wrap', 'nowrap', 'start', 'end', 'stretch', 'baseline',
          'primary', 'secondary', 'default', 'contained', 'outlined', 'text',
          'small', 'medium', 'large', 'dense', 'comfortable',
          // Intl API constants and date format values
          '2-digit', 'numeric', 'long', 'short', 'narrow',
          'always', 'never', 'auto', 'min2',
          // Common technical values
          'en', 'en-US', 'desc', 'asc', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
          'json', 'text', 'blob', 'formData',
          '/n', '\\n', // Added for newline character representations
          'x-monite-version', // Added for specific HTTP header
          'invoice.', // Added for specific prefix
          // HTTP status codes and methods
          'application/json', 'text/plain', 'multipart/form-data',
          
          // === TARGETED FIXES FOR SPECIFIC WARNINGS ===
          // MIME types (from useFileInput.tsx warnings)
          '^(application|image|text|audio|video)\\/[a-z0-9+.-]+$',
          // Boolean strings (from useLocalStorageFields.ts warnings)
          'true', 'false',
          // HTML attribute values (from CountryFlag.tsx warnings)
          'lazy', 'eager', 'sync', 'async',
          // API entity types (from usePermissions.ts warnings - explicit list)
          'approval_policy', 'approval_request', 'counterpart', 'overdue_reminder',
          'payment_record', 'payment_reminder', 'product', 'receivable', 'role', 'tag', 'payable',
          
          // Chart and visualization values
          'x', 'y', 'z', 'line', 'bar', 'pie', 'area', 'scatter',
          // Common chart field names
          'field_name', 'field_value', 'value', 'label', 'category', 'series',
          // Regex patterns for technical strings
          '^\\d+(\\.\\d+)?(%|px|em|rem|vh|vw|ch|ex|in|cm|mm|pt|pc|fr|deg|rad|turn|s|ms)?$', // Numbers with CSS units
          '^#(?:[0-9a-fA-F]{3,4}){1,2}$', // Hex colors
          '^rgb(a)?\\([^)]+\\)$', // RGB colors
          '^hsl(a)?\\([^)]+\\)$', // HSL colors
          '^[A-Z][a-zA-Z0-9]*([A-Z][a-zA-Z0-9]*)*$', // PascalCase identifiers
          '^[a-z][a-z0-9]*(-[a-z0-9]+)*$', // kebab-case identifiers
          '^[A-Z0-9_]+$', // UPPER_SNAKE_CASE constants
          '^[a-z0-9_]+$', // snake_case identifiers (newly added)
          '^[a-z_][a-zA-Z0-9_]*(.[a-zA-Z0-9_]+)+$', // dot.notation paths
          '^Monite-[A-Za-z0-9-]+$', // Monite CSS class names
          '^--[a-zA-Z0-9-]+$', // CSS BEM-like modifiers starting with --
          '^https?://[^\\s/$.?#].[^\\s]*$', // URLs (removed unnecessary \ from /)
        ],
        // Ignore property/attribute/variable names
        ignoreNames: [
          // React and HTML attributes
          { regex: { pattern: '^(className|style|id|key|htmlFor|type|role|rel|href|target|method|action|encType|accept|pattern|placeholder)$', flags: 'i' } },
          // ARIA attributes
          { regex: { pattern: '^aria-[\\w-]+$', flags: 'i' } },
          // Data attributes
          { regex: { pattern: '^data-[\\w-]+$', flags: 'i' } },
          // SVG attributes
          { regex: { pattern: '^(xmlns|viewBox|fill|stroke|strokeWidth|strokeLinecap|strokeLinejoin|fillRule|clipRule|d|cx|cy|r|x|y|dx|dy|width|height|points|transform|gradientTransform|patternTransform|spreadMethod|offset|stop-color|stop-opacity|markerStart|markerMid|markerEnd|preserveAspectRatio)$', flags: 'i' } },
          // CSS properties (generic patterns)
          { regex: { pattern: '^(margin|padding|border|background|color|font|text|display|position|flex|grid|transform|transition|animation|outline|listStyle|content|quotes|counter|tableLayout|captionSide|emptyCells|speak|direction|unicodeBidi)', flags: 'i' } },
          { regex: { pattern: '^(width|height|top|right|bottom|left|zIndex|overflow|clip|clear|cursor|pointerEvents|userSelect|opacity|visibility)$', flags: 'i' } },
          // Chart and visualization properties
          { regex: { pattern: '^(dataKey|nameKey|valueKey|name|domain|range|tickCount|interval|angle|textAnchor|tickMargin|verticalAlign|align|layout|margin|isAnimationActive|fill|stroke|strokeWidth|strokeDasharray|strokeLinecap|strokeLinejoin|opacity|fillOpacity|strokeOpacity)$', flags: 'i' } },
          // MUI specific
          { regex: { pattern: '^(sx|classes|slotProps)$', flags: 'i' } },
          // Testing
          { regex: { pattern: '^test(id)?$', flags: 'i' } },
        ],
        // Ignore function calls
        ignoreFunctions: [
          // Lingui functions
          't', '_', 'defineMessage', 'i18n.t', 'i18n._',
          // Console methods
          'console.log', 'console.warn', 'console.error', 'console.info', 'console.debug',
          // Error constructors
          'Error',
          // Styling functions
          'styled', 'css', 'keyframes',
          // React functions
          'createElement',
          // Custom functions that commonly use non-translatable strings
          'toastOptions', 'workerUrl',
        ],
        // Ignore method calls on specific types
        ignoreMethodsOnTypes: [
          'Map.get', 'Map.has', 'Map.set',
          'Set.has', 'Set.add',
          'WeakMap.get', 'WeakMap.has', 'WeakSet.has',
          'URLSearchParams.get', 'URLSearchParams.has', 'URLSearchParams.set',
          'Date.getFullYear', 'Date.getMonth', 'Date.getDate', 'Date.getHours', 'Date.getMinutes', 'Date.getSeconds',
          'Object.keys', 'Object.values', 'Object.entries', 'Object.hasOwnProperty',
        ],
      },
    ],
    'lingui/t-call-in-function': 'warn',
    'lingui/no-single-variables-to-translate': 'warn',
    'lingui/no-expression-in-message': 'warn',
    'lingui/no-single-tag-to-translate': 'warn',
    'lingui/no-trans-inside-trans': 'warn',
    'lingui/text-restrictions': 'off',
    '@team-monite/lingui-require-argument-for-t-function': 'warn',
  },
  overrides: [
    {
      files: [
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.spec.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
        '**/mocks/**/*',
        'src/mocks/**/*',
        '**/*Fixture.{ts,tsx,js,jsx}',
        '**/*Fixtures.{ts,tsx,js,jsx}',
        '**/*fixture.{ts,tsx,js,jsx}',
        '**/*fixtures.{ts,tsx,js,jsx}',
        'vitest.config.{ts,mts,js,mjs}',
        'vite.config.{ts,js}',
        'vitest.setup.{ts,js}',
        'rollup.config.{ts,js,mjs}',
        'config/**/*',
        '**/test-utils.{ts,tsx,js,jsx}',
        '**/testUtils.{ts,tsx,js,jsx}',
        '**/TestHelpers.{ts,tsx,js,jsx}',
        '**/onboardingTestUtils.{ts,tsx,js,jsx}',
        '**/*Handlers.{ts,tsx,js,jsx}',
        '**/*handlers.{ts,tsx,js,jsx}',
        // Utility and development files
        '**/storybook-utils.{ts,tsx,js,jsx}',
        '**/test-utils-random.{ts,tsx,js,jsx}',
        '**/DateTimeFormatOptions.{ts,tsx,js,jsx}',
        'src/utils/**/*',
        'src/api/**/*',
        'src/core/i18n/**/*',
        // Type definition files
        '**/*.types.{ts,tsx}',
        '**/*Types.{ts,tsx}',
        '**/*.d.ts',
      ],
      rules: {
        '@team-monite/lingui-require-argument-for-t-function': 'off',
        'lingui/no-unlocalized-strings': 'off',
        'lingui/t-call-in-function': 'off',
        'lingui/no-single-variables-to-translate': 'off',
        'lingui/no-expression-in-message': 'off',
        'lingui/no-single-tag-to-translate': 'off',
        'lingui/no-trans-inside-trans': 'off',
        'lingui/text-restrictions': 'off',
      },
    },
    {
      files: ['src/ui/components/**/*.{ts,tsx}'],
      rules: {
        'lingui/no-unlocalized-strings': 'off',
      },
    },
    {
      files: ['**/icons/**/*.{ts,tsx}', '**/*Icon.{ts,tsx}', '**/*icon.{ts,tsx}'],
      rules: {
        'lingui/no-unlocalized-strings': 'off',
      },
    },
  ],
};
