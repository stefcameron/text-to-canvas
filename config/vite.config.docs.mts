//
// Docs app
//

import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { esmBrowserTargets } from './build-util.mjs';

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
  base: '/text-to-canvas/', // ultimately deployed to https://stefcameron.github.io/text-to-canvas/
  build: {
    // @see https://vitejs.dev/config/build-options.html#build-target
    // ES2020 is first version with dynamic import and `import.meta`, in particular
    target: ['es2020', ...esmBrowserTargets],
    outDir: '../../dist-docs',
    emptyOutDir: true,
  },
});
