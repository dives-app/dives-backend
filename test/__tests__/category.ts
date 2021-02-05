import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-lambda";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Category", () => {
  let server;
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
        name
        color
        type
        limit
      }
    }
  `;
  beforeEach(async () => {
    server = new TestServer();
    server.init();
  });
  afterEach(async () => {
    await truncateDatabase();
  });

  test("is created", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    expect(createCategoryResponse.data.createCategory).toEqual({
      id: expect.any(String),
      name: "categoryName",
      color: "#ffffff",
      type: 1,
      limit: 1000,
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const { mutate, query } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const GET_CATEGORY = gql`
        query {
            category(options: { id: "${categoryId}" }) {
                id
                name
                color
                type
                limit
            }
        }
    `;
    const { data } = await query({ query: GET_CATEGORY });
    expect(data.category).toEqual({
      id: categoryId,
      name: "categoryName",
      color: "#ffffff",
      type: 1,
      limit: 1000,
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const UPDATE_CATEGORY = gql`
        mutation {
            updateCategory(options: {
                id: "${categoryId}",
                name:"updatedCategoryName",
                type: 2,
                color: "#000000",
                limit: 2.99
                icon: "FOOD"
            }) {
                id
                name
                type
                color
                limit
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_CATEGORY });
    expect(data.updateCategory).toEqual({
      id: categoryId,
      name: "updatedCategoryName",
      type: 2,
      color: "#000000",
      limit: 2.99,
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createCategoryResponse = await mutate({ mutation: CREATE_CATEGORY });
    const categoryId = createCategoryResponse.data.createCategory.id;
    const DELETE_CATEGORY = gql`
        mutation {
            deleteCategory(options: {id: "${categoryId}"}) {
                id
                name
                color
                type
                limit
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_CATEGORY });
    expect(data.deleteCategory).toEqual({
      id: categoryId,
      name: "categoryName",
      color: "#ffffff",
      type: 1,
      limit: 1000,
    });
  });
});
