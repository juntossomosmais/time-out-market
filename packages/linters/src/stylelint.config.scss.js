module.exports = {
  extends: ['./stylelint.config.js'],
  plugins: ['stylelint-scss'],
  customSyntax: 'postcss-scss',
  rules: {
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['map-merge'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'else',
          'use',
        ],
      },
    ],
  },
}
