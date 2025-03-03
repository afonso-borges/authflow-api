import { Config } from "jest";

const config: Config = {
    transform: {
        "^.+\\.(t|j)s?$": "@swc/jest",
    },
    moduleNameMapper: {
        "@app/(.*)": "<rootDir>/app/src/$1",
        "@auth/(.*)": "<rootDir>/app/src/auth/$1",
        "@config/(.*)": "<rootDir>/app/src/config/$1",
        "@shared/(.*)": "<rootDir>/app/src/shared/$1",
        "@prisma/(.*)": "<rootDir>/app/prisma/$1",
        "@interfaces/(.*)": "<rootDir>/app/src/shared/interfaces/$1",
        "@filters/(.*)": "<rootDir>/app/src/shared/filters/$1",
        "@interceptors/(.*)": "<rootDir>/app/src/shared/interceptors/$1",
        "@pipes/(.*)": "<rootDir>/app/src/shared/pipes/$1",
        "@test/(.*)": "<rootDir>/test/$1",
    },
    setupFilesAfterEnv: ["jest-extended/all"],
    coverageProvider: "v8",
    collectCoverageFrom: [
        "app/src/**/*.ts",
        "!**/*.interface.ts",
        "!**/*.dto.ts",
        "!**/*.module.ts",
        "!**/prisma.repository.ts",
        "!**/*.enum.ts",
    ],
    clearMocks: true,
    moduleDirectories: ["node_modules", "app/src"],
    testEnvironment: "node",
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    moduleFileExtensions: ["js", "json", "ts"],
};

export default config;
