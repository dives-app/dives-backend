import { InputType, Field } from "type-graphql";

@InputType()
export class NewTransactionInput {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field()
  time: string;

  @Field({ nullable: true })
  description?: string;
}
