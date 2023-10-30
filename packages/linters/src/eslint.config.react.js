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
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-uses-react': 'on',
    'react/react-in-jsx-scope': 'on',
    'react/jsx-boolean-value': ['error', 'always'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [...baseConfig.overrides],
}
