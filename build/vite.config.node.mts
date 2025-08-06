//
// Node.js library bundles
//

import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const pkg: { name: string } = require(
  path.resolve(__dirname, '../package.json')
) as { name: string };
const pkgName = pkg.name;

export default defineConfig({
  root: 'src',
  build: {
    // @see // @see https://vitejs.dev/config/build-options.html#build-target
    target: 'node22', // should match package.json#engines.node minimum
    outDir: '../dist',
    emptyOutDir: false,
    sourcemap: false,
    minify: false,
    lib: {
      entry: 'lib/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return `${pkgName}.mjs`;
          case 'cjs':
          case 'commonjs':
            return `${pkgName}.cjs`;
          default:
            throw new Error(`Unknown build format "${format}"`);
        }
      },
    },
  },
});
