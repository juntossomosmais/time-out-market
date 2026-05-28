import base from '../base.mjs'

describe('eslint-config/flat/base', () => {
  it('should export a non-empty array of flat configs', () => {
    expect(Array.isArray(base)).toBe(true)
    expect(base.length).toBeGreaterThan(0)
  })

  it('should declare a global ignores entry covering node_modules, dist, and .next', () => {
    const ignoresEntry = base.find((entry) => Array.isArray(entry.ignores))

    expect(ignoresEntry).toBeDefined()
    expect(ignoresEntry.ignores).toEqual(
      expect.arrayContaining([
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
      ])
    )
  })

  it('should expose the expected named configs', () => {
    const names = base.map((entry) => entry.name).filter(Boolean)

    expect(names).toEqual(
      expect.arrayContaining([
        '@eslint/js/recommended',
        '@jsm/eslint-config/imports',
        '@jsm/eslint-config/typescript',
        'sonarjs/recommended',
      ])
    )
  })

  it('should configure the typescript block for ts, tsx, mts, cts, and vue files', () => {
    const tsEntry = base.find(
      (entry) => entry.name === '@jsm/eslint-config/typescript'
    )

    expect(tsEntry).toBeDefined()
    expect(tsEntry.files).toEqual(
      expect.arrayContaining([
        '**/*.ts',
        '**/*.tsx',
        '**/*.mts',
        '**/*.cts',
        '**/*.vue',
      ])
    )
    expect(tsEntry.plugins).toHaveProperty('@typescript-eslint')
    expect(tsEntry.rules['@typescript-eslint/no-explicit-any']).toBe(2)
    expect(tsEntry.rules['@typescript-eslint/no-unused-vars']).toEqual([
      2,
      { varsIgnorePattern: '^h$' },
    ])
  })

  it('should pin the javascript block rules required by the guideline', () => {
    const jsEntry = base.find(
      (entry) => entry.name === '@eslint/js/recommended'
    )

    expect(jsEntry).toBeDefined()
    expect(jsEntry.rules.eqeqeq).toBe(2)
    expect(jsEntry.rules['no-console']).toBe(2)
    expect(jsEntry.rules['prefer-const']).toBe(2)
    expect(jsEntry.rules['object-curly-spacing']).toEqual(['error', 'always'])
    expect(jsEntry.languageOptions.ecmaVersion).toBe('latest')
    expect(jsEntry.languageOptions.sourceType).toBe('module')
  })

  it('should sort imports asc and case-insensitive with newlines between groups', () => {
    const importsEntry = base.find(
      (entry) => entry.name === '@jsm/eslint-config/imports'
    )

    expect(importsEntry).toBeDefined()
    const [severity, options] = importsEntry.rules['import/order']

    expect(severity).toBe(2)
    expect(options['newlines-between']).toBe('always')
    expect(options.alphabetize).toEqual({
      order: 'asc',
      caseInsensitive: true,
    })
    expect(options.groups).toEqual([
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index',
    ])
  })

  it('should exclude spec and test files from the sonarjs block', () => {
    const sonarEntry = base.find((entry) => entry.name === 'sonarjs/recommended')

    expect(sonarEntry).toBeDefined()
    expect(sonarEntry.ignores).toEqual(
      expect.arrayContaining(['**/*.spec.*', '**/*.test.*'])
    )
  })
})
