import {Arg, Ctx, Info, Mutation, Query, Resolver} from "type-graphql";
import {Notification} from "../entities/Notification";
import {Context} from "../../types";
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
  @Query(() => Notification)
  async notification(
    @Arg("options") options: NotificationInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Notification> {
    if (!userId) throw new ApolloError("No user logged in");
    try {
      return await Notification.findOne({
        where: {id: options.id},
        relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
      });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => Notification)
  async createNotification(
    @Arg("options")
    {action, read, text, time}: NewNotificationInput,
    @Ctx() {userId}: Context
  ): Promise<Notification> {
    if (!userId) throw new ApolloError("No user logged in");
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

  @Mutation(() => Notification)
  async updateNotification(
    @Arg("options")
    {id, action, read, text, time}: UpdateNotificationInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Notification> {
    if (!userId) throw new ApolloError("No user logged in");
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

  @Mutation(() => Notification)
  async deleteNotification(
    @Arg("options") {id}: NotificationInput,
    @Ctx() {userId}: Context,
    @Info() info: GraphQLResolveInfo
  ): Promise<Notification> {
    if (!userId) throw new ApolloError("No user logged in");

    const notification = await Notification.findOne({
      where: {notification: id},
      relations: getRelationSubfields(info.fieldNodes[0].selectionSet),
    });

    if (notification.user.id !== userId) {
      throw new ApolloError("You don't have access to notification with that id");
    }
    return notification.remove();
  }
}
