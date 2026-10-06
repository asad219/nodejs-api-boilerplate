const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'logs/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Express error handlers must declare `next` even when unused
      'no-unused-vars': ['error', { argsIgnorePattern: '^_|^next$' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off',
    },
  },
  prettier,
];
