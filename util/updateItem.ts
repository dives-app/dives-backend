import { DynamoDB } from "aws-sdk";
import { Resource } from "../types";
import { ApolloError } from "apollo-server-lambda";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

type updateItemInput = {
  userId: string;
  resourceType: Resource;
  resourceId: string;
  itemData: Object;
};

const containsData = (item) => {
  if (
    item === null ||
    item === undefined ||
    item === "" ||
    (Array.isArray(item) && item.length === 0) ||
    (typeof item === 'object' && Object.keys(item).length === 0)
  ) {
    return false;
  }
  return true;
};

const generateUpdateExpression = (updateData: Object) => {
  let UpdateExpression = "SET ";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};
  let index = 0;
  for (const [key, value] of Object.entries(updateData)) {
    if (containsData(value)) {
      UpdateExpression += `#attr${index} = :val${index} ,`;
      ExpressionAttributeNames[`#attr${index}`] = key;
      ExpressionAttributeValues[`:val${index}`] = value;
      index++;
    }
  }
  let isFirstValidLoop = true;
  for (const [key, value] of Object.entries(updateData)) {
    if (value === "") {
      if (isFirstValidLoop) {
        UpdateExpression = UpdateExpression.slice(0, -1);
        UpdateExpression += " REMOVE ";
        isFirstValidLoop = false;
      }
      UpdateExpression += `#attr${index} ,`;
      ExpressionAttributeNames[`#attr${index}`] = key;
      index++;
    }
  }
  UpdateExpression = UpdateExpression.slice(0, -1);
  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

export const updateItem = (arg: updateItemInput) => {
  const { userId, resourceType, resourceId, itemData } = arg;
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = generateUpdateExpression(itemData);

  return dynamoDb
    .update({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { userId, resourceId: `${resourceType}${resourceId}` },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
    .promise()
    .then((result) => result.Attributes)
    .catch((error) => {
      throw new ApolloError(error);
    });
};
