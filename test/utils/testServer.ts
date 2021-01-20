// import { ApolloServer } from "apollo-server-lambda";
// import { ApolloContext, AccessTokenData, Context } from "../../types";
// import { buildSchemaSync } from "type-graphql";
// import { UserResolver } from "../../src/resolvers/UserResolver";
// import { Connection, createConnection, getConnectionManager } from "typeorm";
// import { config as getEnv } from "dotenv";
//
// getEnv({ path: "env.yml-test" });
// const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USER } = process.env;
//
// export let loggedUserEmail;
// export let loggedUserId;
// export const setLoggedUserEmail = (newEmail) => {
//   loggedUserEmail = newEmail;
// };
// export const setLoggedUserId = (newId) => {
//   loggedUserId = newId;
// };
//
// const schema = buildSchemaSync({
//   resolvers: [UserResolver],
//   validate: false,
// });
//
// const getConnection = async () => {
//   const manager = getConnectionManager();
//   let connection: Connection;
//
//   if (manager.has("default")) {
//     connection = manager.get("default");
//   } else {
//     connection = await createConnection({
//       type: "postgres",
//       host: DB_HOST,
//       port: parseInt(DB_PORT),
//       username: DB_USER,
//       password: DB_PASSWORD,
//       database: DB_NAME,
//       entities: ["build/src/entities/**/*.js"],
//       synchronize: false,
//       logging: "all",
//     });
//   }
//   if (!connection.isConnected) {
//     await connection.connect();
//   }
//   return connection;
// };
//
// export const testServer = new ApolloServer({
//   schema,
//   context: async ({ event, context }: ApolloContext): Promise<Context> => {
//     const connection = await getConnection();
//     let user: AccessTokenData = { email: loggedUserEmail, id: loggedUserId };
//     return {
//       event,
//       context,
//       user,
//       setCookies: [],
//       setHeaders: [],
//       connection,
//     };
//   },
// });
