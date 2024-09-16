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
    'at-rule-no-unknown': null
  },
}
