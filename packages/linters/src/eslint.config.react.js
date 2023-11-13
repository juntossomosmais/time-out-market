const baseConfig = require('@juntossomosmais/linters/eslint.config.js')

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [...baseConfig.plugins, 'react', 'react-hooks'],
  rules: {
    ...baseConfig.rules,
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/jsx-uses-react': 1,
    'react/react-in-jsx-scope': 1,
    'react/jsx-boolean-value': [2, 'always'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [...baseConfig.overrides],
}
