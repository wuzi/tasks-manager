module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    'src/controllers/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
  ],
};
