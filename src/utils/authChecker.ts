import { AuthChecker } from "type-graphql";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";

/**
 * Checks if user is authorized
 * @param userId userId passed by the Context
 * @param roles array of required roles to authorize
 * @throws if not authorized throws ApolloError - INVALID TOKEN
 * @returns true
 */
export const authChecker: AuthChecker<Context> = ({ context: { userId } }, roles) => {
  if (roles.length === 0) {
    if (!userId) throw new ApolloError("No user logged in", "INVALID_TOKEN");
    return true;
  }
  return true;
};
