//
// Node.js library bundles
//

import path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const pkg: { name: string } = require(
  path.resolve(import.meta.dirname, '../package.json')
) as { name: string };
const pkgName = pkg.name;

export default defineConfig({
  root: 'src',
  build: {
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
