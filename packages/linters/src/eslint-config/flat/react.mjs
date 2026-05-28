import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

import base from './base.mjs'

// eslint-plugin-react-hooks ships incompatible config shapes across majors.
// v7 exposes `configs.flat.recommended` (a flat-config object). v6 exposes
// `configs['flat/recommended']` (an array containing one flat block); spreading
// that array into an object literal injects numeric keys and breaks ESLint v10
// with `ConfigError: Unexpected key "0"`. v5 exposes `configs.recommended` as
// an eslintrc-style object with `plugins`/`rules`. Normalise to a single block.
const reactHooksFlatConfig =
  reactHooks.configs?.flat?.recommended ??
  reactHooks.configs?.['flat/recommended'] ??
  reactHooks.configs?.recommended ??
  {}
const reactHooksBlock = Array.isArray(reactHooksFlatConfig)
  ? (reactHooksFlatConfig[0] ?? {})
  : reactHooksFlatConfig

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
export default [
  ...base,
  {
    name: '@jsm/eslint-config/react',
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    ...reactHooksBlock,
    plugins: {
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/display-name': 0,
      'react/prop-types': 0,
      'react/no-unescaped-entities': 0,
      'react/jsx-uses-react': 1,
      // Off by default: modern JSX transform (React 17+, Next.js 12+) makes
      // the explicit React import unnecessary.
      'react/react-in-jsx-scope': 0,
      'react/jsx-boolean-value': [2, 'always'],
    },
  },
]
