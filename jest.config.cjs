const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
    roots: ["<rootDir>/tests"],
    preset: "ts-jest",
    resolver: "ts-jest-resolver",
    testEnvironment: "node",
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: "<rootDir>/src/",
        }),
    },
};
