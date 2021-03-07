import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  @Column("money", {
    transformer: {
      to: (moneyNumber: number) => moneyNumber,
      from: (moneyString: string | null) => moneyString?.replace(/,/g, "").slice(1),
    },
  })
  price: number;

  @Field(() => Purchase)
  @OneToMany(() => Purchase, purchase => purchase.plan)
  purchases: Purchase[];
}
