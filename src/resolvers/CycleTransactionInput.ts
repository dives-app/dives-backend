import { InputType, Field } from "type-graphql";

@InputType()
export class CycleTransactionInput {
  @Field()
  id: string;
}

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

@InputType()
export class UpdateCycleTransactionInput {
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
  date?: string;

  @Field({ nullable: true })
  period?: number;

  @Field({ nullable: true })
  description?: string;
}
