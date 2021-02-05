import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-lambda";
import TestServer from "../testServer";
import { getManager } from "typeorm";

describe("Budget", () => {
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
  const CREATE_BUDGET = gql`
    mutation {
      createBudget(options: { name: "budgetName", limit: 1000 }) {
        id
        name
        limit
      }
    }
  `;
  beforeEach(async () => {
    server = new TestServer();
    server.init();
  });
  afterEach(async () => {
    // Delete all DB data
    await getManager().query(
      `TRUNCATE "account", "budget", "budget_membership", "category", "cycle_transaction", "debt", "merchant", "notification", "plan", "purchase", "transaction", "user" CASCADE;`
    );
  });

  test("is created", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    expect(createBudgetResponse.data.createBudget).toEqual({
      id: expect.any(String),
      name: "budgetName",
      limit: 1000,
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const { mutate, query } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    const budgetId = createBudgetResponse.data.createBudget.id;
    const GET_BUDGET = gql`
        query {
            budget(options: { id: "${budgetId}" }) {
                id
                name
                limit
            }
        }
    `;
    const { data } = await query({ query: GET_BUDGET });
    expect(data.budget).toEqual({
      id: budgetId,
      name: "budgetName",
      limit: 1000,
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    const budgetId = createBudgetResponse.data.createBudget.id;
    const UPDATE_BUDGET = gql`
        mutation {
            updateBudget(options: {
                id: "${budgetId}",
                name:"updatedBudgetName",
                limit: 20.19
            }) {
                id
                name
                limit
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_BUDGET });
    expect(data.updateBudget).toEqual({
      id: budgetId,
      name: "updatedBudgetName",
      limit: 20.19,
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    const budgetId = createBudgetResponse.data.createBudget.id;
    const DELETE_BUDGET = gql`
        mutation {
            deleteBudget(options: {id: "${budgetId}"}) {
                id
                name
                limit
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_BUDGET });
    expect(data.deleteBudget).toEqual({
      id: budgetId,
      name: "budgetName",
      limit: 1000,
    });
  });

  test("member is added", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    let CREATE_ANOTHER_USER = gql`
      mutation {
        register(
          options: {
            email: "another_test@user.com"
            password: "legitP@55"
            name: "Another Test User"
            birthDate: "2001-02-03"
          }
        ) {
          id
          email
        }
      }
    `;
    const createAnotherUserResponse = await mutate({ mutation: CREATE_ANOTHER_USER });
    const anotherUserEmail = createAnotherUserResponse.data.register.email;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    const budgetId = createBudgetResponse.data.createBudget.id;
    const ADD_BUDGET_MEMBER = gql`
        mutation {
            addBudgetMember(options: {budgetId: "${budgetId}", email: "${anotherUserEmail}"})
        }
    `;
    const { data } = await mutate({ mutation: ADD_BUDGET_MEMBER });
    expect(data.addBudgetMember).toEqual(true);
  });

  test("member is removed", async () => {
    expect.assertions(1);
    const { mutate } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    let CREATE_ANOTHER_USER = gql`
      mutation {
        register(
          options: {
            email: "another_test@user.com"
            password: "legitP@55"
            name: "Another Test User"
            birthDate: "2001-02-03"
          }
        ) {
          id
          email
        }
      }
    `;
    const createAnotherUserResponse = await mutate({ mutation: CREATE_ANOTHER_USER });
    const anotherUserId = createAnotherUserResponse.data.register.id;
    const anotherUserEmail = createAnotherUserResponse.data.register.email;
    const createBudgetResponse = await mutate({ mutation: CREATE_BUDGET });
    const budgetId = createBudgetResponse.data.createBudget.id;
    const ADD_BUDGET_MEMBER = gql`
        mutation {
            addBudgetMember(options: {budgetId: "${budgetId}", email: "${anotherUserEmail}"})
        }
    `;
    await mutate({ mutation: ADD_BUDGET_MEMBER });
    const REMOVE_BUDGET_MEMBER = gql`
        mutation {
            removeBudgetMember(options: {budgetId: "${budgetId}", userId: "${anotherUserId}"})
        }
    `;
    const { data } = await mutate({ mutation: REMOVE_BUDGET_MEMBER });
    expect(data.removeBudgetMember).toEqual(true);
  });
});
