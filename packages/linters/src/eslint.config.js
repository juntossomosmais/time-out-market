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
