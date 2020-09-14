import { Resolver, Query } from "type-graphql"
import { User } from "../entities/User"

@Resolver(() => User)
export class HelloResolver {
    @Query(() => User)
    hello() {
        return User.findOne({ where: { country: "Poland" } })
    }
}
