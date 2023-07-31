module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['stylelint/plugins/*.mjs'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
}
