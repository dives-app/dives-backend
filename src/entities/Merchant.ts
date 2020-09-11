import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {Transaction} from "./Transaction";
import {CycleTransaction} from "./CycleTransaction";

@ObjectType()
@Entity()
export class Merchant {
    @Field()
    @PrimaryGeneratedColumn()
    id: string

    @Field()
    @Column("varchar")
    name: string

    @Field(()=>[Transaction])
    @OneToMany(()=>Transaction,(transaction)=>transaction.merchant)
    transactions: Transaction[]

    @Field(()=>[CycleTransaction])
    @OneToMany(()=>CycleTransaction,(transaction)=>transaction.merchant)
    cycleTransactions: CycleTransaction[]
}