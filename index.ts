import "source-map-support/register";
import "reflect-metadata";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import { ApolloServer } from "apollo-server-lambda";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import { verify } from "jsonwebtoken";
import { ApolloContext, Context as MyApolloContext, TokenData } from "./types";
import { buildSchemaSync } from "type-graphql";
import { APIGatewayEvent, Context } from "aws-lambda";
import { UserResolver } from "./src/resolvers/UserResolver";
import { config as getEnv } from "dotenv";
import { BudgetResolver } from "./src/resolvers/BudgetResolver";
import { TransactionResolver } from "./src/resolvers/TransactionResolver";
import { CategoryResolver } from "./src/resolvers/CategoryResolver";
import { DebtResolver } from "./src/resolvers/DebtResolver";

getEnv();
const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USER } = process.env;

//! This code is important (be careful trying to remove it).
//! `global.schema` name is required because of some deep graphql schema shit
if (!(global as any).schema) {
  (global as any).schema = buildSchemaSync({
    resolvers: [
      UserResolver,
      BudgetResolver,
      TransactionResolver,
      CategoryResolver,
      DebtResolver,
    ],
    validate: true,
  });
}
const schema = (global as any).schema;

/**
 * Returns either old or new connection to the database
 */
const getConnection = async () => {
  const manager = getConnectionManager();
  let connection: Connection;

  if (manager.has("default")) {
    connection = manager.get("default");
  } else {
    connection = await createConnection({
      type: "postgres",
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + "/src/entities/**/*.js"],
      synchronize: false,
      logging: "all",
    });
  }
  if (!connection.isConnected) {
    await connection.connect();
  }
  return connection;
};

const server = new ApolloServer({
  schema,
  plugins: [httpHeadersPlugin],
  playground: {
    endpoint: "/dev/graphql",
  },
  context: async ({
    event,
    context,
  }: ApolloContext): Promise<MyApolloContext> => {
    const connection = await getConnection();
    let user: TokenData = { email: null, id: null };
    try {
      const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(4);
      user = verify(jwt, process.env.JWT_SECRET) as TokenData;
    } catch {}
    return {
      connection,
      event,
      context,
      user,
      setCookies: [],
      setHeaders: [],
    };
  },
});
const handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

//! Another stuff I don't quite understand, but without it async handler doesn't work
const runHandler = (event, context, handler) =>
  new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));

    handler(event, context, callback);
  });

exports.handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    return await runHandler(event, context, handler);
  } catch (e) {
    console.error(e);
  }
};
