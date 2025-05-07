import { Field, InputType } from '@nestjs/graphql'
import { UpdateUser } from '../user.entity'

@InputType()
export class UpdateUserInput {
  constructor(input: UpdateUser) {
    Object.assign(this, input)
  }

  @Field(() => Boolean)
  seePublicQuotes: UpdateUser['seePublicQuotes']
}
