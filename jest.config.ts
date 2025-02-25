import { Config } from "jest";

const config: Config = {
    transform: {
        "^.+\\.(t|j)s?$": "@swc/jest",
    },
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
        "@auth/(.*)": "<rootDir>/src/auth/$1",
        "@config/(.*)": "<rootDir>/src/config/$1",
        "@shared/(.*)": "<rootDir>/src/shared/$1",
        "@interfaces/(.*)": "<rootDir>/src/shared/interfaces/$1",
        "@filters/(.*)": "<rootDir>/src/shared/filters/$1",
        "@interceptors/(.*)": "<rootDir>/src/shared/interceptors/$1",
        "@pipes/(.*)": "<rootDir>/src/shared/pipes/$1",
    },
    setupFilesAfterEnv: ["jest-extended/all"],
    coverageProvider: "v8",
    collectCoverageFrom: [
        "src/**/*.ts",
        "!**/*.interface.ts",
        "!**/*.dto.ts",
        "!**/*.module.ts",
        "!**/prisma.repository.ts",
        "!**/*.enum.ts",
    ],
    clearMocks: true,
    moduleDirectories: ["node_modules", "src"],
    testEnvironment: "node",
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    moduleFileExtensions: ["js", "json", "ts"],
};

export default config;
