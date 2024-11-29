const tokens = require('@juntossomosmais/atomium-tokens/tokens.json')
const stylelint = require('stylelint')

const ruleName = 'plugin/use-tokens'
const messages = stylelint.utils.ruleMessages(ruleName, {
  useToken: ({ tokenName, tokenValue }) =>
    `Avoid using ${tokenValue} directly. Use var(--${tokenName}) instead. Read more: https://github.com/juntossomosmais/frontend-guideline`,
})

/**
 * @type {import('stylelint').RuleMeta}
 */
const meta = {
  docs: {
    description: 'Disallow the use of static values in favor of design tokens.',
    category: 'Best Practices',
    recommended: true,
  },
  fixable: true,
  schema: [],
}

module.exports = stylelint.createPlugin(
  ruleName,
  (primaryOption, _, context) => {
    return function (root, result) {
      const validOptions = stylelint.utils.validateOptions(result, ruleName, {
        actual: primaryOption,
      })

      if (!validOptions) return

      root.walkDecls((decl) => {
        if (decl.prop.startsWith('--')) return

        Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
          const specificTokens = ['zindex', 'border-radius']
          const isSpecificTokens = specificTokens.some((output) =>
            tokenName.includes(output)
          )

          const regexPattern = new RegExp(
            `(^|\\s)(${tokens[tokenName]}|#${
              tokens[tokens[tokenName]]
            })(\\s|;|$)`,
            'g'
          )

          if (!isSpecificTokens && regexPattern.test(decl.value)) {
            const fix = () => {
              decl.value = `var(--${tokenName})`
            }

            //TODO: in stylelint@16 should remove context.fix and pass `fix` callback to report function. https://stylelint.io/developer-guide/rules#context
            if (context.fix) {
              fix()

              return
            }

            stylelint.utils.report({
              message: messages.useToken({ tokenName, tokenValue }),
              node: decl,
              result,
              ruleName,
            })
          }
        })
      })
    }
  }
)

module.exports.ruleName = ruleName
module.exports.messages = messages
module.exports.meta = meta
