import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [
        './tsconfig.json',
        '../../examples/with-nextjs-and-clerk-auth/tsconfig.json',
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'vitest.setup.ts',
  },
  ssr: {
    noExternal: ['vite-tsconfig-paths'],
  },
});
