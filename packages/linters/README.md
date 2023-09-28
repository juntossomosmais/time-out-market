# Time Out Market - Linters

Set of linters configs to be used in our JavaScript projects.

## Shared linters

<!-- TOC -->
- [Commitlint](#commitlint)
- [Prettier](#prettier)
- [ESLint](#eslint)
  - [React](#react)
- [Stylelint](#stylelint)
  - [CSS](#css)
  - [SCSS](#scss)
  - [Styled Components](#styled-components)
<!-- /TOC -->

## Installation

First you need to install peer dependencies:

```bash
npm i -D @commitlint/cli @commitlint/config-conventional prettier postcss stylelint stylelint-config-recommended stylelint-order eslint eslint-import-resolver-typescript eslint-import-resolver-babel-plugin-root-import eslint-plugin-import eslint-plugin-sonarjs @typescript-eslint/eslint-plugin @typescript-eslint/parser

npm i @juntossomosmais/atomium-tokens
```

Then install the linters package:

```bash
npm i -D @juntossomosmais/linters
```

## Usage

### Commitlint

Create a [`commitlint`](https://commitlint.js.org/) file in the root of your project with the following content:

```js
module.exports = {
  extends: ['@juntossomosmais/linters/commitlint.config.js'],
}
```

### Prettier

Create a [`prettier`](https://prettier.io/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/prettier.config.js'),
  // Your custom config here
}
```

### ESLint

Create a [`eslint`](https://eslint.org/) file in the root of your project with the following content:

```js
const baseConfig = require('@juntossomosmais/linters/eslint.config.js')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // Your custom rules here
  },
  // Your another custom config here
}
```

If you are using custom groups of `import/order` rules, you can use the following configs example:

```js
const baseConfig = require('@juntossomosmais/linters/eslint.config.js')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'import/order': [
      'error',
      {
        ...baseConfig.rules['import/order'][1],
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '~/**',
            group: 'internal',
          },
        ]
      },
    ],
  },
  // Your another custom config here
}
```

#### React

Install the following peer dependencies:

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks
```

Create a [`eslint`](https://eslint.org/) file in the root of your project with the following content:

```js
const baseConfig = require('@juntossomosmais/linters/eslint.config.react.js')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // Your custom rules here
  },
  // Your another custom config here
}
```

### Stylelint

#### CSS

Create a [`stylelint`](https://stylelint.io/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/stylelint.config.js'),
}
```

#### SCSS

Install the following peer dependencies:

```bash
npm i -D postcss-scss stylelint-config-standard-scss
```

Create a [`stylelint`](https://stylelint.io/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/stylelint.config.scss.js'),
}
```

#### Styled Components

Install the following peer dependencies:

```bash
npm i -D postcss-styled-syntax
```

Create a [`stylelint`](https://stylelint.io/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/stylelint.config.styled.js'),
}
```

