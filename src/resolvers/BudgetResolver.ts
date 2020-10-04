import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Budget } from "../entities/Budget";
import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";
import { AccessLevel, BudgetMembership } from "../entities/BudgetMembership";
import { BudgetInput, NewBudgetInput } from "./BudgetInput";

@Resolver(() => Budget)
export class BudgetResolver {
  @Query(() => Budget)
  async budget(
    @Arg("options") options: BudgetInput,
    @Ctx() { user }: Context
  ): Promise<Budget> {
    if (!user.id) throw new ApolloError("No user logged in");

    const budgetMembership = await BudgetMembership.findOne({
      where: { budget: options.id, user: user.id },
    });
    if (
      budgetMembership.accessLevel !== AccessLevel.OWNER &&
      budgetMembership.accessLevel !== AccessLevel.OBSERVER &&
      budgetMembership.accessLevel !== AccessLevel.EDITOR
    ) {
      throw new ApolloError("You don't have access to this budget");
    }

    try {
      return await Budget.findOne({
        where: { id: options.id },
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Budget)
  async createBudget(
    @Arg("options") { name, limit }: NewBudgetInput,
    @Ctx() { user }: Context
  ): Promise<Budget> {
    if (!user.id) throw new ApolloError("No user logged in");
    let budget;
    try {
      budget = await Budget.create({
        name,
        limit,
      }).save();
      await BudgetMembership.create({
        accessLevel: AccessLevel.OWNER,
        user: user,
        budget,
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return budget;
  }

  // Update Budget - only members
  // Delete Budget - only owner
}
