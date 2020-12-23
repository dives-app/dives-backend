import { InputType, Field } from "type-graphql";
import { AccountType } from "../entities/Account";

@InputType()
export class AccountInput {
  @Field()
  id: string;
}

@InputType()
export class NewAccountInput {
  @Field()
  name: string;
  @Field()
  currency: string;
  @Field()
  balance: number;
  @Field()
  icon: string;
  @Field()
  color: string;
  @Field()
  type: AccountType;
  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateAccountInput {
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
  type?: AccountType;
  @Field({ nullable: true })
  interestRate?: number;
  @Field({ nullable: true })
  billingDate?: string;
  @Field({ nullable: true })
  billingPeriod?: number;
  @Field({ nullable: true })
  owner?: string;
}
