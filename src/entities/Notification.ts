import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Notification {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column("varchar")
  text: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  action: string;

  @Field()
  @Column("boolean")
  read: string;

  @Field()
  @Column("timestamptz")
  time: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  user: User;
}
