const { DynamoDB } = require("aws-sdk");

export function createTable(done) {
  var params = {
    TableName: "dives",
    KeySchema: [
      {
        AttributeName: "userId",
        KeyType: "HASH",
      },
      {
        AttributeName: "resourceId",
        KeyType: "RANGE",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "userId",
        AttributeType: "S", // (S | N | B) for string, number, binary
      },
      {
        AttributeName: "resourceId",
        AttributeType: "S",
      },
      {
        AttributeName: "budgetId",
        AttributeType: "S",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "budgetId",
        KeySchema: [
          {
            AttributeName: "budgetId",
            KeyType: "HASH",
          },
          {
            AttributeName: "resourceId",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
      },
    ],
  };
  new DynamoDB({
    region: "localhost",
    endpoint: "http://localhost:8000",
  }).createTable(params, function (error) {
    if (error !== null) createTable(done);
    if (error === null) done();
  });
}

export function deleteTable(done) {
    new DynamoDB({
      region: "localhost",
      endpoint: "http://localhost:8000",
    }).deleteTable(
      {
        TableName: "dives",
      },
      function (error) {
        if (error !== null) deleteTable(done);
        if (error === null) done();
      }
    );
}
