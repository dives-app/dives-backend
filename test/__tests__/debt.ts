import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Debt", () => {
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

  const CREATE_DEBT = gql`
    mutation {
      createDebt(
        options: {
          name: "debtName"
          description: "Name of the cycle transaction"
          balance: 10.1
          icon: "test"
          color: "#000fff"
          currency: "USD"
          endDate: "2020-12-10"
        }
      ) {
        id
        name
        description
        balance
        icon
        color
        currency
        endDate
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
    const createDebtResponse = await mutate({ mutation: CREATE_DEBT });
    expect(createDebtResponse.data.createDebt).toEqual({
      id: expect.any(String),
      name: "debtName",
      description: "Name of the cycle transaction",
      balance: 10.1,
      icon: "test",
      color: "#000fff",
      currency: "USD",
      endDate: "2020-12-10",
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createDebtResponse = await mutate({ mutation: CREATE_DEBT });
    const debtId = createDebtResponse.data.createDebt.id;
    const GET_DEBT = gql`
        query {
            debt(options: { id: "${debtId}" }) {
                id
                name
                description
                balance
                icon
                color
                currency
                endDate
            }
        }
    `;
    const { data } = await query({ query: GET_DEBT });
    expect(data.debt).toEqual({
      id: expect.any(String),
      name: "debtName",
      description: "Name of the cycle transaction",
      balance: 10.1,
      icon: "test",
      color: "#000fff",
      currency: "USD",
      endDate: "2020-12-10",
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createDebtResponse = await mutate({ mutation: CREATE_DEBT });
    const debtId = createDebtResponse.data.createDebt.id;
    const UPDATE_DEBT = gql`
        mutation {
            updateDebt(options: {
                id: "${debtId}",
                name: "updatedDebtName",
            }) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_DEBT });
    expect(data.updateDebt).toEqual({
      id: debtId,
      name: "updatedDebtName",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createDebtResponse = await mutate({ mutation: CREATE_DEBT });
    const debtId = createDebtResponse.data.createDebt.id;
    const DELETE_DEBT = gql`
        mutation {
            deleteDebt(options: {id: "${debtId}"}) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_DEBT });
    expect(data.deleteDebt).toEqual({
      id: debtId,
      name: "debtName",
    });
  });
});
