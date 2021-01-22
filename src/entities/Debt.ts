import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Debt extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field()
  @Column("varchar")
  currency: string;

  @Field({ nullable: true })
  @Column("float", { nullable: true })
  interestRate: number;

  @Field()
  @Column("date")
  endDate: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  description: string;

  @Field()
  @Column("money")
  balance: number;

  @Field()
  @Column("varchar")
  iconUrl: string;

  @Field()
  @Column("varchar")
  color: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.debts, { onDelete: "CASCADE" })
  owner: User;
}
