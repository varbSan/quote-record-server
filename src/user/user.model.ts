// src/user/user.model.ts
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => Int) // Defines ID as an integer field
  id: number

  @Field() // Default type is String
  name: string

  @Field()
  email: string

  @Field()
  hashedPassword: string
}
