import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createNotification(_parent, args, context: Context, _info) {
    const id = generateId();
    return addItem({
      userId: context.user.id,
      resourceId: id,
      resourceType: Resource.NOTIFICATION,
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
  updateNotification(_parent, args, context: Context, _info) {
    const { notificationId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceId: notificationId,
      resourceType: Resource.NOTIFICATION,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: notificationId,
        ...attributes,
      };
    });
  },
  deleteNotification(_parent, args, context: Context, _info) {
    const { notificationId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceId: notificationId,
      resourceType: Resource.NOTIFICATION,
    }).then((attributes) => {
      return {
        id: notificationId,
        ...attributes,
      };
    });
  },
};
