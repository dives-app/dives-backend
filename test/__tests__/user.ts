import { gql } from "apollo-server-lambda";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("User", () => {
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
    const res = await mutate({ mutation: CREATE_USER });
    expect(res.data.register).toEqual({
      id: expect.any(String),
      email: "test@user.com",
      name: "Test User",
      birthDate: "2001-02-03",
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const GET_USER = gql`
      query {
        user {
          id
          name
          email
          birthDate
        }
      }
    `;
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const { data } = await query({ query: GET_USER });
    expect(data.user).toEqual({
      id: server.loggedUserId,
      email: "test@user.com",
      name: "Test User",
      birthDate: "2001-02-03",
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const UPDATE_USER = gql`
      mutation {
        updateUser(
          options: {
            name: "Updated User"
            email: "updated@test.com"
            birthDate: "2001-03-02"
            country: "PLN"
          }
        ) {
          id
          name
          email
          birthDate
          country
        }
      }
    `;
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const res = await mutate({ mutation: UPDATE_USER });
    expect(res.data.updateUser).toEqual({
      id: server.loggedUserId,
      name: "Updated User",
      email: "updated@test.com",
      birthDate: "2001-03-02",
      country: "PLN",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const DELETE_USER = gql`
      mutation {
        deleteUser {
          id
          email
          name
          birthDate
        }
      }
    `;
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const res = await mutate({ mutation: DELETE_USER });
    expect(res.data.deleteUser).toEqual({
      id: server.loggedUserId,
      email: "test@user.com",
      name: "Test User",
      birthDate: "2001-02-03",
    });
  });

  test("Throws on email collision", async () => {
    expect.assertions(2);
    await mutate({ mutation: CREATE_USER });
    const collisionResponse = await mutate({ mutation: CREATE_USER });
    expect(collisionResponse.data).toBeNull();
    expect(collisionResponse.errors[0].extensions.code).toBe("EMAIL_ALREADY_IN_USE");
  });

  test("Throws on weak password", async () => {
    expect.assertions(2);
    const CREATE_WEAK_USER = gql`
      mutation {
        register(
          options: {
            email: "test@user.com"
            password: "myPassword1"
            name: "Test User"
            birthDate: "2001-02-03"
          }
        ) {
          id
        }
      }
    `;
    const response = await mutate({ mutation: CREATE_WEAK_USER });
    expect(response.data).toBeNull();
    expect(response.errors[0].extensions.code).toBe("INVALID_PASSWORD");
  });
});
