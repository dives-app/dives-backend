import { InputType, Field } from "type-graphql";

@InputType()
export class NewUserInput {
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
  @Field({ nullable: true, deprecationReason: "Use updateUser mutation instead" })
  birthDate?: string;
}

@InputType()
export class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  birthDate: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  password: string;
  @Field({ nullable: true, description: "filename with extension to upload" })
  photo: string;
}
