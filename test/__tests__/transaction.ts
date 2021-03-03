import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Transaction", () => {
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
  const CREATE_ACCOUNT = gql`
    mutation {
      createAccount(
        options: {
          name: "accountName"
          balance: 10.00
          color: "#ffffff"
          currency: "USD"
          icon: "PKO"
          type: 1
        }
      ) {
        id
      }
    }
  `;
  const CREATE_CYCLE_TRANSACTION = gql`
    mutation($categoryId: String!, $accountId: String!) {
      createTransaction(
        options: {
          name: "transactionName"
          description: "Name of the cycle transaction"
          amount: 10.99
          categoryId: $categoryId
          time: "1999-03-14 10:35:12.15+10"
          accountId: $accountId
        }
      ) {
        id
        name
        description
        amount
        time
        account {
          id
        }
        category {
          id
        }
      }
    }
  `;
  let server: TestServer;
  let query: ApolloServerTestClient["query"];
  let mutate: ApolloServerTestClient["mutate"];
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
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const createTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId, accountId },
    });
    expect(createTransactionResponse.data.createTransaction).toEqual({
      id: expect.any(String),
      name: "transactionName",
      description: "Name of the cycle transaction",
      amount: 10.99,
      time: "1999-03-14 10:35:12.15+10",
      category: {
        id: categoryId,
      },
      account: {
        id: accountId,
      },
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const createTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId, accountId },
    });
    const transactionId = createTransactionResponse.data.createTransaction.id;
    const GET_CYCLE_TRANSACTION = gql`
        query {
            transaction(options: { id: "${transactionId}" }) {
                id
                name
                description
                amount
                time
                account {
                    id
                }
                category {
                    id
                }
            }
        }
    `;
    const { data } = await query({ query: GET_CYCLE_TRANSACTION });
    expect(data.transaction).toEqual({
      id: transactionId,
      name: "transactionName",
      description: "Name of the cycle transaction",
      amount: 10.99,
      time: "921371712150",
      category: {
        id: categoryId,
      },
      account: {
        id: accountId,
      },
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const createTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId, accountId },
    });
    const transactionId = createTransactionResponse.data.createTransaction.id;
    const UPDATE_CYCLE_TRANSACTION = gql`
        mutation {
            updateTransaction(options: {
                id: "${transactionId}",
                name:"updatedTransactionName",
            }) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_CYCLE_TRANSACTION });
    expect(data.updateTransaction).toEqual({
      id: transactionId,
      name: "updatedTransactionName",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const createTransactionResponse = await mutate({
      mutation: CREATE_CYCLE_TRANSACTION,
      variables: { categoryId, accountId },
    });
    const transactionId = createTransactionResponse.data.createTransaction.id;
    const DELETE_CYCLE_TRANSACTION = gql`
        mutation {
            deleteTransaction(options: {id: "${transactionId}"}) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_CYCLE_TRANSACTION });
    expect(data.deleteTransaction).toEqual({
      id: transactionId,
      name: "transactionName",
    });
  });
});
