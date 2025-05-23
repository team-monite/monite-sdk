import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    // You might need a setupFile here if you have global test setup
    // setupFiles: 'vitest.setup.ts',
  },
  // If you use path aliases like @/ in this project, configure them here
  // resolve: {
  //   alias: {
  //     '@/': path.resolve(__dirname, 'src'),
  //   },
  // },
});
