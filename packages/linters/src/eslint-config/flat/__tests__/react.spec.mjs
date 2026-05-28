import { Linter } from 'eslint'

import base from '../base.mjs'
import react from '../react.mjs'

describe('eslint-config/flat/react', () => {
  // Regression: eslint-plugin-react-hooks v6 changed `configs.recommended` to
  // an array, which the previous spread injected as numeric keys, breaking
  // ESLint v10 with `ConfigError: Unexpected key "0"`. v7 changed it again
  // to a nested `configs.flat.recommended`. This test runs the actual ESLint
  // engine so future shape changes surface as a test failure, not in a
  // consumer repo.
  it('should be accepted by the ESLint engine without ConfigError', () => {
    const linter = new Linter({ configType: 'flat' })

    expect(() =>
      linter.verify(
        'const Foo = () => null\nexport default Foo\n',
        react,
        { filename: 'foo.tsx' }
      )
    ).not.toThrow()
  })

  it('should export a non-empty array of flat configs', () => {
    expect(Array.isArray(react)).toBe(true)
    expect(react.length).toBeGreaterThan(0)
  })

  it('should compose every base entry before adding the react block', () => {
    expect(react.length).toBe(base.length + 1)
    base.forEach((entry, index) => {
      expect(react[index]).toBe(entry)
    })
  })

  it('should expose a named react block with react and react-hooks plugins', () => {
    const reactEntry = react.find(
      (entry) => entry.name === '@jsm/eslint-config/react'
    )

    expect(reactEntry).toBeDefined()
    expect(reactEntry.plugins).toHaveProperty('react')
    expect(reactEntry.plugins).toHaveProperty('react-hooks')
  })

  it('should enable jsx parsing in languageOptions', () => {
    const reactEntry = react.find(
      (entry) => entry.name === '@jsm/eslint-config/react'
    )

    expect(reactEntry.languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true)
  })

  it('should configure the rules required by the guideline', () => {
    const reactEntry = react.find(
      (entry) => entry.name === '@jsm/eslint-config/react'
    )

    expect(reactEntry.rules['react/display-name']).toBe(0)
    expect(reactEntry.rules['react/prop-types']).toBe(0)
    expect(reactEntry.rules['react/no-unescaped-entities']).toBe(0)
    expect(reactEntry.rules['react/jsx-uses-react']).toBe(1)
    expect(reactEntry.rules['react/react-in-jsx-scope']).toBe(0)
    expect(reactEntry.rules['react/jsx-boolean-value']).toEqual([2, 'always'])
  })
})
