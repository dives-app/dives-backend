import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Merchant} from "../entities/Merchant";
import {Context, NoMethods} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {MerchantInput, NewMerchantInput, UpdateMerchantInput} from "./MerchantInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";
import {AccessLevel, BudgetMembership} from "../entities/BudgetMembership";

@Resolver(() => Merchant)
export class MerchantResolver {
  @Authorized()
  @Query(() => Merchant)
  async merchant(
    @Arg("options") options: MerchantInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Merchant>> {
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

  @Authorized()
  @Mutation(() => Merchant)
  async createMerchant(@Arg("options") {name}: NewMerchantInput): Promise<NoMethods<Merchant>> {
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

  @Authorized()
  @Mutation(() => Merchant)
  async updateMerchant(
    @Arg("options") {id, name}: UpdateMerchantInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Merchant>> {
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

  @Authorized()
  @Mutation(() => Merchant)
  async deleteMerchant(
    @Arg("options") {id}: MerchantInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Merchant>> {
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
    return {...(await merchant.remove()), id};
  }
}
