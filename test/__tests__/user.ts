// import { createTestClient } from "apollo-server-testing";
// import { gql } from "apollo-server-lambda";
// import { testServer, loggedUserId, setLoggedUserId } from "../utils/testServer";
//
// it("Gets user", async () => {
//   expect.assertions(1);
//   const CREATE_USER = gql`
//     mutation {
//       createUser(
//         email: "test@user.com"
//         password: "legitP@55"
//         name: "Test User"
//         birthDate: "2001-02-03"
//         country: "PL"
//       ) {
//         id
//         email
//       }
//     }
//   `;
//   const GET_USER_ID = gql`
//     query {
//       user {
//         id
//       }
//     }
//   `;
//   const { mutate } = createTestClient(testServer);
//   const createUserResponse = await mutate({ mutation: CREATE_USER });
//   setLoggedUserId(createUserResponse.data.createUser.id);
//   const { data } = await mutate({ mutation: GET_USER_ID });
//   expect(data.user.id).toBe(loggedUserId);
// });
