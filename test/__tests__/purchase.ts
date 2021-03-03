import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Purchase", () => {
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

  const CREATE_PURCHASE = gql`
    mutation {
      createPurchase(
        options: {
          name: "purchaseName"
          planId: "1"
          endDate: "2020-12-20"
          currency: "PLN"
          price: 10.99
          startDate: "2020-10-20"
        }
      ) {
        id
        currency
        endDate
        name
        price
        startDate
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
    const createPurchaseResponse = await mutate({ mutation: CREATE_PURCHASE });
    expect(createPurchaseResponse.data.createPurchase).toEqual({
      id: expect.any(String),
      name: "purchaseName",
      endDate: "2020-12-20",
      currency: "PLN",
      price: 10.99,
      startDate: "2020-10-20",
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createPurchaseResponse = await mutate({ mutation: CREATE_PURCHASE });
    const purchaseId = createPurchaseResponse.data.createPurchase.id;
    const GET_PURCHASE = gql`
        query {
            purchase(options: { id: "${purchaseId}" }) {
                id
                currency
                endDate
                name
                price
                startDate
            }
        }
    `;
    const { data } = await query({ query: GET_PURCHASE });
    expect(data.purchase).toEqual({
      id: expect.any(String),
      name: "purchaseName",
      endDate: "2020-12-20",
      currency: "PLN",
      price: 10.99,
      startDate: "2020-10-20",
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createPurchaseResponse = await mutate({ mutation: CREATE_PURCHASE });
    const purchaseId = createPurchaseResponse.data.createPurchase.id;
    const UPDATE_PURCHASE = gql`
        mutation {
            updatePurchase(options: {
                id: "${purchaseId}",
                name:"newPurchaseName",
            }) {
                id
                currency
                endDate
                name
                price
                startDate
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_PURCHASE });
    expect(data.updatePurchase).toEqual({
      id: purchaseId,
      name: "newPurchaseName",
      endDate: "2020-12-20",
      currency: "PLN",
      price: 10.99,
      startDate: "2020-10-20",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createPurchaseResponse = await mutate({ mutation: CREATE_PURCHASE });
    const purchaseId = createPurchaseResponse.data.createPurchase.id;
    const DELETE_PURCHASE = gql`
        mutation {
            deletePurchase(options: {id: "${purchaseId}"}) {
                id
                currency
                endDate
                name
                price
                startDate
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_PURCHASE });
    expect(data.deletePurchase).toEqual({
      id: purchaseId,
      name: "purchaseName",
      endDate: "2020-12-20",
      currency: "PLN",
      price: 10.99,
      startDate: "2020-10-20",
    });
  });
});
