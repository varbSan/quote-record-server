import { Field, InputType, Int } from '@nestjs/graphql'
import { Quote } from 'quote/quote.entity'

@InputType()
export class UpdateQuoteInput {
  @Field(() => Int)
  id: Quote['id']

  @Field(() => String)
  text: Quote['text']

  @Field(() => Boolean, { nullable: true })
  isPublic: Quote['isPublic']
}
