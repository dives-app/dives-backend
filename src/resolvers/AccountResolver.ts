import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Account} from "../entities/Account";
import {Context} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {AccountInput, NewAccountInput, UpdateAccountInput} from "./AccountInput";
import {User} from "../entities/User";
import {updateObject} from "../utils/updateObject";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";

@Resolver(() => Account)
export class AccountResolver {
  @Query(() => Account)
  async account(
    @Arg("options") {id}: AccountInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Account> {
    const account = await Account.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!account) {
      throw new ApolloError("No account found");
    }
    if (account.owner.id !== userId) {
      throw new ApolloError("You don't have access to this account");
    }
    return account;
  }

  @Mutation(() => Account)
  async createAccount(
    @Arg("options") options: NewAccountInput,
    @Ctx() {userId}: Context
  ): Promise<Account> {
    if (!userId) throw new ApolloError("No user logged in");
    const {name, balance, color, currency, description, icon, type} = options;
    try {
      return Account.create({
        name,
        balance,
        color,
        currency,
        iconUrl: icon,
        type,
        description,
        owner: await User.findOne({where: {id: userId}}),
      }).save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Account)
  async updateAccount(
    @Arg("options") options: UpdateAccountInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Account> {
    const {
      id,
      name,
      currency,
      description,
      balance,
      icon,
      color,
      type,
      interestRate,
      billingDate,
      billingPeriod,
      owner,
    } = options;
    if (!userId) throw new ApolloError("No user logged in");
    const account = await Account.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!account) {
      throw new ApolloError("There is no account with that id");
    }
    if (account.owner.id !== userId) {
      throw new ApolloError("You are not the owner of this account");
    }
    try {
      let ownerAccount;
      if (owner !== undefined) {
        ownerAccount = await Account.find({where: {id: owner}});
      }
      updateObject(account, {
        name,
        currency,
        description,
        balance,
        iconUrl: icon,
        type,
        color,
        interestRate,
        billingDate,
        billingPeriod,
        owner: ownerAccount,
      });
      return account.save();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Account)
  async deleteAccount(
    @Arg("options") {id}: AccountInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Account> {
    if (!userId) throw new ApolloError("No user logged in");
    const account = await Account.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!account) {
      throw new ApolloError("There is no account with that id");
    }
    if (account.owner.id !== userId) {
      throw new ApolloError("You are not the owner of this account");
    }
    return account.remove();
  }
}
