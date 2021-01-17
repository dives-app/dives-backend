import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {Category} from "./Category";
import {Transaction} from "./Transaction";
import {Account} from "./Account";
import {BudgetMembership} from "./BudgetMembership";
import {CycleTransaction} from "./CycleTransaction";
import {Debt} from "./Debt";
import {Notification} from "./Notification";
import {Purchase} from "./Purchase";
import {Merchant} from "./Merchant";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({type: "uuid"})
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field()
  @Column({type: "varchar", unique: true})
  email: string;

  @Field()
  @Column("date")
  birthDate: string;

  @Field({nullable: true})
  @Column("varchar", {nullable: true})
  country: string;

  @Column("varchar")
  password: string;

  @Field({nullable: true})
  @Column("varchar", {nullable: true})
  photoUrl: string;

  @Field({nullable: true})
  updatePhotoUrl: string;

  @Field(() => [Category])
  @OneToMany(() => Category, category => category.ownerUser)
  categories: Category[];

  @Field(() => [Merchant])
  @OneToMany(() => Merchant, merchant => merchant.ownerUser)
  merchants: Merchant[];

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, transaction => transaction.creator)
  transactions: Transaction[];

  @Field(() => [CycleTransaction])
  @OneToMany(() => CycleTransaction, transaction => transaction.creator)
  cycleTransactions: CycleTransaction[];

  @Field(() => [Account])
  @OneToMany(() => Account, account => account.owner)
  accounts: Account[];

  @Field(() => [BudgetMembership])
  @OneToMany(() => BudgetMembership, membership => membership.user)
  budgetMembership: BudgetMembership[];

  @Field(() => [Debt])
  @OneToMany(() => Debt, debt => debt.owner)
  debts: Debt[];

  @Field(() => [Notification])
  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @Field(() => [Purchase])
  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[];
}
