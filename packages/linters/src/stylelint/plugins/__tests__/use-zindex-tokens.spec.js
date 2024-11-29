const stylelint = require('stylelint')

const { messages } = require('../use-zindex-tokens')

const validCss = '.class { z-index: var(--zindex-1); }'
const invalidCss = '.class { z-index: 10; }'
const invalidUnknownZIndexTokenValue = '.class { z-index: 180; }'

const config = {
  plugins: ['@juntossomosmais/linters/stylelint/plugins/use-zindex-tokens.js'],
  rules: {
    'plugin/use-zindex-tokens': true,
  },
}

describe('use-zindex-tokens rule', () => {
  it('should not working if plugin is not enabled', async () => {
    const result = await stylelint.lint({
      code: validCss,
      config: {
        plugins: [
          '@juntossomosmais/linters/stylelint/plugins/use-zindex-tokens.js',
        ],
        rules: { 'plugin/use-zindex-tokens': false },
      },
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should accepts valid CSS', async () => {
    const result = await stylelint.lint({
      code: validCss,
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should rejects invalid CSS', async () => {
    const result = await stylelint.lint({
      code: invalidCss,
      config,
    })

    expect(result.results[0].warnings).toHaveLength(1)
    expect(result.results[0].warnings[0].rule).toBe('plugin/use-zindex-tokens')
    expect(result.results[0].warnings[0].severity).toBe('error')
    expect(result.results[0].warnings[0].text).toBe(
      messages.useToken({ tokenName: 'zindex-10', tokenValue: '10' })
    )
  })

  it('should fix invalid CSS', async () => {
    const result = await stylelint.lint({
      code: invalidCss,
      config,
      fix: true,
    })

    expect(result.results[0].warnings).toHaveLength(0)
    expect(result.output).toBe('.class { z-index: var(--zindex-10); }')
  })

  it('should not fix invalid CSS with unknown static values', async () => {
    const result = await stylelint.lint({
      code: invalidUnknownZIndexTokenValue,
      config,
      fix: true,
    })

    expect(result.results[0].warnings).toHaveLength(1)
    expect(result.results[0].warnings[0].rule).toBe('plugin/use-zindex-tokens')
    expect(result.results[0].warnings[0].severity).toBe('error')
    expect(result.results[0].warnings[0].text).toBe(messages.noStaticValue)
  })

  it('should rejects invalid CSS random value', async () => {
    const result = await stylelint.lint({
      code: '.class { z-index: 15px; }',
      config,
    })

    expect(result.results[0].warnings).toHaveLength(1)
    expect(result.results[0].warnings[0].rule).toBe('plugin/use-zindex-tokens')
    expect(result.results[0].warnings[0].severity).toBe('error')
    expect(result.results[0].warnings[0].text).toBe(messages.noStaticValue)
  })

  it('should not report when prop is CSS custom property', async () => {
    const result = await stylelint.lint({
      code: '.class { --color: #fff; }',
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })
})
