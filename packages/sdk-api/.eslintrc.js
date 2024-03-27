module.exports = {
  extends: ['plugin:@team-monite/vanilla'],
  overrides: [
    {
      files: '*',
      rules: {
        'import/no-default-export': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              '{}': false,
            },
          },
        ],
      },
    },
    {
      files: ['src/mocks/**/*.{ts,tsx,jsx,jsx,cjx,mjs}'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
    {
      files: ['src/api/CancelablePromise.ts', 'src/api/request.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: [
        'src/api/CancelablePromise.ts',
        'src/api/request.ts',
        'src/api/ApiRequestOptions.ts',
        'src/api/ApiError.ts',
        'src/api/ApiResult.ts',
        'src/api/services/PaymentService.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
