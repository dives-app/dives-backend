module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["<rootDir>/build", "<rootDir>/build_output", "<rootDir>/.serverless"],
  testEnvironment: "node",
  testTimeout: 20000,
};
