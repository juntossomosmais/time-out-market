module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './packages/linters/coverage/',
  coverageReporters: ['lcov'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
}
