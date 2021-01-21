import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import argon2 from "argon2";
import {nanoid} from "nanoid";
import {ApolloError} from "apollo-server-errors";
import {GraphQLResolveInfo} from "graphql";
import {User} from "../entities/User";
import {Context, NoMethods} from "../../types";
import {UpdateUserInput, UserInput, UsernamePasswordInput} from "./UserInput";
import {setToken} from "../utils/setToken";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {updateObject} from "../utils/updateObject";
import {revokeToken} from "../utils/revokeToken";
import {isValidPassword} from "../utils/isValidPassword";

const {S3_BUCKET, S3_REGION, STAGE} = process.env;

@Resolver(() => User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async user(@Ctx() {userId}: Context, @Info() info: GraphQLResolveInfo): Promise<User> {
    return User.findOne({
      where: {id: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
  }

  @Query(() => User)
  async login(
    @Arg("options") options: UserInput,
    @Ctx() {setCookies}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<User>> {
    let userWithSameEmail;
    try {
      userWithSameEmail = await User.findOne({
        where: {email: options.email},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
    if (!userWithSameEmail) {
      throw new ApolloError("No account with provided email");
    }
    const validPassword = await argon2.verify(userWithSameEmail.password, options.password);
    if (!validPassword) {
      throw new ApolloError("Invalid credentials");
    }
    await setToken(userWithSameEmail.token, setCookies);
    return userWithSameEmail;
  }

  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() {setCookies}: Context
  ): Promise<NoMethods<User>> {
    const userWithSameEmail = await User.findOne({
      where: {email: options.email},
    });
    if (userWithSameEmail) {
      throw new ApolloError("Email already in use");
    }
    const {email, password, name, birthDate} = options;
    if (!isValidPassword(password)) {
      throw new ApolloError(
        "Invalid password: a valid password should contain at least one digit, small letter, capital letter, special character and be at least 8 characters long",
        "INVALID_PASSWORD"
      );
    }
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
    await setToken(user.id, setCookies);
    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Arg("options") options: UpdateUserInput,
    @Ctx() {userId, s3, connection}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<User>> {
    const {country, password, photo, birthDate, email, name} = options;
    const userToUpdate = await User.findOne({
      where: {id: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    let photoUrl;
    let updatePhotoUrl;
    if (photo !== undefined) {
      let file;
      const photoSplit = photo.split(".");
      const extension = photoSplit[photoSplit.length - 1];
      if (userToUpdate.photoUrl !== null) {
        let split = userToUpdate.photoUrl.split("/");
        split = split[split.length - 1].split(".");
        split[split.length - 1] = extension;
        file = split.join(".");
      } else {
        file = `${nanoid()}.${extension}`;
      }
      updatePhotoUrl = s3.createPresignedPost({
        Bucket: S3_BUCKET,
        Fields: {
          key: `${userId}/${file}`,
          acl: "public-read",
        },
        Conditions: [
          ["content-length-range", 0, 3_000_000], // Restrict size from 0-3MB
        ],
        Expires: 100,
      });
      if (STAGE === "local") {
        photoUrl = `http://localhost:4569/${S3_BUCKET}/${userId}/${file}`;
        updatePhotoUrl.url = updatePhotoUrl.url.replace("https://", "http://");
      } else {
        photoUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${userId}/${file}`;
      }
    }
    let hashedPassword = undefined;
    if (password !== undefined) {
      hashedPassword = await argon2.hash(password);
      if (!isValidPassword(password)) {
        throw new ApolloError(
          "Invalid password: a valid password should contain at least one digit, small letter, capital letter, special character and be at least 8 characters long",
          "INVALID_PASSWORD"
        );
      }
    }
    updateObject(userToUpdate, {
      name,
      country,
      password: hashedPassword,
      updatePhotoUrl: JSON.stringify(updatePhotoUrl),
      photoUrl,
      birthDate,
      email,
    });
    const user = await userToUpdate.save();
    if (password !== undefined) {
      await revokeToken(userId, connection);
    }
    return user;
  }

  @Authorized()
  @Mutation(() => User)
  async deleteUser(
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<User>> {
    const userToDelete = await User.findOne({
      where: {id: userId},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    return {...(await userToDelete.remove()), id: userId};
  }

  @Authorized()
  @Mutation(() => Boolean)
  async revokeToken(@Ctx() {userId, connection}: Context): Promise<boolean> {
    try {
      await revokeToken(userId, connection);
      return true;
    } catch {
      return false;
    }
  }
}
