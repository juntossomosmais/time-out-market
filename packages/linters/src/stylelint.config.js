module.exports = {
  extends: ['stylelint-config-recommended'],
  plugins: ['stylelint-order', 'stylelint-scss'],
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
  },
}