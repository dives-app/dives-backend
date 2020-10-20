import { InputType, Field } from "type-graphql";

@InputType()
export class NewCycleTransactionInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  accountId?: string;

  @Field()
  categoryId: string;

  @Field()
  amount: number;

  @Field()
  date: string;

  @Field()
  period: number;

  @Field({ nullable: true })
  description?: string;
}
