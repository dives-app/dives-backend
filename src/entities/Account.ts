import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { Transaction } from "./Transaction"
import { User } from "./User"
import { CycleTransaction } from "./CycleTransaction"

enum AccountType {
    DEPOSIT,
    SAVINGS_ACCOUNT,
    PERSONAL_ACCOUNT,
    GOVERNMENT_BOND,
}

@ObjectType()
@Entity()
export class Account {
    @Field()
    @PrimaryGeneratedColumn({ type: "uuid" })
    id: string

    @Field()
    @Column("varchar")
    name: string

    @Field()
    @Column("varchar")
    currency: string

    @Field({ nullable: true })
    @Column("varchar", { nullable: true })
    description: string

    @Field()
    @Column("money")
    balance: number

    @Field()
    @Column("varchar")
    iconUrl: string

    @Field()
    @Column("varchar")
    color: string

    @Field()
    @Column()
    type: AccountType

    @Field({ nullable: true })
    @Column("float", { nullable: true })
    interestRate: number

    @Field({ nullable: true })
    @Column("date", { nullable: true })
    billingDate: string

    @Field({ nullable: true })
    @Column("int", { nullable: true })
    billingPeriod: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.accounts)
    owner: User

    @Field(() => [Transaction])
    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[]

    @Field(() => [CycleTransaction])
    @OneToMany(() => CycleTransaction, (transaction) => transaction.account)
    cycleTransaction: CycleTransaction[]
}
