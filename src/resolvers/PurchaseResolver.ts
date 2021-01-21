import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Purchase} from "../entities/Purchase";
import {Context, NoMethods} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {PurchaseInput, NewPurchaseInput, UpdatePurchaseInput} from "./PurchaseInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";
import {User} from "../entities/User";
import {Plan} from "../entities/Plan";

@Resolver(() => Purchase)
export class PurchaseResolver {
  @Authorized()
  @Query(() => Purchase)
  async purchase(
    @Arg("options") options: PurchaseInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Purchase>> {
    // TODO: Check if user has permissions to purchase
    try {
      return await Purchase.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => Purchase)
  async createPurchase(
    @Arg("options")
    {name, currency, endDate, planId, price, startDate}: NewPurchaseInput,
    @Ctx() {userId}: Context
  ): Promise<NoMethods<Purchase>> {
    let purchase;
    try {
      purchase = await Purchase.create({
        name,
        startDate,
        price,
        endDate,
        currency,
        user: await User.findOne({where: {id: userId}}),
        plan: planId && (await Plan.findOne({where: {id: planId}})),
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return purchase;
  }

  @Authorized()
  @Mutation(() => Purchase)
  async updatePurchase(
    @Arg("options") {id, name, currency, endDate, price, startDate, planId}: UpdatePurchaseInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Purchase>> {
    const purchase = await Purchase.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    updateObject(purchase, {
      name,
      currency,
      endDate,
      id,
      plan: planId && (await Plan.findOne({where: {id: planId}})),
      price,
      startDate,
    });
    await purchase.save();
    return purchase;
  }

  @Authorized()
  @Mutation(() => Purchase)
  async deletePurchase(
    @Arg("options") {id}: PurchaseInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Purchase>> {
    const purchase = await Purchase.findOne({
      where: {purchase: id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (purchase.user.id !== userId) {
      throw new ApolloError("You don't have access to purchase with that id");
    }
    return {...(await purchase.remove()), id};
  }
}
