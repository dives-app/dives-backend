import "source-map-support/register"
import "reflect-metadata"
import { Connection, createConnection, getConnectionManager } from "typeorm"
import { ApolloServer } from "apollo-server-lambda"
import httpHeadersPlugin from "apollo-server-plugin-http-headers"
import { verify } from "jsonwebtoken"
import { ApolloContext, Context as MyApolloContext, TokenData } from "./types"
import { buildSchemaSync } from "type-graphql"
import { APIGatewayEvent, Context } from "aws-lambda"
import { HelloResolver } from "./src/resolvers/example"

//! This code is important (be careful trying to remove it).
//! `global.schema` name is required because of some deep graphql schema shit
if (!(global as any).schema) {
    ;(global as any).schema = buildSchemaSync({
        resolvers: [HelloResolver],
        validate: false,
    })
}
const schema = (global as any).schema

/**
 * Returns either old or new connection to the database
 */
const getConnection = async () => {
    const manager = getConnectionManager()
    let connection: Connection

    if (manager.has("default")) {
        connection = manager.get("default")
    } else {
        connection = await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "admin",
            password: "admin",
            database: "db",
            entities: [".build/src/entities/**/*.js"],
            synchronize: false,
            logging: "all",
        })
    }
    if (!connection.isConnected) {
        await connection.connect()
    }
    return connection
}

const server = new ApolloServer({
    schema,
    plugins: [httpHeadersPlugin],
    context: async ({
        event,
        context,
    }: ApolloContext): Promise<MyApolloContext> => {
        const connection = await getConnection()
        let user: TokenData = { email: null, id: null }
        try {
            const jwt = event.headers.Cookie.match(/jwt=.*?(?=;|$)/m)[0].slice(
                4
            )
            user = verify(jwt, process.env.JWT_SECRET) as TokenData
        } catch {}
        return {
            connection,
            event,
            context,
            user,
            setCookies: [],
            setHeaders: [],
        }
    },
})
const handler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
})

//! Another stuff I don't quite understand, but without it async handler doesn't work
const runHandler = (event, context, handler) =>
    new Promise((resolve, reject) => {
        const callback = (error, body) =>
            error ? reject(error) : resolve(body)

        handler(event, context, callback)
    })

exports.handler = async (event: APIGatewayEvent, context: Context) => {
    try {
        return await runHandler(event, context, handler)
    } catch (e) {
        console.error(e)
    }
}
