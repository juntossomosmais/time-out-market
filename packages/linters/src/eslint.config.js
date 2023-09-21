module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['import', 'sonarjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    eqeqeq: 'error',
    'no-async-promise-executor': 'error',
    'no-console': 'error',
    'no-prototype-builtins': 'error',
    'no-self-assign': 'error',
    'no-unreachable': 'error',
    'no-useless-escape': 'error',
    'prefer-const': 'error',
    semi: ['error', 'never'],
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
        pathGroups: [
          {
            group: 'external',
            pattern: 'react',
            position: 'before',
          },
          {
            group: 'internal',
            pattern: '~/**',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'vue'],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        'babel-plugin-root-import': [
          {
            rootPathSuffix: './src',
            rootPathPrefix: '~/',
          },
        ],
      },
    },
  },
  overrides: [
    {
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
      rules: {},
    },
    {
      files: ['**/*.ts?(x)'],
      plugins: ['@typescript-eslint/eslint-plugin'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
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
