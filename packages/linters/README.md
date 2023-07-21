# Time Out Market

## Linters

Set of linters configs to be used in our JavaScript projects.

### Shared linters

- [ESLint](https://eslint.org/) configs
- [Prettier](https://prettier.io/) configs
- [Commitlint](https://commitlint.js.org/) configs
- [Stylelint](https://stylelint.io/) configs

### Installation

```bash
npm i @juntossomosmais/linters --D
```

### Usage

#### Commitlint

Create a `commitlint.config.js` file in the root of your project with the following content:

```js
module.exports = {
  extends: ['@juntossomosmais/linters/commitlint'],
}
```

