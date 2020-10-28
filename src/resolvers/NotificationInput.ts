import { InputType, Field } from "type-graphql";

@InputType()
export class NotificationInput {
  @Field()
  id: string;
}

@InputType()
export class NewNotificationInput {
  @Field()
  text: string;
  @Field({ nullable: true })
  action?: string;
  @Field()
  read: string;
  @Field()
  time: string;
}

@InputType()
export class UpdateNotificationInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  text?: string;
  @Field({ nullable: true })
  action?: string;
  @Field({ nullable: true })
  read?: string;
  @Field({ nullable: true })
  time?: string;
}
