import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("CycleTransaction", () => {
  const CREATE_USER = gql`
    mutation {
      register(
        options: {
          email: "test@user.com"
          password: "legitP@55"
          name: "Test User"
          birthDate: "2001-02-03"
        }
      ) {
        id
        email
        name
        birthDate
      }
    }
  `;
  const CREATE_CATEGORY = gql`
    mutation {
      createCategory(
        options: { name: "categoryName", color: "#ffffff", icon: "PKO", type: 1, limit: 1000 }
      ) {
        id
      }
    }
  `;
  const CREATE_CYCLE_TRANSACTION = gql`
    mutation($categoryId: String!) {
      createCycleTransaction(
        options: {
          name: "cycleTransactionName"
          description: "Name of the cycle transaction"
          amount: 10.99
          period: 10
          date: "10-10-2020"
          categoryId: $categoryId
        }
      ) {
        id
        name
        description
        amount
        period
        date
        category {
          id
        }
      }
    }
  `;
  let server, query: ApolloServerTestClient["query"], mutate: ApolloServerTestClient["mutate"];
  beforeEach(async () => {
    server = new TestServer();
    const testClient = server.createTestClient();
    query = testClient.query;
    mutate = testClient.mutate;
  });
  afterEach(async () => {
    await truncateDatabase();
  });

  test("is created", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createCycleTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId },
    });
    expect(createCycleTransactionResponse.data.createCycleTransaction).toEqual({
      id: expect.any(String),
      name: "cycleTransactionName",
      description: "Name of the cycle transaction",
      amount: 10.99,
      period: 10,
      date: "10-10-2020",
      category: {
        id: categoryId,
      },
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createCycleTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId },
    });
    const cycleTransactionId = createCycleTransactionResponse.data.createCycleTransaction.id;
    const GET_CYCLE_TRANSACTION = gql`
        query {
            cycleTransaction(options: { id: "${cycleTransactionId}" }) {
                id
                name
                description
                amount
                period
                date
                category {
                    id
                }
            }
        }
    `;
    const { data } = await query({ query: GET_CYCLE_TRANSACTION });
    expect(data.cycleTransaction).toEqual({
      id: cycleTransactionId,
      name: "cycleTransactionName",
      description: "Name of the cycle transaction",
      amount: 10.99,
      period: 10,
      date: "2020-10-10",
      category: {
        id: categoryId,
      },
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createCycleTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId },
    });
    const cycleTransactionId = createCycleTransactionResponse.data.createCycleTransaction.id;
    const UPDATE_CYCLE_TRANSACTION = gql`
        mutation {
            updateCycleTransaction(options: {
                id: "${cycleTransactionId}",
                name:"updatedCycleTransactionName",
            }) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_CYCLE_TRANSACTION });
    expect(data.updateCycleTransaction).toEqual({
      id: cycleTransactionId,
      name: "updatedCycleTransactionName",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createCycleTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId },
    });
    const cycleTransactionId = createCycleTransactionResponse.data.createCycleTransaction.id;
    const DELETE_CYCLE_TRANSACTION = gql`
        mutation {
            deleteCycleTransaction(options: {id: "${cycleTransactionId}"}) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_CYCLE_TRANSACTION });
    expect(data.deleteCycleTransaction).toEqual({
      id: cycleTransactionId,
      name: "cycleTransactionName",
    });
  });
});
