import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { CycleTransaction } from "../entities/CycleTransaction";
import { Context, NoMethods } from "../../types";
import { ApolloError } from "apollo-server-errors";
import {
  CycleTransactionInput,
  NewCycleTransactionInput,
  UpdateCycleTransactionInput,
} from "./CycleTransactionInput";
import { Category } from "../entities/Category";
import { Account } from "../entities/Account";
import { AccessLevel, BudgetMembership } from "../entities/BudgetMembership";
import { updateObject } from "../utils/updateObject";
import { Budget } from "../entities/Budget";
import { Merchant } from "../entities/Merchant";
import { GraphQLResolveInfo } from "graphql";
import { getRelationSubfields } from "../utils/getRelationSubfields";

@Resolver(() => CycleTransaction)
export class CycleTransactionResolver {
  @Authorized()
  @Query(() => CycleTransaction)
  async cycleTransaction(
    @Arg("options") { id }: CycleTransactionInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<CycleTransaction>> {
    const cycleTransaction = await CycleTransaction.findOne({
      where: { id },
      relations: [
        ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "creator"]),
      ],
    });
    if (!cycleTransaction) {
      throw new ApolloError("No cycle transaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: cycleTransaction.budget, user: { id: userId } },
    });
    if (
      cycleTransaction.creator.id !== userId &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit cycle transaction");
    }
    return cycleTransaction;
  }

  @Authorized()
  @Mutation(() => CycleTransaction)
  async createCycleTransaction(
    @Arg("options") options: NewCycleTransactionInput,
    @Ctx() { userId }: Context
  ): Promise<NoMethods<CycleTransaction>> {
    const { accountId, amount, categoryId, date, description, name, period } = options;
    try {
      return CycleTransaction.create({
        name,
        amount,
        account: await Account.findOne({ where: { id: accountId } }),
        category: await Category.findOne({ where: { id: categoryId } }),
        date,
        period,
        description,
        creator: { id: userId },
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => CycleTransaction)
  async updateCycleTransaction(
    @Arg("options") options: UpdateCycleTransactionInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<CycleTransaction>> {
    const {
      amount,
      description,
      name,
      accountId,
      categoryId,
      budgetId,
      id,
      merchantId,
      date,
      period,
    } = options;
    const cycleTransaction = await CycleTransaction.findOne({
      where: { id },
      relations: [
        ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "creator"]),
      ],
    });
    if (!cycleTransaction) {
      throw new ApolloError("No cycleTransaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: cycleTransaction.budget, user: { id: userId } },
    });
    if (
      cycleTransaction.creator.id !== userId &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit cycle transaction");
    }
    try {
      updateObject(cycleTransaction, {
        name,
        amount,
        account: await Account.findOne({ where: { id: accountId } }),
        category: await Category.findOne({ where: { id: categoryId } }),
        date,
        period,
        description,
        budget: await Budget.findOne({ where: { id: budgetId } }),
        merchant: await Merchant.findOne({ where: { id: merchantId } }),
      });
      return { ...(await cycleTransaction.save()), id };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => CycleTransaction)
  async deleteCycleTransaction(
    @Arg("options") { id }: CycleTransactionInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<CycleTransaction>> {
    const cycleTransaction = await CycleTransaction.findOne({
      where: { id },
      relations: [
        ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "creator"]),
      ],
    });
    if (!cycleTransaction) {
      throw new ApolloError("No cycle transaction found");
    }
    const membership = await BudgetMembership.findOne({
      where: { budget: cycleTransaction.budget, user: { id: userId } },
    });
    if (
      cycleTransaction.creator.id !== userId &&
      membership &&
      membership.accessLevel !== AccessLevel.OBSERVER
    ) {
      throw new ApolloError("No access to edit transaction");
    }
    return { ...(await cycleTransaction.remove()), id };
  }
}
