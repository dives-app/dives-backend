import { InputType, Field } from "type-graphql";

@InputType()
export class DebtInput {
  @Field()
  id: string;
}

@InputType()
export class NewDebtInput {
  @Field()
  name: string;
  @Field()
  currency: string;
  @Field()
  endDate: string;
  @Field()
  balance: number;
  @Field()
  icon: string;
  @Field()
  color: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  interestRate?: number;
}

@InputType()
export class UpdateDebtInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  currency?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  balance?: number;
  @Field({ nullable: true })
  icon?: string;
  @Field({ nullable: true })
  color?: string;
  @Field({ nullable: true })
  interestRate?: number;
}
