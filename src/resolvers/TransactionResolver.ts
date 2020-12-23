import { Arg, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { Transaction } from "../entities/Transaction";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import {
  NewTransactionInput,
  TransactionInput,
  UpdateTransactionInput,
} from "./TransactionInput";
import { Category } from "../entities/Category";
import { Account } from "../entities/Account";
import { Budget } from "../entities/Budget";
import { updateObject } from "../utils/updateObject";
import { Merchant } from "../entities/Merchant";
import { AccessLevel, BudgetMembership } from "../entities/BudgetMembership";
import { GraphQLResolveInfo } from "graphql";
import { getRelationSubfields } from "../utils/getRelationSubfields";

@Resolver(() => Transaction)
export class TransactionResolver {
  @Query(() => Transaction)
  async transaction(
    @Arg("options") { id }: TransactionInput,
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Transaction> {
    const transaction = await Transaction.findOne({
      where: { id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!transaction) {
      throw new ApolloError("No transaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: transaction.budget, user: user },
    });
    if (
      transaction.creator.id !== user.id &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit transaction");
    }
    return transaction;
  }

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

  @Mutation(() => Transaction)
  async updateTransaction(
    @Arg("options") options: UpdateTransactionInput,
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Transaction> {
    const {
      amount,
      description,
      name,
      time,
      accountId,
      categoryId,
      budgetId,
      id,
      merchantId,
    } = options;
    const transaction = await Transaction.findOne({
      where: { id },
      relations: [
        ...new Set([
          ...getRelationSubfields(info.fieldNodes[0].selectionSet),
          "creator",
        ]),
      ],
    });
    if (!transaction) {
      throw new ApolloError("No transaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: transaction.budget, user: user },
    });
    if (
      transaction.creator.id !== user.id &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit transaction");
    }
    try {
      updateObject(transaction, {
        name,
        amount,
        account: await Account.findOne({ where: { id: accountId } }),
        category: await Category.findOne({ where: { id: categoryId } }),
        time,
        description,
        budget: await Budget.findOne({ where: { id: budgetId } }),
        merchant: await Merchant.findOne({ where: { id: merchantId } }),
      });
      return transaction.save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Transaction)
  async deleteTransaction(
    @Arg("options") { id }: TransactionInput,
    @Ctx() { user }: Context
  ): Promise<Transaction> {
    const transaction = await Transaction.findOne({ where: { id } });
    if (!transaction) {
      throw new ApolloError("No transaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: transaction.budget, user: user },
    });
    if (
      transaction.creator.id !== user.id &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit transaction");
    }
    return transaction.remove();
  }
}
