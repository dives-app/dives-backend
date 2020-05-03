import bankAccount from "./bankAccount";
import budget from "./budget";
import category from "./category";
import cycleTransaction from "./cycleTransaction";
import debt from "./debt";
import merchant from "./merchant";
import notification from "./notification";
import purchase from "./purchase";
import transaction from "./transaction";
import user from "./user";

export default {
  Mutation: {
    ...bankAccount,
    ...budget,
    ...category,
    ...cycleTransaction,
    ...debt,
    ...merchant,
    ...notification,
    ...purchase,
    ...transaction,
    ...user,
  },
};
