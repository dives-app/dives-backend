declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STAGE: "local" | "dev";
      SERVER_HOST: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      S3_REGION: string;
      S3_BUCKET: string;
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
