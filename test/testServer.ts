import "source-map-support/register";
import "reflect-metadata";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import { ApolloServer } from "apollo-server-lambda";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import { buildSchemaSync } from "type-graphql";
import AWS from "aws-sdk";
import { AccountResolver } from "../src/resolvers/AccountResolver";
import { BudgetResolver } from "../src/resolvers/BudgetResolver";
import { CategoryResolver } from "../src/resolvers/CategoryResolver";
import { CycleTransactionResolver } from "../src/resolvers/CycleTransactionResolver";
import { DebtResolver } from "../src/resolvers/DebtResolver";
import { MerchantResolver } from "../src/resolvers/MerchantResolver";
import { NotificationResolver } from "../src/resolvers/NotificationResolver";
import { PurchaseResolver } from "../src/resolvers/PurchaseResolver";
import { TransactionResolver } from "../src/resolvers/TransactionResolver";
import { UserResolver } from "../src/resolvers/UserResolver";
import { authChecker } from "../src/utils/authChecker";
import { Account } from "../src/entities/Account";
import { Budget } from "../src/entities/Budget";
import { BudgetMembership } from "../src/entities/BudgetMembership";
import { Category } from "../src/entities/Category";
import { CycleTransaction } from "../src/entities/CycleTransaction";
import { Debt } from "../src/entities/Debt";
import { Merchant } from "../src/entities/Merchant";
import { Notification } from "../src/entities/Notification";
import { Plan } from "../src/entities/Plan";
import { Purchase } from "../src/entities/Purchase";
import { Transaction } from "../src/entities/Transaction";
import { User } from "../src/entities/User";
import { ApolloContext, Context as MyApolloContext } from "../types";
import { config } from "env-yaml";
import { createTestClient } from "apollo-server-testing";

config({ path: "test/env-test.yml" });
const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USERNAME } = process.env;

export default class TestServer {
  public loggedUserId: string;
  public serverInstance: ApolloServer;

  constructor() {
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
        authChecker,
      });
    }
    const schema = (global as any).schema;

    let S3 = new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
      endpoint: "http://localhost:4569",
    });

    this.serverInstance = new ApolloServer({
      schema,
      plugins: [httpHeadersPlugin],
      context: async ({ event, context }: ApolloContext): Promise<MyApolloContext> => {
        const connection = await this.getConnection();

        return {
          connection,
          s3: S3,
          event,
          context,
          userId: this.loggedUserId,
          setCookies: [],
          setHeaders: [],
        };
      },
    });
  }

  createTestClient() {
    return createTestClient(this.serverInstance);
  }

  async getConnection() {
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
        logging: ["error", "migration"],
      });
    }
    if (!connection.isConnected) {
      await connection.connect();
    }
    return connection;
  }
}
