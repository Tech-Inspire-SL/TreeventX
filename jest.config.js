
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^next/link$': '<rootDir>/__mocks__/next/link.tsx',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.tsx',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|@radix-ui|class-variance-authority|date-fns)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);
