import { InputType, Field } from "type-graphql";

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
