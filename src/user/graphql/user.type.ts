import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from 'user/user.entity'

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: User['id']

  @Field(() => String)
  email: User['email']

  @Field(() => String)
  username: User['username']

  @Field(() => String)
  sub: User['sub']

  @Field(() => Boolean)
  seePublicQuotes: User['seePublicQuotes']

  @Field(() => Date)
  createdAt: User['createdAt']

  @Field(() => Date)
  updatedAt: User['updatedAt']
}
