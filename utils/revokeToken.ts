import {Connection} from "typeorm";
import {User} from "../src/entities/User";

export async function revokeToken(userId: string, connection: Connection) {
  await connection
    .createEntityManager()
    .update(User, {id: userId}, {token: () => "uuid_generate_v4()"});
}
