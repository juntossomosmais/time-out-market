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

// Pre-compute filtered token list and pre-compile regexes once at module load.
// This avoids re-creating RegExp objects and re-filtering on every CSS declaration.
const specificTokens = ['zindex', 'border-radius']
const compiledTokenChecks = Object.entries(tokens)
  .filter(
    ([tokenName]) =>
      !specificTokens.some((segment) => tokenName.includes(segment))
  )
  .map(([tokenName, tokenValue]) => {
    const alias = tokens[tokenValue]
    const valuePattern = alias ? `${tokenValue}|#${alias}` : tokenValue
    const pattern = `(^|\\s)(${valuePattern})(\\s|;|$)`

    return {
      tokenName,
      tokenValue,
      testRegex: new RegExp(pattern),
      replaceRegex: new RegExp(pattern, 'g'),
    }
  })

/**
 * @type {import('stylelint').Rule}
 */
const ruleFunction = (primaryOption) => {
  return function (root, result) {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
    })

    if (!validOptions) return

    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) return

      for (const {
        tokenName,
        tokenValue,
        testRegex,
        replaceRegex,
      } of compiledTokenChecks) {
        if (testRegex.test(decl.value)) {
          stylelint.utils.report({
            message: messages.useToken({ tokenName, tokenValue }),
            node: decl,
            result,
            ruleName,
            fix: () => {
              decl.value = decl.value.replace(
                replaceRegex,
                `$1var(--${tokenName})$3`
              )
            },
          })
        }
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
