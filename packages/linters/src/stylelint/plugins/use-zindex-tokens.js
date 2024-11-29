const tokens = require('@juntossomosmais/atomium-tokens/tokens.json')
const stylelint = require('stylelint')

const ruleName = 'plugin/use-zindex-tokens'
const messages = stylelint.utils.ruleMessages(ruleName, {
  useToken: ({ tokenName, tokenValue }) =>
    `Use ${tokenName} instead of ${tokenValue} for z-index values.`,
  noStaticValue: 'Avoid using static values for z-index. Use a token instead.',
})
const meta = {
  docs: {
    description:
      'Enforce the use of z-index tokens instead of hardcoded values.',
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
        if (decl.prop !== 'z-index') return

        const zIndexValue = parseInt(decl.value, 10)

        if (!isNaN(zIndexValue)) {
          const tokenName = Object.keys(tokens).find(
            (key) =>
              tokens[key] === String(zIndexValue) ||
              tokens[key] === `var(${zIndexValue})`
          )

          if (tokenName) {
            const fix = () => {
              decl.value = `var(--${tokenName})`
            }

            if (context.fix) {
              fix()

              return
            }

            stylelint.utils.report({
              message: messages.useToken({
                tokenName,
                tokenValue: tokens[tokenName],
              }),
              node: decl,
              result,
              ruleName,
            })
          } else {
            stylelint.utils.report({
              message: messages.noStaticValue,
              node: decl,
              result,
              ruleName,
            })
          }
        }
      })
    }
  }
)

module.exports.ruleName = ruleName
module.exports.messages = messages
module.exports.meta = meta
