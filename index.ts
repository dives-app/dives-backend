import "source-map-support/register";
import "reflect-metadata";
import {Connection, createConnection, getConnectionManager} from "typeorm";
import {ApolloServer} from "apollo-server-lambda";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import {verify} from "jsonwebtoken";
import {ApolloContext, Context as MyApolloContext, TokenData} from "./types";
import {buildSchemaSync} from "type-graphql";
import {APIGatewayEvent, Context} from "aws-lambda";
import {UserResolver} from "./src/resolvers/UserResolver";
import {BudgetResolver} from "./src/resolvers/BudgetResolver";
import {TransactionResolver} from "./src/resolvers/TransactionResolver";
import {CategoryResolver} from "./src/resolvers/CategoryResolver";
import {DebtResolver} from "./src/resolvers/DebtResolver";
import {Account} from "./src/entities/Account";
import {Budget} from "./src/entities/Budget";
import {BudgetMembership} from "./src/entities/BudgetMembership";
import {Category} from "./src/entities/Category";
import {CycleTransaction} from "./src/entities/CycleTransaction";
import {Debt} from "./src/entities/Debt";
import {Merchant} from "./src/entities/Merchant";
import {Notification} from "./src/entities/Notification";
import {Plan} from "./src/entities/Plan";
import {Purchase} from "./src/entities/Purchase";
import {Transaction} from "./src/entities/Transaction";
import {User} from "./src/entities/User";
import {AccountResolver} from "./src/resolvers/AccountResolver";
import {CycleTransactionResolver} from "./src/resolvers/CycleTransactionResolver";
import {MerchantResolver} from "./src/resolvers/MerchantResolver";
import {NotificationResolver} from "./src/resolvers/NotificationResolver";
import {PurchaseResolver} from "./src/resolvers/PurchaseResolver";
import AWS from "aws-sdk";

const {STAGE, DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USERNAME} = process.env;

//! This code is important (be careful trying to remove it).
//! `global.schema` name is required because of some deep graphql schema shit
if (!(global as any).schema) {
  (global as any).schema = buildSchemaSync({
    resolvers: [
      AccountResolver,
      BudgetResolver,
      CategoryResolver,
      CycleTransactionResolver,
      DebtResolver,
      MerchantResolver,
      NotificationResolver,
      PurchaseResolver,
      TransactionResolver,
      UserResolver,
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
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [
        Account,
        Budget,
        BudgetMembership,
        Category,
        CycleTransaction,
        Debt,
        Merchant,
        Notification,
        Plan,
        Purchase,
        Transaction,
        User,
      ],
      synchronize: false,
      logging: "all",
    });
  }
  if (!connection.isConnected) {
    await connection.connect();
  }
  return connection;
};
let S3;
if (STAGE === "local") {
  S3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
    endpoint: "http://localhost:4569",
  });
} else {
  S3 = new AWS.S3({
    s3ForcePathStyle: true,
  });
}

const server = new ApolloServer({
  schema,
  plugins: [httpHeadersPlugin],
  context: async ({event, context}: ApolloContext): Promise<MyApolloContext> => {
    const connection = await getConnection();
    let user: TokenData = {email: null, id: null};
    try {
      const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(4);
      user = verify(jwt, process.env.JWT_SECRET) as TokenData;
    } catch {}
    return {
      connection,
      s3: S3,
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
