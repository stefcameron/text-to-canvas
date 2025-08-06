//
// Browser library bundles
//

import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import { esmBrowserTargets } from './build-util.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const pkg: { name: string } = require(
  path.resolve(__dirname, '../package.json')
) as { name: string };
const pkgName = pkg.name;

export default defineConfig({
  root: 'src',
  build: {
    // @see https://vitejs.dev/config/build-options.html#build-target
    // ES2020 is first version with dynamic import and `import.meta`, in particular
    // ES2022 supports `Array.at()`
    target: ['es2022', ...esmBrowserTargets],
    outDir: '../dist',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: 'lib/index.ts',
      name: 'textToCanvas',
      formats: ['es'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return `${pkgName}.esm.min.js`;
          default:
            throw new Error(`Unknown build format "${format}"`);
        }
      },
    },
  },
});
