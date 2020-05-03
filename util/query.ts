import { DynamoDB } from "aws-sdk";
import { ApolloError } from "apollo-server-lambda";
import { Resource } from "../types";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000"
});

export const queryByUser = (
  userId: String,
  resourceType: Resource,
  resourceId = ""
) =>
  dynamoDb
    .query({
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression:
        "userId = :userId AND begins_with( resourceId, :resourceId )",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":resourceId": `${resourceType}${resourceId}`,
      },
    })
    .promise()
    .then((res) => {
      return res.Items;
    });

export const queryByBudget = (
  budgetId: String,
  resourceType: Resource,
  resourceId = ""
) =>
  dynamoDb
    .query({
      TableName: process.env.DYNAMODB_TABLE,
      IndexName: "budgetId",
      KeyConditionExpression:
        "budgetId = :budgetId AND begins_with( resourceId, :resourceId )",
      ExpressionAttributeValues: {
        ":budgetId": budgetId,
        ":resourceId": `${resourceType}${resourceId}`,
      },
    })
    .promise()
    .then((res) => {
      return res.Items;
    });

type queryInput = {
  userId?: string;
  budgetId?: string;
  resourceId?: string;
  resourceType: Resource;
  dependsOnNullableResourceId?: boolean;
};

export const query = (arg: queryInput) => {
  if (arg.dependsOnNullableResourceId && arg.resourceId === undefined)
    return Promise.resolve(null);
  const { userId = "", budgetId = "", resourceId = "", resourceType } = arg;

  if (userId === "" && budgetId === "")
    throw new ApolloError("Provide id of either user or budget");
  if (userId !== "") {
    return queryByUser(userId, resourceType, resourceId);
  }
  return queryByBudget(budgetId, resourceType, resourceId);
};
