import { DynamoDB } from "aws-sdk";
import { Resource } from "../types";
import { ApolloError } from "apollo-server-lambda";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

type addItemInput = {
  userId: string;
  budgetId?: string;
  resourceType: Resource;
  resourceId: string;
  itemData: Object;
};

/**
 * Puts item into database, if it already exists throws error
 * @param arg Object containing userId, budgetId, resourceType, resourceId and itemData
 */
export const addItem = (arg: addItemInput) => {
  const { userId, budgetId, resourceType, resourceId, itemData } = arg;
  return dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        userId,
        resourceId: `${resourceType}${resourceId}`,
        ...itemData,
        budgetId,
      },
      ConditionExpression: "attribute_not_exists(userId)",
    })
    .promise()
    .catch((error) => {
      throw new ApolloError(error);
    });
};
