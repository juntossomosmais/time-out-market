module.exports = {
  extends: ['stylelint-config-recommended'],
  plugins: [
    'stylelint-order',
    '@juntossomosmais/linters/stylelint/plugins/use-font-letter-spacing.js',
    '@juntossomosmais/linters/stylelint/plugins/use-tokens.js',
    '@juntossomosmais/linters/stylelint/plugins/use-zindex-tokens.js',
  ],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
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
    'plugin/use-font-letter-spacing': true,
    'plugin/use-tokens': true,
    'plugin/use-zindex-tokens': true,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['/^v-deep/'],
      },
    ],
    'declaration-block-single-line-max-declarations': 1,
    'length-zero-no-unit': true,
  },
}
