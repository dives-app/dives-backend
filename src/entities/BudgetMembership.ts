import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Budget } from "./Budget";

export enum AccessLevel {
  OWNER,
  EDITOR,
  OBSERVER,
}

@ObjectType()
@Entity()
export class BudgetMembership extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.budgetMembership, { primary: true })
  user: User;

  @Field(() => Budget)
  @ManyToOne(() => Budget, (budget) => budget.membership, { primary: true })
  budget: Budget;

  @Field(() => String)
  @Column({
    transformer: {
      to: (accessLevel: number) => accessLevel,
      from: (accessLevel: AccessLevel) => {
        if (accessLevel === AccessLevel.OBSERVER) return "OBSERVER";
        if (accessLevel === AccessLevel.OWNER) return "OWNER";
        if (accessLevel === AccessLevel.EDITOR) return "EDITOR";
      },
    },
  })
  accessLevel: AccessLevel;
}
