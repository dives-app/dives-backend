import {APIGatewayProxyEvent, Context as LambdaContext} from "aws-lambda";
import {Connection} from "typeorm";
import {S3} from "aws-sdk";

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
  connection: Connection;
  s3: S3;
  setCookies: Array<Cookie>;
  setHeaders: Array<any>;
  user: TokenData;
}
