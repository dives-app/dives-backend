import { query } from "../util/query";
import { Resource } from "../types";

export default {
  Debt: {
    category(parent) {
      return query({
        userId: parent.userId,
        resourceId: parent.category,
        resourceType: Resource.CATEGORY,
      }).then((result) => {
        return {
          id: parent.category,
          sourceUser: result[0].userId,
          ...result[0],
        };
      });
    },
  },
};
