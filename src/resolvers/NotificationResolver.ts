import {Arg, Authorized, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Notification} from "../entities/Notification";
import {Context, NoMethods} from "../../types";
import {ApolloError} from "apollo-server-errors";
import {
  NotificationInput,
  NewNotificationInput,
  UpdateNotificationInput,
} from "./NotificationInput";
import {getRelationSubfields} from "../utils/getRelationSubfields";
import {GraphQLResolveInfo} from "graphql";
import {updateObject} from "../utils/updateObject";

@Resolver(() => Notification)
export class NotificationResolver {
  @Authorized()
  @Query(() => Notification)
  async notification(
    @Arg("options") options: NotificationInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Notification>> {
    try {
      return await Notification.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Authorized()
  @Mutation(() => Notification)
  async createNotification(
    @Arg("options") {action, read, text, time}: NewNotificationInput,
    @Ctx() {userId}: Context
  ): Promise<NoMethods<Notification>> {
    let notification;
    try {
      notification = await Notification.create({
        action,
        read,
        text,
        time,
        user: {id: userId},
      }).save();
    } catch (err) {
      throw new ApolloError(err);
    }
    return notification;
  }

  @Authorized()
  @Mutation(() => Notification)
  async updateNotification(
    @Arg("options")
    {id, action, read, text, time}: UpdateNotificationInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Notification>> {
    const notification = await Notification.findOne({
      where: {id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });
    updateObject(notification, {
      time,
      text,
      read,
      action,
    });
    await notification.save();
    return notification;
  }

  @Authorized()
  @Mutation(() => Notification)
  async deleteNotification(
    @Arg("options") {id}: NotificationInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<NoMethods<Notification>> {
    const notification = await Notification.findOne({
      where: {notification: id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });

    if (notification.user.id !== userId) {
      throw new ApolloError("You don't have access to notification with that id");
    }
    return {...(await notification.remove()), id};
  }
}
