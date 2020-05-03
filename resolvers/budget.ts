import { query } from "../util/query";
import { Resource } from "../types";

export default {
  Budget: {
    members(parent) {
      return parent.members.map((memberId) => {
        return query({
          userId: memberId,
          resourceType: Resource.USER,
        }).then((result) => {
          return {
            id: memberId,
            ...result[0],
          };
        });
      });
    },
    observers(parent) {
      return parent.observers.map((observerId) => {
        return query({
          userId: observerId,
          resourceType: Resource.USER,
        }).then((result) => {
          return {
            id: observerId,
            ...result[0],
          };
        });
      });
    },
    transactions(parent) {
      return query({
        budgetId: parent.id,
        resourceType: Resource.TRANSACTION,
      }).then((result) => {
        return result.map((transaction) => ({
          id: transaction.resourceId.slice(3),
          ...transaction,
        }));
      });
    },
    cycleTransactions(parent) {
      return query({
        budgetId: parent.id,
        resourceType: Resource.CYCLE_TRANSACTION,
      }).then((result) => {
        return result.map((cycleTransaction) => ({
          id: cycleTransaction.resourceId.slice(3),
          ...cycleTransaction,
        }));
      });
    },
  },
};
