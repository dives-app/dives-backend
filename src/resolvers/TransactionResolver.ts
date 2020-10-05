import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { NewTransactionInput } from "./TransactionInput";
import { Category } from "../entities/Category";
import { Account } from "../entities/Account";

@Resolver(() => Transaction)
export class TransactionResolver {
  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("options") options: NewTransactionInput,
    @Ctx() { user }: Context
  ): Promise<Transaction> {
    const { amount, description, name, time, accountId, categoryId } = options;
    try {
      return Transaction.create({
        name,
        amount,
        account: await Account.findOne({ where: { id: accountId } }),
        category: await Category.findOne({ where: { id: categoryId } }),
        time,
        description,
        creator: user,
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  // Update Transaction - only members
  // Delete Transaction - only owner
}
