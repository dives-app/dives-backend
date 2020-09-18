import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { Context } from "../../types";
import { LoginInput } from "./LoginInput";
import { ApolloError } from "apollo-server-errors";
import { setCredentialCookie } from "../../util/setCredentialCookie";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(@Ctx() { user }: Context): Promise<User> {
    const currentUser = await User.findOne({ where: { id: user.id } });
    if (!currentUser) throw new ApolloError("No user logged in");
    return currentUser;
  }

  @Query(() => User)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { setCookies }: Context
  ): Promise<User> {
    const userWithSameEmail = await User.findOne({
      where: { email: options.email },
    });
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
}
