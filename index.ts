import "source-map-support/register"
import "reflect-metadata"
import { Connection, createConnection, getConnectionManager } from "typeorm"
import { ApolloServer } from "apollo-server-lambda"
import httpHeadersPlugin from "apollo-server-plugin-http-headers"
import { verify } from "jsonwebtoken"
import { ApolloContext, TokenData, Context as MyApolloContext } from "./types"
import { buildSchemaSync } from "type-graphql"
import { HelloResolver } from "./src/resolvers/example"
import {
    APIGatewayEvent,
    APIGatewayProxyResult,
    Callback,
    Context,
} from "aws-lambda"

const server = new ApolloServer({
    schema: buildSchemaSync({
        resolvers: [HelloResolver],
        validate: false,
    }),
    plugins: [httpHeadersPlugin],
    playground: { endpoint: "/dev/graphql" },
    context: ({ event, context }: ApolloContext): MyApolloContext => {
        let user: TokenData = { email: null, id: null }
        try {
            const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(
                4
            )
            user = verify(jwt, process.env.JWT_SECRET) as TokenData
        } catch {}
        return {
            event,
            context,
            user,
            setCookies: [],
            setHeaders: [],
        }
    },
})

const manager = getConnectionManager()
let conn: Connection

export async function handler(
    event: APIGatewayEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>
) {
    if (manager.has("default")) {
        conn = manager.get("default")
    } else {
        conn = await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "admin",
            password: "admin",
            database: "db",
            entities: ["lib/src/entities/*.js"],
            synchronize: false,
            logging: "all",
        })
    }
    if (!conn.isConnected) {
        await conn.connect()
    }
    server.createHandler({
        cors: {
            origin: true,
            credentials: true,
        },
    })(event, context, callback)
}
