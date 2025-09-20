import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testRegex: '\\.spec.ts$', // E2E用の `.e2e-spec.ts` とは分離
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    '^@genkotsu-mt-fall/shared/schemas$': '<rootDir>/../shared/dist/schemas',
    '^@genkotsu-mt-fall/shared$': '<rootDir>/../shared/dist',
  },
};

export default config;
