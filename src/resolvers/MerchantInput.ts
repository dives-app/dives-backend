import { InputType, Field } from "type-graphql";

@InputType()
export class MerchantInput {
  @Field()
  id: string;
}

@InputType()
export class NewMerchantInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateMerchantInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
}
