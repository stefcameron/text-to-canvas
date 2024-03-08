//
// Docs app
//

import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  root: 'src/docs',
  resolve: {
    alias: [
      {
        find: 'text-to-canvas',
        replacement: path.resolve(__dirname, '../src/lib/index.ts'),
      },
    ],
  },
  build: {
    outDir: '../../dist-docs',
    emptyOutDir: true,
  },
});
