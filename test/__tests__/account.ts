import { gql } from "apollo-server-lambda";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Account", () => {
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
        name
        balance
        color
        currency
        type
      }
    }
  `;
  let server, query, mutate;
  beforeEach(async () => {
    server = new TestServer();
    query = server.createTestClient().query;
    mutate = server.createTestClient().mutate;
  });
  afterEach(async () => {
    await truncateDatabase();
  });

  test("is created", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    expect(createAccountResponse.data.createAccount).toEqual({
      id: expect.any(String),
      name: "accountName",
      balance: 10.0,
      color: "#ffffff",
      currency: "USD",
      type: 1,
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const GET_ACCOUNT = gql`
        query {
            account(options: { id: "${accountId}" }) {
                id
                name
                balance
                color
                currency
                type
            }
        }
    `;
    const { data } = await query({ query: GET_ACCOUNT });
    expect(data.account).toEqual({
      id: accountId,
      name: "accountName",
      balance: 10.0,
      color: "#ffffff",
      currency: "USD",
      type: 1,
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const UPDATE_ACCOUNT = gql`
        mutation {
            updateAccount(options: {
                id: "${accountId}",
                name:"updatedAccountName",
                type: 2,
                currency: "PLN",
                balance: 20.20,
                color: "#000000",
                billingDate: "10-02-2021",
                billingPeriod: 2,
                description: "desc",
                interestRate: 3
            }) {
                id
                name
                type
                currency
                balance
                color
                billingDate
                billingPeriod
                description
                interestRate
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_ACCOUNT });
    expect(data.updateAccount).toEqual({
      id: accountId,
      name: "updatedAccountName",
      type: 2,
      currency: "PLN",
      balance: 20.2,
      color: "#000000",
      billingDate: "10-02-2021",
      billingPeriod: 2,
      description: "desc",
      interestRate: 3,
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createAccountResponse = await mutate({ mutation: CREATE_ACCOUNT });
    const accountId = createAccountResponse.data.createAccount.id;
    const DELETE_ACCOUNT = gql`
        mutation {
            deleteAccount(options: {id: "${accountId}"}) {
                id
                name
                balance
                color
                currency
                type
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_ACCOUNT });
    expect(data.deleteAccount).toEqual({
      id: accountId,
      name: "accountName",
      balance: 10.0,
      color: "#ffffff",
      currency: "USD",
      type: 1,
    });
  });
});
