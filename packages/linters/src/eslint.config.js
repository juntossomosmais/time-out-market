module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['import', 'sonarjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    eqeqeq: 'error',
    'no-inline-comments': 'error',
    'no-async-promise-executor': 'error',
    'no-console': 'error',
    'no-prototype-builtins': 'error',
    'no-self-assign': 'error',
    'no-unreachable': 'error',
    'no-useless-escape': 'off',
    'prefer-const': 'error',
    'padding-line-between-statements': [
      'error',
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
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroupsExcludedImportTypes: ['react', 'vue'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      plugins: ['@typescript-eslint/eslint-plugin'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      parser: '@typescript-eslint/parser',
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '^h$',
          },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
  ],
}
