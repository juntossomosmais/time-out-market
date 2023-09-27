module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf',
      ],
    ],
    'body-leading-blank': [2, 'always'],
    'subject-case': [2, 'always', ['lower-case']],
    'header-max-length': [2, 'always', 72],
  },
}
