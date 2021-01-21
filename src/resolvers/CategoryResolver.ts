import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Category} from "../entities/Category";
import {Context, NoMethods} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {CategoryInput, NewCategoryInput, UpdateCategoryInput} from "./CategoryInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";
import {AccessLevel, BudgetMembership} from "../entities/BudgetMembership";
import {Budget} from "../entities/Budget";
import {User} from "../entities/User";

@Resolver(() => Category)
export class CategoryResolver {
  @Authorized()
  @Query(() => Category)
  async category(
    @Arg("options") options: CategoryInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    let category;
    try {
      category = await Category.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
    if (!category) throw new ApolloError("There is no such category", "NOT_FOUND");
    if (category.ownerUser.id === userId) {
      return category;
    }
    const budgetMembership = await BudgetMembership.findOne({
      where: {budget: category.ownerBudget.id, user: userId},
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
    {name, limit, color, icon, ownerBudget, ownerUser, type}: NewCategoryInput
  ): Promise<NoMethods<Category>> {
    let category;
    try {
      category = await Category.create({
        name,
        limit,
        color,
        iconUrl: icon,
        ownerBudget: ownerBudget && (await Budget.findOne({where: {id: ownerBudget}})),
        ownerUser: ownerUser && (await User.findOne({where: {id: ownerUser}})),
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
    {id, name, limit, color, icon, type}: UpdateCategoryInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    const category = await Category.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
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
    @Arg("options") {id}: CategoryInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Category>> {
    const category = await Category.findOne({
      where: {category: id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
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
    return {...(await category.remove()), id};
  }
}
