import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      'text-to-canvas': path.resolve(__dirname, './src/lib/index.ts'),
    },
  },
});
