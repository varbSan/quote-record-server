import { Field, InputType } from '@nestjs/graphql'
import { CreateUser } from '../user.entity'

@InputType()
export class CreateUserInput {
  constructor(input: CreateUser) {
    Object.assign(this, input)
  }

  @Field(() => String)
  email: CreateUser['email']

  @Field(() => String)
  username: CreateUser['username']

  @Field(() => String)
  sub: CreateUser['sub']
}
