import { Field, InputType, Int } from '@nestjs/graphql'
import { Quote } from 'quote/quote.entity'

@InputType()
export class DeleteQuoteInput {
  @Field(() => Int)
  id: Quote['id']
}
