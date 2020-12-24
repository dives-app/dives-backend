// import { createTestClient } from "apollo-server-testing";
// import { gql } from "apollo-server-lambda";
// import { testServer, loggedUserId, setLoggedUserId } from "../utils/testServer";
//
// it("Gets user", async () => {
//   expect.assertions(2);
//   const CREATE_USER = gql`
//     mutation {
//       register(
//         options: {
//           email: "test@user.com"
//           password: "legitP@55"
//           name: "Test User"
//           birthDate: "2001-02-03"
//         }
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
//         name
//       }
//     }
//   `;
//   const { mutate, query } = createTestClient(testServer);
//   const createUserResponse = await mutate({ mutation: CREATE_USER });
//   console.log(createUserResponse);
//   setLoggedUserId(createUserResponse.data.register.id);
//   const { data } = await query({ query: GET_USER_ID });
//   expect(data.user.id).toBe(loggedUserId);
//   expect(data.user.name).toBe("Test User");
// });
