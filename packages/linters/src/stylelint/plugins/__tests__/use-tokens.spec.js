const stylelint = require('stylelint')

const { messages } = require('../use-tokens')

const validCss = '.class { color: var(--color-primary); }'
const invalidCss = '.class { color: #fff; }'

const config = {
  plugins: ['@juntossomosmais/linters/stylelint/plugins/use-tokens.js'],
  rules: {
    'plugin/use-tokens': true,
  },
}

describe('use-tokens rule', () => {
  it('should not working if plugin is not enabled', async () => {
    const result = await stylelint.lint({
      code: validCss,
      config: {
        plugins: ['@juntossomosmais/linters/stylelint/plugins/use-tokens.js'],
        rules: { 'plugin/use-tokens': false },
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
    expect(result.results[0].warnings[0].rule).toBe('plugin/use-tokens')
    expect(result.results[0].warnings[0].severity).toBe('error')
    expect(result.results[0].warnings[0].line).toBe(1)
    expect(result.results[0].warnings[0].column).toBe(10)
    expect(result.results[0].warnings[0].text).toBe(
      messages.useToken({
        tokenName: 'color-neutral-white',
        tokenValue: '#fff',
      })
    )
  })

  it('should not report custom properties', async () => {
    const result = await stylelint.lint({
      code: '.class { --color-primary: #000; }',
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should not report when prop is CSS custom property', async () => {
    const result = await stylelint.lint({
      code: '.class { --color: #fff; }',
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should not report when use zindex values as tokens', async () => {
    const result = await stylelint.lint({
      code: '.class { margin: 10; }',
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should not report when use border-radius values as tokens but reporting if match with spacing values', async () => {
    const result = await stylelint.lint({
      code: '.class { border-radius: 8px; }',
      config,
    })

    expect(result.results[0].warnings[0].text).not.toBe(
      messages.useToken({ tokenName: 'border-radius', tokenValue: '4px' })
    )
    expect(result.results[0].warnings[0].text).toBe(
      messages.useToken({ tokenName: 'spacing-xsmall', tokenValue: '8px' })
    )
  })
})
