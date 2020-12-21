import { Arg, Ctx, Info, Mutation, Resolver } from "type-graphql";
import { Context } from "../../types";
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

  @Mutation(() => Debt)
  async updateDebt(
    @Arg("options") options: UpdateDebtInput,
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Debt> {
    const {
      id,
      name,
      currency,
      description,
      balance,
      icon,
      color,
      interestRate,
    } = options;
    if (!user.id) throw new ApolloError("No user logged in");
    const debt = await Debt.findOne({
      where: { id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!debt) {
      throw new ApolloError("There is no debt with that id");
    }
    if (debt.owner.id !== user.id) {
      throw new ApolloError("You are not the owner of this debt");
    }
    try {
      updateObject(debt, {
        name,
        currency,
        description,
        balance,
        iconUrl: icon,
        color,
        interestRate,
      });
      return debt.save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Debt)
  async deleteDebt(
    @Arg("options") { id }: DebtInput,
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Debt> {
    if (!user.id) throw new ApolloError("No user logged in");
    const debt = await Debt.findOne({
      where: { id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!debt) {
      throw new ApolloError("There is no debt with that id");
    }
    if (debt.owner.id !== user.id) {
      throw new ApolloError("You are not the owner of this debt");
    }
    await Debt.delete({
      id,
    });
    return debt;
  }
}
