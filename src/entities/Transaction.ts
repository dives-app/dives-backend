import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { Account } from "./Account";
import { Budget } from "./Budget";
import { Merchant } from "./Merchant";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  name: string;

  @Field()
  @Column("money")
  amount: number;

  @Field()
  @Column("timestamptz")
  time: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  description: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @Field(() => Budget, { nullable: true })
  @ManyToOne(() => Budget, (budget) => budget.transactions, {
    nullable: true,
  })
  budget: Budget;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, (merchant) => merchant.transactions, {
    nullable: true,
  })
  merchant: Merchant;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (recipient) => recipient.transactions, {
    nullable: true,
  })
  user: User;
}
