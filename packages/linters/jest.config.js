module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/stylelint/**', '!dist/**', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
}
