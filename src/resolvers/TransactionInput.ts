import { InputType, Field } from "type-graphql";

@InputType()
export class NewTransactionInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  accountId: string;

  @Field()
  categoryId: string;

  @Field()
  amount: number;

  @Field()
  time: string;

  @Field({ nullable: true })
  description?: string;
}
