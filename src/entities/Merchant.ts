import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Transaction } from "./Transaction";
import { CycleTransaction } from "./CycleTransaction";
import { User } from "./User";
import { Budget } from "./Budget";

@ObjectType()
@Entity()
export class Merchant extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.merchants, { nullable: true })
  ownerUser: User;

  @Field(() => Budget, { nullable: true })
  @ManyToOne(() => Budget, (budget) => budget.merchants, { nullable: true })
  ownerBudget: Budget;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.merchant)
  transactions: Transaction[];

  @Field(() => [CycleTransaction])
  @OneToMany(() => CycleTransaction, (transaction) => transaction.merchant)
  cycleTransactions: CycleTransaction[];
}
