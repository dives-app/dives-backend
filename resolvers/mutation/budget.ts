import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createBudget(_parent, args, context: Context, _info) {
    const { name } = args;
    const id = generateId();
    const userId = context.user.id;
    return addItem({
      userId,
      resourceId: id,
      resourceType: Resource.BUDGET,
      itemData: {
        name,
        members: [userId],
      },
    }).then(() => {
      return {
        id,
        name,
        members: [userId],
      };
    });
  },
  updateBudget(_parent, args, context: Context, _info) {
    const { budgetId, name } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: budgetId,
      resourceType: Resource.BUDGET,
      itemData: {
        name,
      },
    }).then((attributes) => {
      return {
        id: budgetId,
        ...attributes,
      };
    });
  },
  deleteBudget(_parent, args, context: Context, _info) {
    const { budgetId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: budgetId,
      resourceType: Resource.BUDGET,
    }).then((attributes) => {
      return {
        id: budgetId,
        ...attributes,
      };
    });
  },
  addBudgetRole(_parent, _args, _context: Context, _info) {},
  removeBudgetRole(_parent, _args, _context: Context, _info) {},
};
