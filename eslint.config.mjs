//
// ROOT ESLint Configuration
//

/* eslint-env node */

import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const ecmaVersion = 'latest';
const impliedStrict = true;
const tsconfigRootDir = import.meta.dirname;

//
// Plugins
//

// Plugins that apply to ALL envs
const basePlugins = {};

const importPluginSettings = {
  'import/resolver': {
    node: {
      extensions: [
        '.js',
        '.jsx',
        '.cts',
        '.mjs',
        '.ts',
        '.tsx',
        '.cts',
        '.mts',
      ],
      moduleDirectory: ['node_modules', 'src/', 'build/'],
    },
    typescript: {
      alwaysTryTypes: true,
    },
  },
};

//
// Globals
//

// Globals that apply to ALL envs
const baseGlobals = {
  // anything in addition to what `languageOptions.ecmaVersion` provides
  // @see https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
};

// Globals for repo tooling scripts
const toolingGlobals = {
  ...globals.node,
};

// Globals for browser-based source code
const browserGlobals = {
  ...globals.browser,
};

// Globals for test files
const testGlobals = {
  // `globals.browser` defines this global but it's also part of the `testing-library`
  //  API so needs to be overwritable to avoid ESLint's `no-redeclare` rule
  screen: 'off',
};

// Globals for BUNDLED (Webpack, Rollup, etc) source code
// NOTE: these must also be defined in (a future) <repo>/src/globals.d.ts, which would need to
//  be referenced in the <repo>/tsconfig.json, as well as the `globals` property in
//  (a future) <repo>/jest.config.mjs
const bundlerGlobals = {};

//
// Base rules
// @see http://eslint.org/docs/rules/RULE-NAME
//

const baseRules = {
  ...js.configs.recommended.rules,
  'no-regex-spaces': 'off',
  'no-await-in-loop': 'error',
  'no-async-promise-executor': 'error',
  'no-misleading-character-class': 'error',
  'no-unsafe-optional-chaining': 'error',

  //// Best practices

  curly: 'error',
  'default-case': 'error',
  eqeqeq: 'error',
  'guard-for-in': 'error',
  'no-alert': 'error',
  'no-caller': 'error',
  'no-console': 'error',
  'no-else-return': 'error',
  'no-eq-null': 'error',
  'no-eval': 'error',
  'no-lone-blocks': 'error',
  'no-loop-func': 'error',
  'no-multi-spaces': 'error',
  'no-new': 'off',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-throw-literal': 'error',
  'no-warning-comments': [
    'error',
    {
      terms: ['DEBUG', 'FIXME', 'HACK'],
      location: 'start',
    },
  ],

  //// Strict mode

  strict: ['error', 'function'],

  //// Variables

  'no-catch-shadow': 'error',
  'no-shadow': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      vars: 'local',
    },
  ],
  'no-use-before-define': 'error',

  //// Stylistic issues

  // NONE: Prettier will take care of these by reformatting the code on commit,
  //  save a few exceptions.

  // Prettier will format using single quotes per .prettierrc.js settings, but
  //  will not require single quotes instead of backticks/template strings
  //  when interpolation isn't used, so this rule will catch those cases
  quotes: [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: false,
    },
  ],

  //// ECMAScript 6 (non-stylistic issues only)

  'no-duplicate-imports': ['error', { includeExports: true }],
  'no-useless-constructor': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
};

//
// Vue-specific rules
//

const vueRules = {
  ...vue.configs.base.rules,
  ...vue.configs['vue3-essential'].rules,
  ...vue.configs['vue3-recommended'].rules,
  ...vue.configs['vue3-strongly-recommended'].rules,

  'vue/html-self-closing': [
    'error',
    {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    },
  ],
  'vue/attributes-order': 'off',
  'vue/comment-directive': 'off',
};

//
// TypeScript-specific rules
//

const typescriptRules = {
  ...typescript.configs['recommended-type-checked'].rules,

  // AFTER TypeScript rules to turn off `import` rules that TypeScript covers
  ...importPlugin.flatConfigs.typescript.rules,
};

//
// Test-specific rules
//

const testRules = {
  // no tests at the moment
};

//
// Config generators
//

/**
 * Project scripts.
 * @param {boolean} isModule
 * @param {boolean} isTypescript Ignored if `isModule=false`
 * @returns {Object} ESLint config.
 */
const createToolingConfig = (isModule = true, isTypescript = false) => ({
  files: isModule
    ? isTypescript
      ? ['**/*.{ts,mts}']
      : ['**/*.{js,mjs}']
    : ['**/*.{js,cjs}'],
  ignores: ['src/**/*.*'],
  plugins: {
    ...basePlugins,
    ...(isModule ? { import: importPlugin } : {}),
    ...(isTypescript ? { '@typescript-eslint': typescript } : {}),
  },
  languageOptions: {
    ecmaVersion,
    ...(isTypescript ? { parser: typescriptParser } : {}), // default to espree parser
    parserOptions: {
      sourceType: isModule ? 'module' : 'script',
      ...(isModule && isTypescript
        ? {
            project: true,
            tsconfigRootDir,
          }
        : {}),
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...toolingGlobals,
    },
  },
  settings: {
    ...(isModule ? importPluginSettings : {}),
  },
  rules: {
    ...baseRules,
    ...(isModule ? importPlugin.flatConfigs.recommended.rules : {}), // BEFORE TypeScript rules
    ...(isModule && isTypescript ? typescriptRules : {}),
    'no-console': 'off', // OK in repo scripts
  },
});

