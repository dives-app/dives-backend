import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Merchant} from "../entities/Merchant";
import {Context} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {MerchantInput, NewMerchantInput, UpdateMerchantInput} from "./MerchantInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";
import {AccessLevel, BudgetMembership} from "../entities/BudgetMembership";

@Resolver(() => Merchant)
export class MerchantResolver {
  @Query(() => Merchant)
  async merchant(
    @Arg("options") options: MerchantInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Merchant> {
    if (!userId) throw new ApolloError("No user logged in");
    // TODO: Check if user has permissions to merchant
    try {
      return await Merchant.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Merchant)
  async createMerchant(
    @Arg("options")
    {name}: NewMerchantInput,
    @Ctx() {userId}: Context
  ): Promise<Merchant> {
    if (!userId) throw new ApolloError("No user logged in");
    let merchant;
    try {
      merchant = await Merchant.create({
        name,
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return merchant;
  }

  @Mutation(() => Merchant)
  async updateMerchant(
    @Arg("options")
    {id, name}: UpdateMerchantInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Merchant> {
    if (!userId) throw new ApolloError("No user logged in");
    const merchant = await Merchant.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    updateObject(merchant, {
      name,
    });
    await merchant.save();
    return merchant;
  }

  @Mutation(() => Merchant)
  async deleteMerchant(
    @Arg("options") {id}: MerchantInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Merchant> {
    if (!userId) throw new ApolloError("No user logged in");

    const merchant = await Merchant.findOne({
      where: {merchant: id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    const budgetMemberships = await BudgetMembership.find({
      where: {
        user: userId,
      },
    });
    const budgetMerchant = budgetMemberships
      .filter(
        membership =>
          membership.accessLevel === AccessLevel.EDITOR ||
          membership.accessLevel === AccessLevel.OWNER
      )
      .find(membership => {
        return merchant.ownerBudget.id === membership.budget.id;
      });
    if (merchant.ownerUser.id !== userId && !budgetMerchant) {
      throw new ApolloError("You don't have access to merchant with that id");
    }
    return merchant.remove();
  }
}
