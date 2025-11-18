import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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
