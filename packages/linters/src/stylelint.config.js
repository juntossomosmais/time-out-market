module.exports = {
  extends: ['stylelint-config-recommended'],
  plugins: [
    'stylelint-order',
    'stylelint-scss',
    '@juntossomosmais/linters/stylelint/plugins/use-font-letter-spacing.js',
    '@juntossomosmais/linters/stylelint/plugins/use-tokens.js',
  ],
  customSyntax: 'postcss-scss',
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': true,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        ignore: ['first-nested'],
      },
    ],
    'selector-type-no-unknown': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['map-merge'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'extend', 'mixin'],
      },
    ],
    'plugin/use-font-letter-spacing': true,
    'plugin/use-tokens': true,
  },
}
