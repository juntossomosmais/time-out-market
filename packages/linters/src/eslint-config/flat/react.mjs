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
    // Only `rules` needs an explicit merge today: none of the spread configs
    // defines `settings`, and the `languageOptions` below already restates the
    // only thing they contribute. If a future plugin release adds a `settings`
    // key, it needs the same explicit merge as `rules`.
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
    // The spreads above also carry a `rules` key each, and a later key wins in
    // an object literal, so the recommended rule sets are merged explicitly
    // here instead of being silently replaced by the overrides below.
    rules: {
      ...react.configs.flat.recommended.rules,
      ...(react.configs.flat['jsx-runtime']?.rules ?? {}),
      ...(reactHooksBlock.rules ?? {}),
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
