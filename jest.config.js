module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    'src/controllers/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
  ],
};
