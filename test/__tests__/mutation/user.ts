// import { createTestClient } from "apollo-server-testing";
// import { gql } from "apollo-server-lambda";
// import { testServer } from "../../utils/testServer";
//
// it("Creates user", async () => {
//   expect.assertions(1);
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
//   const { mutate } = createTestClient(testServer);
//   const res = await mutate({ mutation: CREATE_USER });
//   expect(res.data.register.email).toBe("test@user.com");
// });
//
// it("Throws error on email collision", async () => {
//   expect.assertions(1);
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
//   const { mutate } = createTestClient(testServer);
//   await mutate({ mutation: CREATE_USER });
//   const collisionResponse = await mutate({ mutation: CREATE_USER });
//   expect(collisionResponse).toMatchSnapshot();
// });
