import { addItem } from "../../util/addItem";
import { Resource, Context } from "../../types";
import { deleteItem } from "../../util/deleteItem";
import { updateItem } from "../../util/updateItem";
import { generateId } from "../../util/generateId";
import { validatePassword } from "../../util/validatePassword";
import { hash } from "bcrypt";
import { ApolloError } from "apollo-server-lambda";
import { query } from "../../util/query";

export default {
  async createUser(_parent, args, _context: Context, _info) {
    const { password, email, ...providedData } = args;
    // Validate password
    if (validatePassword(password) === false)
      throw new ApolloError("Invalid password");
    // Check if email is free
    const result = await query({
      userId: email,
      resourceType: Resource.USER_CREDENTIALS,
    });
    if (result.length !== 0)
      throw new ApolloError("User with that email already exists");
    // Add user to db
    const id = generateId();
    try {
      const hashedPassword = await hash(password, 10);
      await Promise.all([
        addItem({
          userId: email,
          resourceId: id,
          resourceType: Resource.USER_CREDENTIALS,
          itemData: {
            password: hashedPassword,
          },
        }),
        addItem({
          userId: id,
          resourceId: id,
          resourceType: Resource.USER,
          itemData: {
            email,
            ...providedData,
          },
        }),
      ]);
    } catch {
      throw new ApolloError("Unable to create the user");
    }
    return {
      id,
      email,
      ...providedData,
    };
  },
  updateUser(_parent, args, context: Context, _info) {
    const { password, ...providedData } = args;
    const userId = context.user.id;
    if (password !== undefined) {
      if (validatePassword(password) === false)
        throw new ApolloError("Invalid password");
      let hashedPassword;
      hash(password, 10, (error, hash) => {
        if (error) throw error;
        hashedPassword = hash;
      });
      updateItem({
        userId: context.user.email,
        resourceId: userId,
        resourceType: Resource.USER_CREDENTIALS,
        itemData: {
          password: hashedPassword,
        },
      });
    }
    return updateItem({
      userId,
      resourceId: userId,
      resourceType: Resource.USER,
      itemData: {
        ...providedData,
      },
    }).then((attributes) => {
      return {
        id: userId,
        ...attributes,
      };
    });
  },
  deleteUser(_parent, _args, context: Context, _info) {
    const userId = context.user.id;
    return deleteItem({
      userId: context.user.email,
      resourceId: userId,
      resourceType: Resource.USER_CREDENTIALS,
    }).then((attributes) => {
      return {
        id: userId,
        ...attributes,
      };
    });

    // return deleteItem({
    //   userId,
    //   resourceId: userId,
    //   resourceType: Resource.USER,
    // }).then((attributes) => {
    //   return {
    //     id: userId,
    //     ...attributes,
    //   };
    // });
  },
};
