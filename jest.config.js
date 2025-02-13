const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!wagmi|@tanstack|@solana|@wallet-adapter).+\\.js$", // Allow ESM modules
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    collectCoverage: false,
};

module.exports = createJestConfig(customJestConfig);
