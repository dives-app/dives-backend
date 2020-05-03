import { query } from "../util/query";
import { Resource, Context } from "../types";
import { ApolloError } from "apollo-server-lambda";

export default {
  User: {
    budgets(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.BUDGET,
      }).then((result) => {
        return result.map((budget) => ({
          id: budget.resourceId.slice(3),
          ...budget,
        }));
      });
    },
    bankAccounts(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.BANK_ACCOUNT,
      }).then((result) => {
        return result.map((bankAccount) => ({
          id: bankAccount.resourceId.slice(3),
          ...bankAccount,
        }));
      });
    },
    categories(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.CATEGORY,
      }).then((result) => {
        return result.map((category) => ({
          id: category.resourceId.slice(3),
          ...category,
        }));
      });
    },
    merchants(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.MERCHANT,
      }).then((result) => {
        return result.map((merchant) => ({
          id: merchant.resourceId.slice(3),
          ...merchant,
        }));
      });
    },
    debts(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.DEBT,
      }).then((result) => {
        return result.map((debt) => ({
          id: debt.resourceId.slice(3),
          ...debt,
        }));
      });
    },
    transactions(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.TRANSACTION,
      }).then((result) => {
        return result.map((transaction) => ({
          id: transaction.resourceId.slice(3),
          ...transaction,
        }));
      });
    },
    cycleTransactions(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.CYCLE_TRANSACTION,
      }).then((result) => {
        return result.map((cycleTransaction) => ({
          id: cycleTransaction.resourceId.slice(3),
          ...cycleTransaction,
        }));
      });
    },
    purchases(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.PURCHASE,
      }).then((result) => {
        return result.map((purchase) => ({
          id: purchase.resourceId.slice(3),
          ...purchase,
        }));
      });
    },
    notifications(parent, _args, context: Context, _info) {
      if (context.user.id !== parent.id) throw new ApolloError("Unauthorized");
      return query({
        userId: parent.id,
        resourceType: Resource.NOTIFICATION,
      }).then((result) => {
        return result.map((notification) => ({
          id: notification.resourceId.slice(3),
          ...notification,
        }));
      });
    },
  },
};
