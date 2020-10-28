import { InputType, Field } from "type-graphql";

@InputType()
export class PurchaseInput {
  @Field()
  id: string;
}

@InputType()
export class NewPurchaseInput {
  @Field()
  name: string;
  @Field()
  startDate: string;
  @Field()
  endDate: string;
  @Field()
  price: string;
  @Field()
  currency: string;
  @Field()
  planId: string;
}

@InputType()
export class UpdatePurchaseInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  startDate?: string;
  @Field({ nullable: true })
  endDate?: string;
  @Field({ nullable: true })
  price?: string;
  @Field({ nullable: true })
  currency?: string;
  @Field({ nullable: true })
  planId?: string;
}
