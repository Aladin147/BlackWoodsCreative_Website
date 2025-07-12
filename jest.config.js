const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// RIGOROUS TESTING CONFIGURATION - BEHAVIOR-DRIVEN APPROACH
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.rigorous.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',

  // NEW: Focus on behavior tests and integration tests
  testMatch: [
    '<rootDir>/src/**/*.behavior.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/__tests__/**/*.{js,jsx,ts,tsx}',
  ],

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.behavior.test.{js,jsx,ts,tsx}',
  ],

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    '<rootDir>/src/__tests__/test-utils.tsx' // Exclude test utilities
  ],

  // REMOVED: Artificial coverage thresholds that encourage gaming
  // Focus on quality over quantity - meaningful tests over coverage numbers

  // Ensure tests are fast and reliable
  testTimeout: 10000, // 10 seconds max per test
  // React 19 and Next.js 15 compatibility
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  // Suppress punycode deprecation warnings during tests
  silent: false,
  verbose: false,
  // Enhanced module resolution for React 19
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
