import { Arg, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { Context } from "../../types";
import { UpdateUserInput, UserInput, UsernamePasswordInput } from "./UserInput";
import { ApolloError } from "apollo-server-errors";
import { setCredentialCookie } from "../../utils/setCredentialCookie";
import { getRelationSubfields } from "../utils/getRelationSubfields";
import { GraphQLResolveInfo } from "graphql";
import { updateObject } from "../utils/updateObject";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<User> {
    const currentUser = await User.findOne({
      where: { id: user.id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    if (!currentUser) throw new ApolloError("No user logged in");
    return currentUser;
  }

  @Query(() => User)
  async login(
    @Arg("options") options: UserInput,
    @Ctx() { setCookies }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<User> {
    let userWithSameEmail;
    try {
      userWithSameEmail = await User.findOne({
        where: { email: options.email },
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
    if (!userWithSameEmail) {
      throw new ApolloError("No account with provided email");
    }
    const validPassword = await argon2.verify(
      userWithSameEmail.password,
      options.password
    );
    if (!validPassword) {
      throw new ApolloError("Invalid credentials");
    }
    const tokenData = {
      id: userWithSameEmail.id,
      email: userWithSameEmail.email,
    };
    setCredentialCookie(tokenData, setCookies);
    return userWithSameEmail;
  }

  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { setCookies }: Context
  ): Promise<User> {
    const userWithSameEmail = await User.findOne({
      where: { email: options.email },
    });
    if (userWithSameEmail) {
      throw new ApolloError("Email already in use");
    }
    // TODO: Add password security validation
    const { email, password, name, birthDate } = options;
    const hashedPassword = await argon2.hash(password);
    let user;
    try {
      user = await User.create({
        email,
        name,
        password: hashedPassword,
        birthDate: birthDate,
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    const tokenData = {
      id: user.id,
      email: user.email,
    };
    setCredentialCookie(tokenData, setCookies);
    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("options") options: UpdateUserInput,
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<User> {
    const { country, password, photo, birthDate, email } = options;
    if (!user.id) throw new ApolloError("No user logged in");
    const userToUpdate = await User.findOne({
      where: { user: user.id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    // TODO: Add password security validation
    updateObject(userToUpdate, {
      country,
      password: await argon2.hash(password),
      photoUrl: photo,
      birthDate,
      email,
    });
    return userToUpdate.save();
  }

  @Mutation(() => User)
  async deleteUser(
    @Ctx() { user }: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<User> {
    if (!user.id) throw new ApolloError("No user logged in");

    const userToDelete = await User.findOne({
      where: { user: user.id },
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    // TODO: Add email confirmation
    return userToDelete.remove();
  }
}
