import { InputType, Field } from "type-graphql";
import { AccessLevel } from "../entities/BudgetMembership";

@InputType()
export class BudgetInput {
  @Field()
  id: string;
}

@InputType()
export class NewBudgetInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  limit?: number;
}

@InputType()
export class UpdateBudgetInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  limit?: number;
}

@InputType()
export class AddBudgetMemberInput {
  @Field()
  budgetId: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  accessLevel?: AccessLevel;
}

@InputType()
export class RemoveBudgetMemberInput {
  @Field()
  budgetId: string;
  @Field()
  userId: string;
}
