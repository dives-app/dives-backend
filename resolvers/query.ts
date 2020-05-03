import { Resource, TokenData, Context } from "../types";
import { query } from "../util/query";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ApolloError } from "apollo-server-lambda";

export default {
  Query: {
    login(_parent, args, context: Context) {
      const { email, password } = args;
      return query({
        userId: email,
        resourceType: Resource.USER_CREDENTIALS,
      }).then((result) => {
        if (compare(password, result[0].password)) {
          const tokenData: TokenData = {
            id: result[0].resourceId.slice(3),
            email,
          };
          const token = sign(tokenData, process.env.JWT_SECRET);
          const MILLISECONDS_IN_HOUR = 3600000;
          context.setCookies.push({
            name: "jwt",
            value: token,
            options: {
              domain: "localhost",
              expires: new Date(Date.now() + MILLISECONDS_IN_HOUR),
              httpOnly: true,
              maxAge: 3600,
              path: "/",
              sameSite: true,
              // secure: true,
            },
          });
          return true;
        }
        return false;
      });
    },
    user(_parent, _args, context: Context) {
      const userId = context.user.id;
      return query({
        userId,
        resourceId: userId,
        resourceType: Resource.USER,
      }).then((result) => {
        return {
          id: result[0].resourceId.slice(3),
          ...result[0],
        };
      });
    },
    budgets(_parent, args, context: Context) {
      const { budgetId, userId } = args;
      if (budgetId === undefined && context.user.id !== userId) {
        throw new ApolloError("Unauthorized");
      }
      return query({
        userId,
        budgetId,
        resourceId: budgetId,
        resourceType: Resource.BUDGET,
      }).then((result) => {
        const members = result.flatMap((budget) => [
          ...budget.members,
          ...budget.observers,
        ]);
        if (!members.includes(context.user.id)) {
          throw new ApolloError("Unauthorized");
        }
        return result.map((budget) => {
          return { id: budget.resourceId.slice(3), ...budget };
        });
      });
    },
    transactions(_parent, args, context: Context) {
      const { transactionId } = args;
      const userId = context.user.id;
      return query({
        userId,
        resourceId: transactionId,
        resourceType: Resource.TRANSACTION,
      }).then((result) => {
        return result.map((transaction) => ({
          id: transaction.resourceId.slice(3),
          ...transaction,
        }));
      });
    },
    cycleTransactions(_parent, args, context: Context) {
      const { cycleTransactionId } = args;
      const userId = context.user.id;
      return query({
        userId,
        resourceId: cycleTransactionId,
        resourceType: Resource.CYCLE_TRANSACTION,
      }).then((result) => {
        return result.map((cycleTransaction) => ({
          id: cycleTransaction.resourceId.slice(3),
          ...cycleTransaction,
        }));
      });
    },
    categories(_parent, args, context: Context) {
      const { categoryId } = args;
      const userId = context.user.id;
      return query({
        userId,
        resourceId: categoryId,
        resourceType: Resource.CATEGORY,
      }).then((result) => {
        return result.map((category) => ({
          id: category.resourceId.slice(3),
          ...category,
        }));
      });
    },
    bankAccounts(_parent, args, context: Context) {
      const { bankAccountId } = args;
      return query({
        userId: context.user.id,
        resourceId: bankAccountId,
        resourceType: Resource.BANK_ACCOUNT,
      }).then((result) => {
        return result.map((bankAccount) => ({
          id: bankAccount.resourceId.slice(3),
          ...bankAccount,
        }));
      });
    },
    merchants(_parent, args, context: Context) {
      const { merchantId } = args;
      const userId = context.user.id;
      return query({
        userId,
        resourceId: merchantId,
        resourceType: Resource.MERCHANT,
      }).then((result) => {
        return result.map((merchant) => ({
          id: merchant.resourceId.slice(3),
          ...merchant,
        }));
      });
    },
    debts(_parent, args, context: Context) {
      const { debtId } = args;
      return query({
        userId: context.user.id,
        resourceId: debtId,
        resourceType: Resource.DEBT,
      }).then((result) => {
        return result.map((debt) => ({
          id: debt.resourceId.slice(3),
          ...debt,
        }));
      });
    },
    notifications(_parent, args, context: Context) {
      const { notificationId } = args;
      return query({
        userId: context.user.id,
        resourceId: notificationId,
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
