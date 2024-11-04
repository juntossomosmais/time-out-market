/* eslint-disable */
export default {
  displayName: 'http-front-cache',
  preset: '../../jest.preset.js',
  collectCoverage: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
}
