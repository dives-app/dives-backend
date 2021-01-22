module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["<rootDir>/build"],
  testEnvironment: "node",
  testTimeout: 20000,
};
