import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Debt } from "../entities/Debt";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { NewDebtInput } from "./DebtInput";
import { User } from "../entities/User";

@Resolver(() => Debt)
export class DebtResolver {
  @Mutation(() => Debt)
  async createDebt(
    @Arg("options") options: NewDebtInput,
    @Ctx() { user }: Context
  ): Promise<Debt> {
    const {
      name,
      balance,
      color,
      currency,
      description,
      icon,
      interestRate,
      endDate,
    } = options;
    try {
      return Debt.create({
        name,
        balance,
        color,
        currency,
        iconUrl: icon,
        description,
        interestRate,
        endDate,
        owner: await User.findOne({ where: { id: user.id } }),
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  // Update Debt - only owner
  // Delete Debt - only owner
}
