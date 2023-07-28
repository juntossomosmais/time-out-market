const stylelint = require('stylelint')

const ruleName = 'plugin/use-font-letter-spacing'
const messages = stylelint.utils.ruleMessages(ruleName, {
  missingLetterSpacing:
    'When using font, letter-spacing is required. Read more: https://github.com/juntossomosmais/frontend-guideline',
})

const meta = {
  docs: {
    description: 'Enforce the use of letter-spacing when font is used.',
    category: 'Best Practices',
    recommended: true,
  },
  fixable: null,
  schema: [],
}

module.exports = stylelint.createPlugin(ruleName, (primaryOption) => {
  return function (root, result) {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
    })

    if (!validOptions) return

    root.walkDecls((decl) => {
      if (decl.prop === 'font') {
        const hasLetterSpacing = decl.parent.some(
          (sibling) => sibling.prop === 'letter-spacing'
        )

        if (!hasLetterSpacing) {
          stylelint.utils.report({
            message: messages.missingLetterSpacing,
            node: decl,
            result,
            ruleName,
          })
        }
      }
    })
  }
})

module.exports.ruleName = ruleName
module.exports.messages = messages
module.exports.meta = meta
