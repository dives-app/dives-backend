import { Resource, Context } from "../../types";
import { addItem } from "../../util/addItem";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createPurchase(_parent, args, context: Context, _info) {
    const id = generateId();
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.PURCHASE,
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
  updatePurchase(_parent, args, context: Context, _info) {
    const { purchaseId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: purchaseId,
      resourceType: Resource.PURCHASE,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: purchaseId,
        ...attributes,
      };
    });
  },
  deletePurchase(_parent, args, context: Context, _info) {
    const { purchaseId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: purchaseId,
      resourceType: Resource.PURCHASE,
    }).then((attributes) => {
      return {
        id: purchaseId,
        ...attributes,
      };
    });
  },
};
