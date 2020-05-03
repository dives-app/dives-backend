import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createMerchant(_parent, args, context: Context, _info) {
    const id = generateId();
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.MERCHANT,
      itemData: {
        ...args,
      },
    }).then(() => {
      return { id, ...args };
    });
  },
  updateMerchant(_parent, args, context: Context, _info) {
    const { merchantId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: merchantId,
      resourceType: Resource.MERCHANT,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return { id: merchantId, ...attributes };
    });
  },
  deleteMerchant(_parent, args, context: Context, _info) {
    const { merchantId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: merchantId,
      resourceType: Resource.MERCHANT,
    }).then((attributes) => {
      return { id: merchantId, ...attributes };
    });
  },
};
