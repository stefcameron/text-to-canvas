//
// Browser library bundles
//

import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import { esmBrowserTargets } from './build-util.mjs';

const __dirname = path.basename(url.fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const pkg: { name: string } = require(
  path.resolve(__dirname, '../package.json')
) as { name: string };
const pkgName = pkg.name;

export default defineConfig({
  root: 'src',
  build: {
    // @see https://vitejs.dev/config/build-options.html#build-target
    // would be nice to make it es2020 but that means a lot of newer features
    //  like dynamic imports, `import.meta`, nullish coalescing and optional
    //  chaining operators, etc, that tend to not be supported in older bundlers
    target: ['es2019', ...esmBrowserTargets],
    outDir: '../dist',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: 'lib/index.ts',
      name: 'textToCanvas',
      formats: ['cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
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
