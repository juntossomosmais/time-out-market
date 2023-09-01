module.exports = {
  extends: ['./stylelint.config.js'],
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
          'at-root',
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'extend',
        ],
      },
    ],
  },
}
