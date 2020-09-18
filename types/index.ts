import { APIGatewayProxyEvent, Context as LambdaContext } from "aws-lambda";
import { Connection } from "typeorm";

export interface TokenData {
  id: string;
  email: string;
}

export interface ApolloContext {
  event: APIGatewayProxyEvent;
  context: LambdaContext;
}

export interface Cookie {
  name: string;
  value: string;
  options?: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean;
    secure?: boolean;
  };
}

export interface Context extends ApolloContext {
  user: TokenData;
  setCookies: Array<Cookie>;
  setHeaders: Array<any>;
  connection: Connection;
}

export enum Resource {
  USER = "USR",
  USER_CREDENTIALS = "CRE",
  BUDGET = "BUD",
  TRANSACTION = "TRA",
  CYCLE_TRANSACTION = "CYC",
  CATEGORY = "CAT",
  BANK_ACCOUNT = "ACC",
  MERCHANT = "MER",
  DEBT = "DEB",
  NOTIFICATION = "NOT",
  PURCHASE = "PUR",
}
