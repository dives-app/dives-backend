import { InputType, Field } from "type-graphql";
import { CategoryType } from "../entities/Category";

@InputType()
export class CategoryInput {
  @Field()
  id: string;
}

@InputType()
export class NewCategoryInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  limit?: number;
  @Field()
  type: CategoryType;
  @Field()
  icon: string; // TODO: FILE
  @Field()
  color: string;
  @Field({ nullable: true })
  ownerUser: string;
  @Field({ nullable: true })
  ownerBudget: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field({ nullable: true })
  limit?: number;
  @Field()
  type: CategoryType;
  @Field()
  icon: string; // TODO: FILE
  @Field()
  color: string;
}
