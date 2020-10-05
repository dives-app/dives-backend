import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { Account } from "./Account";
import { Budget } from "./Budget";
import { Merchant } from "./Merchant";
import { User } from "./User";

@ObjectType()
@Entity()
export class CycleTransaction {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column("money", { nullable: true })
  amount: number;

  @Field()
  @Column("date")
  date: string;

  @Field()
  @Column("int")
  period: number;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true })
  description: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.cycleTransactions)
  category: Category;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.cycleTransaction)
  account: Account;

  @Field(() => Budget, { nullable: true })
  @ManyToOne(() => Budget, (budget) => budget.cycleTransactions, {
    nullable: true,
  })
  budget: Budget;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, (merchant) => merchant.cycleTransactions, {
    nullable: true,
  })
  merchant: Merchant;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (creator) => creator.cycleTransactions, {
    nullable: true,
  })
  creator: User;
}
