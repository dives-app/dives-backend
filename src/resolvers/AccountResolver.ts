import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Account } from "../entities/Account";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { NewAccountInput } from "./AccountInput";
import { User } from "../entities/User";

@Resolver(() => Account)
export class AccountResolver {
  @Mutation(() => Account)
  async createAccount(
    @Arg("options") options: NewAccountInput,
    @Ctx() { user }: Context
  ): Promise<Account> {
    const { name, balance, color, currency, description, icon, type } = options;
    try {
      return Account.create({
        name,
        balance,
        color,
        currency,
        iconUrl: icon,
        type,
        description,
        owner: await User.findOne({ where: { id: user.id } }),
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  // Update Account - only owner
  // Delete Account - only owner
}
