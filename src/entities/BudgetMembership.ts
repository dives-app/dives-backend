import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Budget } from "./Budget";

export enum AccessLevel {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  OBSERVER = "OBSERVER",
}

@ObjectType()
@Entity()
export class BudgetMembership extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, user => user.budgetMembership, {
    primary: true,
  })
  user: User;

  @Field(() => Budget)
  @ManyToOne(() => Budget, budget => budget.membership, {
    primary: true,
    onDelete: "CASCADE",
  })
  budget: Budget;

  @Field(() => String)
  @Column()
  accessLevel: AccessLevel;
}
