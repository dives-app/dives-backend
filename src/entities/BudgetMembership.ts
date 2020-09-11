import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {User} from "./User";
import {Budget} from "./Budget";

enum AccessLevel {
    OWNER,
    EDITOR,
    OBSERVER,
}

@ObjectType()
@Entity()
export class BudgetMembership {
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.budgetMembership)
    user: User

    @Field(() => Budget)
    @ManyToOne(() => Budget, (budget) => budget.membership)
    budget: Budget

    @Field()
    @Column()
    accessLevel: AccessLevel

}