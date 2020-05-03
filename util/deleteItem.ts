import { DynamoDB } from "aws-sdk";
import { Resource } from "../types";
import { ApolloError } from "apollo-server-lambda";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

type deleteItemInput = {
  userId: string;
  resourceType: Resource;
  resourceId: string;
};

/**
 * Deletes item from database
 * @param arg Object containing userId, resourceType and resourceId
 */
export const deleteItem = (arg: deleteItemInput) => {
  const { userId, resourceType, resourceId } = arg;
  return dynamoDb
    .delete({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { userId, resourceId: `${resourceType}${resourceId}` },
      ReturnValues: "ALL_OLD",
    })
    .promise()
    .then((result) => result.Attributes)
    .catch((error) => {
      throw new ApolloError(error);
    });
};
