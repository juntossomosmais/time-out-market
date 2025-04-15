import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"] },

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

  // Imports config
  {
    name: '@jsm/eslint-config/imports',
    plugins: { import: importPlugin },
    rules: {
      "import/order": [
        2,
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ["react", "vue"],
        }
      ]
    }
  },

  // TypeScript config
  ...tseslint.config({
    name: "@jsm/eslint-config/typescript",
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.vue'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    extends: [importPlugin.configs.typescript],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        2,
        { varsIgnorePattern: "^h$", }
      ],
      "@typescript-eslint/no-explicit-any": 2,
    }
  }),

  // Prettier config
  eslintConfigPrettier,

  // SonarJS config
  {
    name: '@jsm/eslint-config/sonarjs',
    ignores: ['**/*.spec.*', '**/*.test.*'],
    ...sonarjs.configs.recommended,
  }
]
