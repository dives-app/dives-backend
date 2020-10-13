import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Budget } from "./Budget";
import { Transaction } from "./Transaction";
import { CycleTransaction } from "./CycleTransaction";

export enum CategoryType {
  EXPENSE,
  INCOME,
  TRANSFER,
}

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field({ nullable: true })
  @Column("money", { nullable: true })
  limit: number;

  @Field()
  @Column()
  type: CategoryType;

  @Field()
  @Column("varchar")
  iconUrl: string;

  @Field()
  @Column("varchar")
  color: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.categories, { nullable: true })
  ownerUser: User;

  @Field(() => Budget, { nullable: true })
  @ManyToOne(() => Budget, (budget) => budget.categories, { nullable: true })
  ownerBudget: Budget;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @Field(() => [CycleTransaction])
  @OneToMany(() => CycleTransaction, (transaction) => transaction.category)
  cycleTransactions: CycleTransaction[];
}
