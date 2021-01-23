import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { Context, NoMethods } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { CategoryInput, NewCategoryInput, UpdateCategoryInput } from "./CategoryInput";
import { getRelationSubfields } from "../utils/getRelationSubfields";
import { GraphQLResolveInfo } from "graphql";
import { updateObject } from "../utils/updateObject";
import { AccessLevel, BudgetMembership } from "../entities/BudgetMembership";
import { Budget } from "../entities/Budget";
import { User } from "../entities/User";

@Resolver(() => Category)
export class CategoryResolver {
  @Authorized()
  @Query(() => Category)
  async category(
    @Arg("options") options: CategoryInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    let category;
    try {
      category = await Category.findOne({
        where: { id: options.id },
        relations: [
          ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "ownerUser"]),
        ],
      });
    } catch (e) {
      throw new ApolloError(e);
    }
    if (!category) throw new ApolloError("There is no such category", "NOT_FOUND");
    if (category.ownerUser.id === userId) {
      return category;
    }
    const budgetMembership = await BudgetMembership.findOne({
      where: { budget: category.ownerBudget.id, user: userId },
    });
    if (budgetMembership) {
      return category;
    }
    throw new ApolloError("You don't have access to this category", "FORBIDDEN");
  }

  @Authorized()
  @Mutation(() => Category)
  async createCategory(
    @Arg("options")
    { name, limit, color, icon, ownerBudget, type }: NewCategoryInput,
    @Ctx() { userId }: Context
  ): Promise<NoMethods<Category>> {
    let category;
    const owner = { budget: undefined, user: undefined };
    if (ownerBudget !== undefined) {
      const membership = await BudgetMembership.findOne({
        user: { id: userId },
        budget: { id: ownerBudget },
      });
      if (!membership) throw new ApolloError("No such budget");
      if (
        membership.accessLevel === AccessLevel.EDITOR ||
        membership.accessLevel === AccessLevel.OWNER
      ) {
        owner.budget = await Budget.findOne({ where: { id: ownerBudget } });
      } else {
        throw new ApolloError("You must be EDITOR or OWNER to add a category", "FORBIDDEN");
      }
    } else {
      owner.user = await User.findOne({ where: { id: userId } });
    }

    try {
      category = await Category.create({
        name,
        limit,
        color,
        iconUrl: icon,
        ownerBudget: owner.budget,
        ownerUser: owner.user,
        type,
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return category;
  }

  @Authorized()
  @Mutation(() => Category)
  async updateCategory(
    @Arg("options")
    { id, name, limit, color, icon, type }: UpdateCategoryInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    const category = await Category.findOne({
      where: { id },
      relations: [
        ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "ownerUser"]),
      ],
    });
    // TODO: create abstract logic for that and make it more efficient
    const budgetMemberships = await BudgetMembership.find({
      where: {
        user: userId,
      },
    });
    const budgetCategory = budgetMemberships
      .filter(
        membership =>
          membership.accessLevel === AccessLevel.EDITOR ||
          membership.accessLevel === AccessLevel.OWNER
      )
      .find(membership => {
        return category.ownerBudget.id === membership.budget.id;
      });
    if (category.ownerUser.id !== userId && !budgetCategory) {
      throw new ApolloError("You don't have access to category with that id");
    }
    updateObject(category, {
      name,
      limit,
      color,
      iconUrl: icon,
      type,
    });
    await category.save();
    return category;
  }

  @Authorized()
  @Mutation(() => Category)
  async deleteCategory(
    @Arg("options") { id }: CategoryInput,
    @Ctx() { userId }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    const category = await Category.findOne({
      where: { category: id },
      relations: [
        ...new Set([...getRelationSubfields(info.fieldNodes[0].selectionSet), "ownerUser"]),
      ],
    });
    const budgetMemberships = await BudgetMembership.find({
      where: {
        user: userId,
      },
    });
    const budgetCategory = budgetMemberships
      .filter(
        membership =>
          membership.accessLevel === AccessLevel.EDITOR ||
          membership.accessLevel === AccessLevel.OWNER
      )
      .find(membership => {
        return category.ownerBudget.id === membership.budget.id;
      });
    if (category.ownerUser.id !== userId && !budgetCategory) {
      throw new ApolloError("You don't have access to category with that id");
    }
    return { ...(await category.remove()), id };
  }
}
