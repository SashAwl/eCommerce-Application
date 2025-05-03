/* eslint-disable */

import { Config } from 'jest';

const config: Config = {
    rootDir: './',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/mock/fileMock.js',
        '\\.(css|less)$': 'identity-obj-proxy',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

export default config;
