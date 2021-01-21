import {AuthChecker} from "type-graphql";
import {Context} from "../../types";
import {ApolloError} from "apollo-server-errors";

export const authChecker: AuthChecker<Context> = ({context: {userId}}, roles) => {
  if (roles.length === 0) {
    if (!userId) throw new ApolloError("No user logged in", "INVALID_TOKEN");
    return true;
  }
  return true;
};
