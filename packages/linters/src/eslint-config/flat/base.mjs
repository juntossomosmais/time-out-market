import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ["**/node_modules/**", "dist/"] },

  // JavaScript config
  {
    name: '@jsm/eslint-config/javascript',
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      eqeqeq: 2,
      'object-curly-spacing': ['error', 'always'],
      'no-inline-comments': 2,
      'no-async-promise-executor': 2,
      'no-console': 2,
      'no-prototype-builtins': 2,
      'no-self-assign': 2,
      'no-unreachable': 2,
      'no-useless-escape': 0,
      'prefer-const': 2,
      'padding-line-between-statements': [
        2,
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
      ],
    }
  },
]
