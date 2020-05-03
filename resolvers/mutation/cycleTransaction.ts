import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createCycleTransaction(_parent, args, context: Context, _info) {
    const id = generateId();
    const lastPayment = Date.now();
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.CYCLE_TRANSACTION,
      itemData: {
        lastPayment,
        ...args,
      },
    }).then(() => {
      return {
        id,
        lastPayment,
        ...args,
      };
    });
  },
  updateCycleTransaction(_parent, args, context: Context, _info) {
    const { cycleTransactionId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: cycleTransactionId,
      resourceType: Resource.CYCLE_TRANSACTION,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: cycleTransactionId,
        ...attributes,
      };
    });
  },
  deleteCycleTransaction(_parent, args, context: Context, _info) {
    const { cycleTransactionId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: cycleTransactionId,
      resourceType: Resource.CYCLE_TRANSACTION,
    }).then((attributes) => {
      return {
        id: cycleTransactionId,
        ...attributes,
      };
    });
  },
};
