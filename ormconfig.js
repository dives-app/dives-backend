require("env-yaml").config({ path: "env.yml" });
const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_NAME } = process.env;

module.exports = {
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["build/src/entities/**/*.js"],
  migrations: ["build/src/migrations/**/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
};
