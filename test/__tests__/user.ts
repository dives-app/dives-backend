import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-lambda";
import TestServer from "../testServer";
import { getManager } from "typeorm";

describe("User", () => {
  let server;
  beforeEach(async () => {
    server = new TestServer();
    server.init();
  });
  afterEach(async () => {
    // Delete all DB data
    await getManager().query(
      `TRUNCATE "account", "budget", "budget_membership", "category", "cycle_transaction", "debt", "merchant", "notification", "plan", "purchase", "transaction", "user" CASCADE;`
    );
    console.log("end");
  });

  test("Gets user", async () => {
    expect.assertions(2);
    const CREATE_USER = gql`
      mutation {
        register(
          options: {
            email: "test@user.com"
            password: "legitP@55"
            name: "Test User"
            birthDate: "03-02-2001"
          }
        ) {
          id
          email
        }
      }
    `;
    const GET_USER_ID = gql`
      query {
        user {
          id
          name
        }
      }
    `;
    const { mutate, query } = createTestClient(server.server);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const { data } = await query({ query: GET_USER_ID });
    expect(data.user.id).toBe(server.loggedUserId);
    expect(data.user.name).toBe("Test User");
  });

  test("Creates user", async () => {
    expect.assertions(1);
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
        }
      }
    `;
    const { mutate } = createTestClient(server.server);
    const res = await mutate({ mutation: CREATE_USER });
    expect(res.data.register.email).toBe("test@user.com");
  });

  test("Throws on email collision", async () => {
    expect.assertions(2);
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
        }
      }
    `;
    const { mutate } = createTestClient(server.server);
    await mutate({ mutation: CREATE_USER });
    const collisionResponse = await mutate({ mutation: CREATE_USER });
    expect(collisionResponse.data).toBeNull();
    expect(collisionResponse.errors).toMatchSnapshot();
  });
});
