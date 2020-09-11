import "source-map-support/register";
import "reflect-metadata"
import {createConnection} from "typeorm";
import {ApolloServer} from "apollo-server-lambda";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import {verify} from "jsonwebtoken";
import {ApolloContext, TokenData, Context} from "./types";
import {buildSchemaSync} from "type-graphql";
import {HelloResolver} from "./src/resolvers/example";


createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    database: "db",
    entities: ["lib/src/entities/*.js"],
    synchronize: false,
    logging: "all"
})

const server = new ApolloServer({
    schema: buildSchemaSync({
        resolvers: [HelloResolver],
        validate: false
    }),
    plugins: [httpHeadersPlugin],
    playground: {endpoint: "/dev/graphql"},
    context: ({event, context}: ApolloContext): Context => {
        let user: TokenData = {email: null, id: null};
        try {
            const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(4);
            user = verify(jwt, process.env.JWT_SECRET) as TokenData;
        } catch {
        }
        return {
            event,
            context,
            user,
            setCookies: [],
            setHeaders: [],
        };
    }
});

exports.handler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
})

