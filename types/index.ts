import { APIGatewayProxyEvent, Context as LambdaContext } from "aws-lambda";
import { Connection } from "typeorm";
import { S3 } from "aws-sdk";

export interface TokenData {
  id: string;
  iat: number;
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
  userId?: string;
}

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type NoMethods<T> = Pick<T, NonFunctionPropertyNames<T>>;
