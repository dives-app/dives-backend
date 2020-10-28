import { InputType, Field } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field()
  id: string;
}

@InputType()
export class NewCategoryInput {
  @Field()
  name: string;
  @Field()
  price: number;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  price?: number;
}
