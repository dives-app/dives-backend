import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Purchase } from "./Purchase";

@ObjectType()
@Entity()
export class Plan extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field()
  @Column("money")
  price: number;

  @Field(() => Purchase)
  @OneToMany(() => Purchase, (purchase) => purchase.plan)
  purchases: Purchase[];
}
