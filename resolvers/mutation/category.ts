import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createCategory(_parent, args, context: Context, _info) {
    const id = generateId();
    const userId = context.user.id;
    return addItem({
      userId,
      resourceId: id,
      resourceType: Resource.CATEGORY,
      itemData: {
        sourceUser: userId,
        ...args,
      },
    }).then(() => {
      return {
        id,
        sourceUser: userId,
        ...args,
      };
    });
  },
  updateCategory(_parent, args, context: Context, _info) {
    const { categoryId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: categoryId,
      resourceType: Resource.CATEGORY,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: categoryId,
        ...attributes,
      };
    });
  },
  deleteCategory(_parent, args, context: Context, _info) {
    const { categoryId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: categoryId,
      resourceType: Resource.CATEGORY,
    }).then((attributes) => {
      return {
        id: categoryId,
        ...attributes,
      };
    });
  },
};
