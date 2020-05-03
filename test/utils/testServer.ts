import { ApolloServer } from "apollo-server-lambda";
import { typeDefs } from "../../schema";
import { resolvers } from "../../resolvers";
import { ApolloContext, TokenData, Context } from "../../types";

export let loggedUserEmail;
export let loggedUserId;
export const setLoggedUserEmail = (newEmail) => {
  loggedUserEmail = newEmail;
};
export const setLoggedUserId = (newId) => {
  loggedUserId = newId;
};
process.env.DYNAMODB_TABLE = "dives";

export const testServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }: ApolloContext): Context => {
    let user: TokenData = { email: loggedUserEmail, id: loggedUserId };
    return {
      event,
      context,
      user,
      setCookies: new Array(),
      setHeaders: new Array(),
    };
  },
});
