import { InputType, Field } from "type-graphql";

@InputType()
export class TransactionInput {
  @Field()
  id: string;
}

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

@InputType()
export class UpdateTransactionInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  accountId?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  budgetId?: string;

  @Field({ nullable: true })
  merchantId?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  time?: string;

  @Field({ nullable: true })
  description?: string;
}
