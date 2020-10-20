import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { CycleTransaction } from "../entities/CycleTransaction";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { NewCycleTransactionInput } from "./CycleTransactionInput";
import { Category } from "../entities/Category";
import { Account } from "../entities/Account";

@Resolver(() => CycleTransaction)
export class CycleTransactionResolver {
  @Mutation(() => CycleTransaction)
  async createCycleTransaction(
    @Arg("options") options: NewCycleTransactionInput,
    @Ctx() { user }: Context
  ): Promise<CycleTransaction> {
    const {
      accountId,
      amount,
      categoryId,
      date,
      description,
      name,
      period,
    } = options;
    try {
      return CycleTransaction.create({
        name,
        amount,
        account: await Account.findOne({ where: { id: accountId } }),
        category: await Category.findOne({ where: { id: categoryId } }),
        date,
        period,
        description,
        creator: user,
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  // Update CycleTransaction - only members
  // Delete CycleTransaction - only owner
}
