import { query } from "../util/query";
import { Resource } from "../types";

export default {
  CycleTransaction: {
    category(parent) {
      return query({
        userId: parent.userId,
        resourceId: parent.category,
        resourceType: Resource.CATEGORY,
      }).then((result) => {
        return {
          id: parent.category,
          sourceUser: result[0].userId,
          ...result[0],
        };
      });
    },
    payer(parent) {
      return query({
        userId: parent.userId,
        resourceId: parent.payer,
        resourceType: Resource.BANK_ACCOUNT,
        dependsOnNullableResourceId: true,
      }).then((result) => {
        if (result === null) return null;
        return { id: parent.payer, ...result[0] };
      });
    },
    budget(parent) {
      return query({
        budgetId: parent.budgetId,
        resourceType: Resource.BUDGET,
        dependsOnNullableResourceId: true,
      }).then((result) => {
        if (result === null) return null;
        return {
          id: parent.budgetId,
          ...result[0],
        };
      });
    },
    merchant(parent) {
      return query({
        userId: parent.userId,
        resourceId: parent.merchant,
        resourceType: Resource.MERCHANT,
        dependsOnNullableResourceId: true,
      }).then((result) => {
        if (result === null) return null;
        return {
          id: parent.merchant,
          ...result[0],
        };
      });
    },
    beneficiary(parent) {
      return query({
        userId: parent.userId,
        resourceId: parent.beneficiary,
        resourceType: Resource.BANK_ACCOUNT,
        dependsOnNullableResourceId: true,
      }).then((result) => {
        if (result === null) return null;
        return {
          id: parent.beneficiary,
          ...result[0],
        };
      });
    },
  },
};
