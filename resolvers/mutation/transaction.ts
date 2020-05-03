import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createTransaction(_parent, args, context: Context, _info) {
    const id = generateId(true, 4);
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.TRANSACTION,
      itemData: {
        ...args,
      },
    }).then(() => {
      return {
        id,
        ...args,
      };
    });
  },
  updateTransaction(_parent, args, context: Context, _info) {
    const { transactionId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: transactionId,
      resourceType: Resource.TRANSACTION,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: transactionId,
        ...attributes,
      };
    });
  },
  deleteTransaction(_parent, args, context: Context, _info) {
    const { transactionId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: transactionId,
      resourceType: Resource.TRANSACTION,
    }).then((attributes) => {
      return {
        id: transactionId,
        ...attributes,
      };
    });
  },
};
