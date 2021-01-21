import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Budget} from "../entities/Budget";
import {Context, NoMethods} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {AccessLevel, BudgetMembership} from "../entities/BudgetMembership";
import {
  AddBudgetMemberInput,
  BudgetInput,
  NewBudgetInput,
  RemoveBudgetMemberInput,
  UpdateBudgetInput,
} from "./BudgetInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";
import {User} from "../entities/User";

@Resolver(() => Budget)
export class BudgetResolver {
  @Authorized()
  @Query(() => Budget)
  async budget(
    @Arg("options") options: BudgetInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Budget>> {
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
  ): Promise<NoMethods<Budget>> {
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
  ): Promise<NoMethods<Budget>> {
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
    return {...(await budget.save()), id};
  }

  @Authorized()
  @Mutation(() => Budget)
  async deleteBudget(
    @Arg("options") {id}: BudgetInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Budget>> {
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: id, user: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!budgetMembership) throw new ApolloError("No such budget for that user");
    if (budgetMembership.accessLevel !== AccessLevel.OWNER) {
      throw new ApolloError(
        "You don't have access to delete this budget, only OWNER can delete a budget"
      );
    }
    const budget = await Budget.findOne({where: {id}});
    return {...(await budget.remove()), id};
  }

  @Authorized()
  @Mutation(() => Boolean)
  async addBudgetMember(
    @Arg("options") {budgetId, email, accessLevel = AccessLevel.OBSERVER}: AddBudgetMemberInput,
    @Ctx() {userId}: Context
  ): Promise<boolean> {
    if (!(accessLevel in AccessLevel))
      throw new ApolloError("Invalid access level should be OWNER, EDITOR or OBSERVER");
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: budgetId, user: userId},
    });
    if (!budgetMembership) {
      throw new ApolloError("There is no budget with that id");
    }
    if (budgetMembership.accessLevel !== AccessLevel.OWNER) {
      throw new ApolloError(
        "You don't have access to edit this budget, only OWNER can add user to a budget"
      );
    }
    const userToAdd = await User.findOne({where: {email}});
    if (!userToAdd) throw new ApolloError("No user with that email");

    try {
      await BudgetMembership.create({
        user: userToAdd,
        budget: await Budget.findOne({where: {id: budgetId}}),
        accessLevel,
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeBudgetMember(
    @Arg("options") {budgetId, userId}: RemoveBudgetMemberInput,
    @Ctx() {userId: currentUserId}: Context
  ): Promise<boolean> {
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: budgetId, user: currentUserId},
    });
    if (!budgetMembership) {
      throw new ApolloError("There is no budget with that id");
    }
    if (budgetMembership.accessLevel !== AccessLevel.OWNER) {
      throw new ApolloError(
        "You don't have access to edit this budget, only OWNER remove users from a budget"
      );
    }
    const membership = await BudgetMembership.findOne(
      {user: {id: userId}, budget: {id: budgetId}},
      {relations: ["user", "budget"]}
    );
    if (!membership) throw new ApolloError("No such user in the budget");
    try {
      await membership.remove();
    } catch (e) {
      throw new ApolloError(e);
    }
    return true;
  }
}
