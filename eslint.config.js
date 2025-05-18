
// eslint.config.js
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
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    plugins: {
      import: {},
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages'],
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'max-len': ['error', { code: 100 }],
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 'off',
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
