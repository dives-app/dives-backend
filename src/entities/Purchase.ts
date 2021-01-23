import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Plan } from "./Plan";
import { User } from "./User";

@ObjectType()
@Entity()
export class Purchase extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column("date")
  startDate: string;

  @Field()
  @Column("date")
  endDate: string;

  @Field()
  @Column("money", {
    transformer: {
      to: (moneyNumber: number) => moneyNumber,
      from: (moneyString: string | null) => moneyString?.replace(/,/g, "").slice(1),
    },
  })
  price: string;

  @Field()
  @Column("varchar")
  currency: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.purchases, { onDelete: "CASCADE" })
  user: User;

  @Field(() => Plan)
  @ManyToOne(() => Plan, plan => plan.purchases)
  plan: Plan;
}
