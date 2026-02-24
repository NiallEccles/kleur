import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: './',
})

// Custom Jest config
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);