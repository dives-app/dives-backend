import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { Context, NoMethods } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { NewDebtInput } from "./DebtInput";
import { User } from "../entities/User";
import { Debt } from "../entities/Debt";
import { DebtInput, UpdateDebtInput } from "./DebtInput";
import { GraphQLResolveInfo } from "graphql";
import { getRelationSubfields } from "../utils/getRelationSubfields";
import { updateObject } from "../utils/updateObject";

@Resolver(() => Debt)
export class DebtResolver {
  @Authorized()
  @Query(() => Debt)
  async debt(
    @Arg("options") { id }: DebtInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Debt>> {
    const debt = await Debt.findOne({
      where: { id },
      relations: [...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "owner"])],
    });
    if (!debt) {
      throw new ApolloError("No debt found");
    }
    if (debt.owner.id !== userId) {
      throw new ApolloError("No access to this debt");
    }
    return debt;
  }

  @Authorized()
  @Mutation(() => Debt)
  async createDebt(
    @Arg("options") options: NewDebtInput,
    @Ctx() { userId }: Context
  ): Promise<NoMethods<Debt>> {
    const { name, balance, color, currency, description, icon, interestRate, endDate } = options;
    try {
      return Debt.create({
        name,
        balance,
        color,
        currency,
        icon,
        description,
        interestRate,
        endDate,
        owner: await User.findOne({ where: { id: userId } }),
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => Debt)
  async updateDebt(
    @Arg("options") options: UpdateDebtInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Debt>> {
    const { id, name, currency, description, balance, icon, color, interestRate } = options;
    const debt = await Debt.findOne({
      where: { id },
      relations: [...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "owner"])],
    });
    if (!debt) {
      throw new ApolloError("There is no debt with that id");
    }
    if (debt.owner.id !== userId) {
      throw new ApolloError("You are not the owner of this debt");
    }
    try {
      updateObject(debt, {
        name,
        currency,
        description,
        balance,
        icon,
        color,
        interestRate,
      });
      return { ...(await debt.save()), id };
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => Debt)
  async deleteDebt(
    @Arg("options") { id }: DebtInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Debt>> {
    const debt = await Debt.findOne({
      where: { id },
      relations: [...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "owner"])],
    });
    if (!debt) {
      throw new ApolloError("There is no debt with that id");
    }
    if (debt.owner.id !== userId) {
      throw new ApolloError("You are not the owner of this debt");
    }
    return { ...(await debt.remove()), id };
  }
}
