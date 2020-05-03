import "source-map-support/register";
import { ApolloServer } from "apollo-server-lambda";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import { verify } from "jsonwebtoken";
import { ApolloContext, TokenData, Context } from "./types";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [httpHeadersPlugin],
  playground: { endpoint: "/dev/graphql" },
  context: ({ event, context }: ApolloContext): Context => {
    let user: TokenData = { email: null, id: null };
    try {
      const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(4);
      user = verify(jwt, process.env.JWT_SECRET) as TokenData;
    } catch {}
    return {
      event,
      context,
      user,
      setCookies: new Array(),
      setHeaders: new Array(),
    };
  },
});

exports.handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
