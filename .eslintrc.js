//
// ROOT ESLint Configuration
//

/* eslint-env node */

// @see https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
const parserOptions = {
  ecmaFeatures: {
    impliedStrict: true,
  },
  ecmaVersion: 'latest', // probably overridden by `env.esXXXX` setting (docs are unclear)
  sourceType: 'module', // ESM
};

// for use with https://typescript-eslint.io/users/configs#projects-with-type-checking
// @see https://typescript-eslint.io/getting-started/typed-linting
const typedParserOptions = {
  ...parserOptions,
  project: true,
  tsconfigRootDir: __dirname,
};

// @see https://eslint.org/docs/latest/use/configure/language-options#specifying-environments
const env = {
  es2024: true, // automatically sets `parserOptions.ecmaVersion` parser option to 15
  node: true,
};

const browserEnv = {
  ...env,
  browser: true,
  node: false,
};

// for all JavaScript files
const jsExtends = [
  'eslint:recommended',

  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  'prettier', // ALWAYS LAST: disable style rules that conflict with prettier
];

// for all TypeScript files
const tsExtends = [
  'eslint:recommended',

  // @see https://typescript-eslint.io/users/configs#projects-with-type-checking
  'plugin:@typescript-eslint/recommended-type-checked',

  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  'prettier', // ALWAYS LAST: disable style rules that conflict with prettier
];

// for .vue files
const vueExtends = [
  'eslint:recommended',

  // @see https://eslint.vuejs.org/
  'plugin:vue/vue3-recommended',

  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  'prettier', // ALWAYS LAST: disable style rules that conflict with prettier
];

// for all JS files
const jsRules = {
  //
  // Rules: pull-in ESLint's recommended set, then tweak as necessary
  // @see http://eslint.org/docs/rules/&lt;rule-name>
  //

  //// possible errors

  'no-regex-spaces': 'off',
  'no-await-in-loop': 'error',
  'no-async-promise-executor': 'error',
  'no-misleading-character-class': 'error',
  'no-unsafe-optional-chaining': 'error',

  //// best practices

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
  'no-new': 'off', // OFF to allow `myFunction(new RegExp('foo'))`, for example
  'no-new-func': 'error', // disallow `new Function(...)` to declare a new function
  'no-new-wrappers': 'error', // disallow `new Number/String/Boolean()`
  'no-throw-literal': 'error',
  'no-warning-comments': [
    'error',
    {
      terms: ['DEBUG', 'FIXME', 'HACK'],
      location: 'start',
    },
  ],

  //// strict mode

  strict: ['error', 'function'],

  //// variables

  'no-catch-shadow': 'error',
  'no-shadow': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      vars: 'local', // allow unused globals because they're often AppsScript hooks/triggers like `onOpen`
    },
  ],
  'no-use-before-define': 'error',

  //// stylistic issues

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
  'prefer-arrow-callback': 'off',
  'prefer-const': 'error',
};

// for TypeScript modules
const tsRules = {
  ...jsRules,
};

// for modules with typed Vue code
const vueRules = {
  ...tsRules,

  //// ESLint Vue plugin

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
};

module.exports = {
  root: true,
  overrides: [
    // project JavaScript files (tooling, etc.)
    {
      files: ['**/*.js'],
      excludedFiles: ['src/**/*.*'],
      extends: jsExtends,
      parserOptions: {
        ...parserOptions,
        sourceType: 'script', // CJS
      },
      env,
      rules: {
        ...jsRules,
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.mjs'],
      excludedFiles: ['src/**/*.*'],
      extends: jsExtends,
      parserOptions,
      env,
      rules: {
        ...jsRules,
        'no-console': 'off',
      },
    },

    // project TypeScript files (tooling, etc.)
    {
      files: ['**/*.ts'],
      excludedFiles: ['src/**/*.*'],
      extends: tsExtends,
      parserOptions: {
        ...typedParserOptions,
        sourceType: 'script', // CJS
      },
      env,
      rules: {
        ...tsRules,
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.mts'],
      excludedFiles: ['src/**/*.*'],
      extends: tsExtends,
      parserOptions: typedParserOptions,
      env,
      rules: {
        ...tsRules,
        'no-console': 'off',
      },
    },

    // TypeScript source files
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['src/demos/**'],

      // @see https://typescript-eslint.io/packages/eslint-plugin/
      plugins: ['@typescript-eslint'],

      extends: tsExtends,
      parser: '@typescript-eslint/parser',
      parserOptions: typedParserOptions,
      env: browserEnv,
      rules: tsRules,
    },

    // TypeScript node demo files
    {
      files: ['src/demos/**/*.{ts,mts}'],

      // @see https://typescript-eslint.io/packages/eslint-plugin/
      plugins: ['@typescript-eslint'],

      extends: tsExtends,
      parser: '@typescript-eslint/parser',
      parserOptions: typedParserOptions,
      env,
      rules: tsRules,
    },

    // TypeScript test files
    {
      // match any file with a suffix of .test, or .spec; and with .ts
      //  extension; and just test.<ext> or spec.<ext>; as long as the file is inside
      //  a __test__ directory at any depth within the base path
      files: ['src/**/__tests__/**/?(*.)+(spec|test).ts'],

      // @see https://typescript-eslint.io/packages/eslint-plugin/
      plugins: ['@typescript-eslint'],

      extends: tsExtends,
      parser: '@typescript-eslint/parser',
      parserOptions: typedParserOptions,
      env, // expected to be NodeJS for now
      rules: tsRules,
    },

    // JavaScript source files (docs are untyped because typescript-eslint plugin appears
    //  to have a bug where it doesn't recognize that .vue files are included in the tsconfig.json
    //  even when they are (if they were, that is)
    // @see https://stackoverflow.com/questions/64051706/eslint-doesnt-believe-that-ive-included-vue-files-in-my-tsconfig
    {
      files: ['src/**/*.js'],
      extends: jsExtends,
      parserOptions,
      env: browserEnv,
      rules: tsRules,
    },

    // Vue source files
    // @see https://eslint.vuejs.org/user-guide
    {
      files: ['src/**/*.vue'],
      extends: vueExtends,
      parser: 'vue-eslint-parser',
      parserOptions,
      env: browserEnv,
      rules: vueRules,
    },
  ],
};
