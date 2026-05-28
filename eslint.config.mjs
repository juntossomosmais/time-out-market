import config from '@juntossomosmais/linters/eslint-config/flat/base.mjs'

export default [
  { ignores: ['**/build/**', '**/coverage/**', '**/*.d.ts'] },
  ...config,
  {
    // Self-lint does not need type-aware parsing: the shared base only enables
    // non-type-aware TS rules. Disabling `project` avoids requiring every file
    // in the monorepo to belong to a tsconfig.
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: { parserOptions: { project: false } },
  },
]
