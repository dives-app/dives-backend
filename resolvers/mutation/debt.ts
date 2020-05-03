import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createDebt(_parent, args, context: Context, _info) {
    const id = generateId();
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.DEBT,
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
  updateDebt(_parent, args, context: Context, _info) {
    const { debtId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: debtId,
      resourceType: Resource.DEBT,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: debtId,
        ...attributes,
      };
    });
  },
  deleteDebt(_parent, args, context: Context, _info) {
    const { debtId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: debtId,
      resourceType: Resource.DEBT,
    }).then((attributes) => {
      return {
        id: debtId,
        ...attributes,
      };
    });
  },
};
