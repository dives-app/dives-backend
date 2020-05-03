import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";

export default {
  createBankAccount(_parent, args, context: Context, _info) {
    const id = generateId();
    return addItem({
      userId: context.user.id,
      resourceType: Resource.BANK_ACCOUNT,
      resourceId: id,
      itemData: {
        balance: 0,
        ...args,
      },
    }).then(() => {
      return {
        id,
        balance: 0,
        ...args,
      };
    });
  },
  updateBankAccount(_parent, args, context: Context, _info) {
    const { bankAccountId, ...providedData } = args;
    return updateItem({
      userId: context.user.id,
      resourceType: Resource.BANK_ACCOUNT,
      resourceId: bankAccountId,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: bankAccountId,
        ...attributes,
      };
    });
  },
  deleteBankAccount(_parent, args, context: Context, _info) {
    const { bankAccountId } = args;
    return deleteItem({
      userId: context.user.id,
      resourceType: Resource.BANK_ACCOUNT,
      resourceId: bankAccountId,
    }).then((attributes) => {
      return {
        id: bankAccountId,
        ...attributes,
      };
    });
  },
};
