import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { Transaction } from "./Transaction";
import { BudgetMembership } from "./BudgetMembership";
import { CycleTransaction } from "./CycleTransaction";

@ObjectType()
@Entity()
export class Budget extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field({ nullable: true })
  @Column("money", {
    nullable: true,
    transformer: {
      to: (moneyNumber: number) => moneyNumber,
      from: (moneyString: string) => moneyString.replace(/,/g, "").slice(1),
    },
  })
  limit: number;

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.ownerBudget)
  categories: Category[];

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.budget)
  transactions: Transaction[];

  @Field(() => [CycleTransaction])
  @OneToMany(() => CycleTransaction, (transaction) => transaction.budget)
  cycleTransactions: CycleTransaction[];

  @Field(() => [BudgetMembership])
  @OneToMany(() => BudgetMembership, (membership) => membership.budget)
  membership: BudgetMembership[];
}
