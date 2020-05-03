import Query from "./query";
import Mutation from "./mutation";
import User from "./user";
import Budget from "./budget";
import Transaction from "./transaction";
import CycleTransaction from "./cycleTransaction";
import Debt from "./debt";

export const resolvers = {
  ...Query,
  ...Mutation,
  ...User,
  ...Budget,
  ...Transaction,
  ...CycleTransaction,
  ...Debt,
};
