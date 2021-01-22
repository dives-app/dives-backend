import { Connection } from "typeorm";
import { User } from "../entities/User";

/**
 * Generates a new token invalidating the old one
 * @param userId ID of user to generate new token for
 * @param connection database connection
 */
export async function revokeToken(userId: string, connection: Connection) {
  await connection
    .createEntityManager()
    .update(User, { id: userId }, { token: () => "uuid_generate_v4()" });
}
