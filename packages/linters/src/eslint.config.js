module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true,
    es2021: true,
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
    eqeqeq: 2,
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
    'import/order': [
      2,
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
          2,
          {
            varsIgnorePattern: '^h$',
          },
        ],
        '@typescript-eslint/no-explicit-any': 2,
      },
    },
  ],
}
