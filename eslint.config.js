// eslint.config.js - Compatible with ESLint v9

export default [
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: await import('eslint-plugin-import'),
    },
    rules: {
      // Core ESLint rules similar to airbnb-base
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'max-len': ['error', { code: 100 }],
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 'off',
      
      // Import rules
      'import/extensions': ['error', 'ignorePackages'],
      'import/no-duplicates': 'error',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    },
  },
];
