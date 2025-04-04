import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from './user.entity'

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: User['id']

  @Field(() => String)
  email: User['email']

  @Field(() => String)
  firstName: User['firstName']

  @Field(() => String)
  lastName: User['lastName']

  @Field(() => Date)
  createdAt: User['createdAt']

  @Field(() => Date)
  updatedAt: User['updatedAt']
}
