const { messages } = require('../use-font-letter-spacing')
const stylelint = require('stylelint')

const validCss = '.class { font: 16px Arial; letter-spacing: 1px; }'
const invalidCss = '.class { font: 16px Arial; }'

const config = {
  plugins: [
    '@juntossomosmais/linters/stylelint/plugins/use-font-letter-spacing.js',
  ],
  rules: {
    'plugin/use-font-letter-spacing': true,
  },
}

describe('font-letter-spacing rule', () => {
  it('should accepts valid CSS', async () => {
    const result = await stylelint.lint({
      code: validCss,
      config,
    })

    expect(result.results[0].warnings).toHaveLength(0)
  })

  it('should not working if plugin is not enabled', async () => {
    const result = await stylelint.lint({
      code: invalidCss,
      config: {
        plugins: [
          '@juntossomosmais/linters/stylelint/plugins/use-font-letter-spacing.js',
        ],
        rules: { 'plugin/use-font-letter-spacing': false },
      },
    })
  })

  it('should rejects invalid CSS', async () => {
    const result = await stylelint.lint({
      code: invalidCss,
      config,
    })

    expect(result.results[0].warnings).toHaveLength(1)
    expect(result.results[0].warnings[0].rule).toBe(
      'plugin/use-font-letter-spacing'
    )
    expect(result.results[0].warnings[0].severity).toBe('error')
    expect(result.results[0].warnings[0].text).toBe(
      messages.missingLetterSpacing
    )
    expect(result.results[0].warnings[0].line).toBe(1)
    expect(result.results[0].warnings[0].column).toBe(10)
  })
})
