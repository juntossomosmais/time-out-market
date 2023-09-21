# Time Out Market - Linters

Set of linters configs to be used in our JavaScript projects.

## Shared linters

- [ESLint](https://eslint.org/) configs
- [Prettier](https://prettier.io/) configs
- [Commitlint](https://commitlint.js.org/) configs
- [Stylelint](https://stylelint.io/) configs

## Installation

First you need to install peer dependencies:

```bash
npm i -D @commitlint/cli @commitlint/config-conventional @juntossomosmais/atomium-tokens prettier postcss stylelint stylelint-config-recommended stylelint-order
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

Install the following peer dependencies:

```bash
npm i -D eslint eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-sonarjs @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Create a [`eslint`](https://eslint.org/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/eslint.config.js'),
  // Your custom config here
}
```

#### React

Install the following peer dependencies:

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks
```

Create a [`eslint`](https://eslint.org/) file in the root of your project with the following content:

```js
module.exports = {
  ...require('@juntossomosmais/linters/eslint.config.react.js'),
  // Your custom config here
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

