import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Budget} from "../entities/Budget";
import {Context} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {AccessLevel, BudgetMembership} from "../entities/BudgetMembership";
import {BudgetInput, NewBudgetInput, UpdateBudgetInput} from "./BudgetInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";

@Resolver(() => Budget)
export class BudgetResolver {
  @Authorized()
  @Query(() => Budget)
  async budget(
    @Arg("options") options: BudgetInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Budget> {
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: options.id, user: userId},
    });
    if (!budgetMembership) {
      throw new ApolloError("There is no budget with that id");
    }
    if (
      budgetMembership.accessLevel !== AccessLevel.OWNER &&
      budgetMembership.accessLevel !== AccessLevel.OBSERVER &&
      budgetMembership.accessLevel !== AccessLevel.EDITOR
    ) {
      throw new ApolloError("You don't have access to this budget");
    }

    try {
      return await Budget.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => Budget)
  async createBudget(
    @Arg("options") {name, limit}: NewBudgetInput,
    @Ctx() {userId}: Context
  ): Promise<Budget> {
    let budget;
    try {
      budget = await Budget.create({
        name,
        limit,
      }).save();
      await BudgetMembership.create({
        accessLevel: AccessLevel.OWNER,
        user: {id: userId},
        budget,
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return budget;
  }

  @Authorized()
  @Mutation(() => Budget)
  async updateBudget(
    @Arg("options") {id, name, limit}: UpdateBudgetInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Budget> {
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: id, user: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!budgetMembership) {
      throw new ApolloError("There is no budget with that id");
    }
    if (
      budgetMembership.accessLevel !== AccessLevel.OWNER &&
      budgetMembership.accessLevel !== AccessLevel.EDITOR
    ) {
      throw new ApolloError(
        "You don't have access to edit this budget, only OWNER or EDITOR can edit a budget"
      );
    }
    const budget = await Budget.findOne({where: {id}});
    updateObject(budget, {name, limit});
    return budget.save();
  }

  @Authorized()
  @Mutation(() => Budget)
  async deleteBudget(
    @Arg("options") {id}: BudgetInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Budget> {
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: id, user: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (budgetMembership.accessLevel !== AccessLevel.OWNER) {
      throw new ApolloError(
        "You don't have access to delete this budget, only OWNER can delete a budget"
      );
    }
    const budget = await Budget.findOne({where: {id}});
    return budget.remove();
  }
}
