import { gql } from "apollo-server-lambda";
import { ApolloServerTestClient } from "apollo-server-testing";
import TestServer from "../testServer";
import { truncateDatabase } from "../utils/truncateDatabase";

describe("Notification", () => {
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

  const CREATE_NOTIFICATION = gql`
    mutation {
      createNotification(
        options: {
          read: "true"
          action: "createDebt"
          text: "notificationText"
          time: "1999-03-14 10:35:12.15+10"
        }
      ) {
        id
        action
        read
        text
        time
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
    const createNotificationResponse = await mutate({ mutation: CREATE_NOTIFICATION });
    expect(createNotificationResponse.data.createNotification).toEqual({
      id: expect.any(String),
      read: "true",
      action: "createDebt",
      text: "notificationText",
      time: "1999-03-14 10:35:12.15+10",
    });
  });

  test("is fetched", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createNotificationResponse = await mutate({ mutation: CREATE_NOTIFICATION });
    const notificationId = createNotificationResponse.data.createNotification.id;
    const GET_NOTIFICATION = gql`
        query {
            notification(options: { id: "${notificationId}" }) {
                id
                action
                read
                text
                time
            }
        }
    `;
    const { data } = await query({ query: GET_NOTIFICATION });
    expect(data.notification).toEqual({
      id: expect.any(String),
      read: "true",
      action: "createDebt",
      text: "notificationText",
      time: "921371712150",
    });
  });

  test("is updated", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createNotificationResponse = await mutate({ mutation: CREATE_NOTIFICATION });
    const notificationId = createNotificationResponse.data.createNotification.id;
    const UPDATE_NOTIFICATION = gql`
        mutation {
            updateNotification(options: {
                id: "${notificationId}",
                read:"false",
            }) {
                id
                action
                read
                text
                time
            }
        }
    `;
    const { data } = await mutate({ mutation: UPDATE_NOTIFICATION });
    expect(data.updateNotification).toEqual({
      id: notificationId,
      read: "false",
      action: "createDebt",
      text: "notificationText",
      time: "921371712150",
    });
  });

  test("is deleted", async () => {
    expect.assertions(1);
    const createUserResponse = await mutate({ mutation: CREATE_USER });
    server.loggedUserId = createUserResponse.data.register.id;
    const createNotificationResponse = await mutate({ mutation: CREATE_NOTIFICATION });
    const notificationId = createNotificationResponse.data.createNotification.id;
    const DELETE_NOTIFICATION = gql`
        mutation {
            deleteNotification(options: {id: "${notificationId}"}) {
                id
                action
                read
                text
                time
            }
        }
    `;
    const { data } = await mutate({ mutation: DELETE_NOTIFICATION });
    expect(data.deleteNotification).toEqual({
      id: notificationId,
      read: "true",
      action: "createDebt",
      text: "notificationText",
      time: "921371712150",
    });
  });
});
