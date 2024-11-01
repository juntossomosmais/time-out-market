/* eslint-disable */
export default {
  displayName: 'http-front-cache',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
}
