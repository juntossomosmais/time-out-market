import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

import base from './base.mjs'

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
export default [
  ...base,
  {
    name: "@jsm/eslint-config/react",
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    ...reactHooks.configs.recommended,
    plugins: {
      react: react,
      "react-hooks": reactHooks,
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
      'react/react-in-jsx-scope': 1,
      'react/jsx-boolean-value': [2, 'always'],
    }
  }
]
