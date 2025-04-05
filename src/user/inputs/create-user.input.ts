import { Field, InputType } from '@nestjs/graphql'
import { User } from '../user.entity'

@InputType()
export class CreateUserInput {
  constructor(input: CreateUserInput) {
    Object.assign(this, input)
  }

  @Field(() => String)
  email: User['email']

  @Field(() => String)
  firstName: User['firstName']

  @Field(() => String)
  lastName: User['lastName']
}
