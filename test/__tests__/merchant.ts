import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Merchant", () => {
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

  const CREATE_MERCHANT = gql`
    mutation {
      createMerchant(options: { name: "merchantName" }) {
        id
        name
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
    const createMerchantResponse = await mutate({ mutation: CREATE_MERCHANT });
    expect(createMerchantResponse.data.createMerchant).toEqual({
      id: expect.any(String),
      name: "merchantName",
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createMerchantResponse = await mutate({ mutation: CREATE_MERCHANT });
    const merchantId = createMerchantResponse.data.createMerchant.id;
    const GET_MERCHANT = gql`
        query {
            merchant(options: { id: "${merchantId}" }) {
                id
                name
            }
        }
    `;
    const { data } = await query({ query: GET_MERCHANT });
    expect(data.merchant).toEqual({
      id: expect.any(String),
      name: "merchantName",
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createMerchantResponse = await mutate({ mutation: CREATE_MERCHANT });
    const merchantId = createMerchantResponse.data.createMerchant.id;
    const UPDATE_MERCHANT = gql`
        mutation {
            updateMerchant(options: {
                id: "${merchantId}",
                name: "updatedMerchantName",
            }) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_MERCHANT });
    expect(data.updateMerchant).toEqual({
      id: merchantId,
      name: "updatedMerchantName",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createMerchantResponse = await mutate({ mutation: CREATE_MERCHANT });
    const merchantId = createMerchantResponse.data.createMerchant.id;
    const DELETE_MERCHANT = gql`
        mutation {
            deleteMerchant(options: {id: "${merchantId}"}) {
                id
                name
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_MERCHANT });
    expect(data.deleteMerchant).toEqual({
      id: merchantId,
      name: "merchantName",
    });
  });
});