/**
 * JavaScript source files.
 *
 * Docs are untyped because typescript-eslint plugin appears to have a bug where it doesn't
 *  recognize that .vue files are included in the tsconfig.json even when they are (if they
 *  were, that is)
 * @see https://stackoverflow.com/questions/64051706/eslint-doesnt-believe-that-ive-included-vue-files-in-my-tsconfig
 * @returns ESLint config.
 */
const createSourceJSConfig = () => ({
  files: ['src/**/*.js'],
  plugins: {
    ...basePlugins,
    import: importPlugin,
  },
  languageOptions: {
    ecmaVersion,
    parserOptions: {
      // default espree parser
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals,
      ...browserGlobals,
    },
  },
  settings: {
    ...importPluginSettings,
  },
  rules: {
    ...baseRules,
    ...importPlugin.flatConfigs.recommended.rules,
  },
});

const createSourceTSConfig = () => ({
  files: ['src/**/*.ts'],
  ignores: ['src/demos/**'],
  plugins: {
    ...basePlugins,
    import: importPlugin,
    '@typescript-eslint': typescript,
  },
  languageOptions: {
    ecmaVersion,
    parser: typescriptParser,
    parserOptions: {
      project: true,
      tsconfigRootDir,
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals,
      ...browserGlobals,
    },
  },
  settings: {
    ...importPluginSettings,
  },
  rules: {
    ...baseRules,
    ...importPlugin.flatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...typescriptRules,
  },
});

// NOTE: Vue <script> blocks are NOT typed in large part due to this error which is just not
//  worth the time/effort to fix for a simple demo app that's easily testable by hand
// @see https://stackoverflow.com/questions/64051706/eslint-doesnt-believe-that-ive-included-vue-files-in-my-tsconfig
const createSourceVueConfig = () => ({
  files: ['src/**/*.vue'],
  plugins: {
    ...basePlugins,
    import: importPlugin,
    vue,
  },
  languageOptions: {
    ecmaVersion,
    parser: vueParser,
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals,
      ...browserGlobals,
    },
  },
  settings: {
    ...importPluginSettings,
  },
  rules: {
    ...baseRules,
    ...importPlugin.flatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...vueRules,
  },
});

const createDemoTSConfig = () => ({
  files: ['src/demos/**/*.{ts,mts}'],
  plugins: {
    ...basePlugins,
    import: importPlugin,
    '@typescript-eslint': typescript,
  },
  languageOptions: {
    ecmaVersion,
    parser: typescriptParser,
    parserOptions: {
      project: true,
      tsconfigRootDir,
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: false,
      },
    },
    globals: {
      ...baseGlobals,
      ...globals.node,
    },
  },
  settings: {
    ...importPluginSettings,
  },
  rules: {
    ...baseRules,
    ...importPlugin.flatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...typescriptRules,
  },
});

const createTestConfig = (isTypescript = false) => ({
  files: isTypescript
    ? ['src/**/__tests__/**/?(*.)+(spec|test).ts']
    : ['src/**/__tests__/**/?(*.)+(spec|test).js'],
  plugins: {
    ...basePlugins,
    import: importPlugin,
    ...(isTypescript ? { '@typescript-eslint': typescript } : {}),
  },
  languageOptions: {
    ecmaVersion,
    ...(isTypescript ? { parser: typescriptParser } : {}), // default to espree parser
    parserOptions: {
      ...(isTypescript
        ? {
            project: true,
            tsconfigRootDir,
          }
        : {}),
      sourceType: 'module',
      ecmaFeatures: {
        impliedStrict,
        jsx: true,
      },
    },
    globals: {
      ...baseGlobals,
      ...bundlerGlobals, // because tests execute code that also gets bundled
      ...browserGlobals,
      ...testGlobals,
    },
  },
  settings: {
    ...importPluginSettings,
  },
  rules: {
    ...baseRules,
    ...importPlugin.flatConfigs.recommended.rules, // BEFORE TypeScript rules
    ...(isTypescript ? typescriptRules : {}),
    ...testRules,
  },
});

export default [
  // Ignores
  {
    ignores: [
      // third-party
      '**/node_modules/',
      // build output
      'dist/**',
      'dist-docs/**',
      // test output
      'coverage/**',
    ],
  },

  // Tooling Configs
  createToolingConfig(false), // CJS scripts
  createToolingConfig(true), // ESM scripts
  createToolingConfig(true, true), // TS scripts

  // Source Configs
  createSourceJSConfig(),
  createSourceTSConfig(),
  createSourceVueConfig(),

  // Demo Configs
  createDemoTSConfig(),

  // Test Configs
  createTestConfig(), // JS tests
  createTestConfig(true), // TS tests

  // Prettier
  // ALWAYS LAST: disable style rules that conflict with prettier
  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  {
    plugins: {
      prettier,
    },
    rules: prettier.rules,
  },
];
