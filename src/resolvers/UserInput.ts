import { InputType, Field } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
  @Field()
  birthDate: string;
}

@InputType()
export class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}
