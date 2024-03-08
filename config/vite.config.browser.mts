//
// Browser library bundles
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
    sourcemap: true,
    lib: {
      entry: 'lib/index.ts',
      name: 'textToCanvas',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return `${pkgName}.esm.min.js`;
          case 'umd':
            return `${pkgName}.umd.min.js`;
          case 'cjs':
          case 'commonjs':
            return `${pkgName}.min.js`;
          default:
            throw new Error(`Unknown build format "${format}"`);
        }
      },
    },
  },
});
