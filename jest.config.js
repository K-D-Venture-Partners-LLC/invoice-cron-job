module.exports = {
  testMatch: ['<rootDir>/**/*.spec.js'],

  testEnvironment: 'node',

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/**/*.js',
    '!.eslintrc.js'
  ],
}