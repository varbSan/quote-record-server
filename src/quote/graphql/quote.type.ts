import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Quote } from 'quote/quote.entity'
import { UserType } from 'user/graphql/user.type'

@ObjectType()
export class QuoteType {
  @Field(() => Int)
  id: Quote['id']

  @Field(() => String)
  text: Quote['text']

  @Field(() => UserType)
  user: Quote['user']

  @Field(() => String, { nullable: true })
  imagePrompt: Quote['imagePrompt']

  @Field(() => String, { nullable: true })
  imageUrl: Quote['imageUrl']

  @Field(() => Boolean)
  isPublic: Quote['isPublic']

  @Field(() => Date)
  createdAt: Quote['createdAt']

  @Field(() => Date)
  updatedAt: Quote['updatedAt']
}
