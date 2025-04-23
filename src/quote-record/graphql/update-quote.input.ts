import { Field, InputType, Int } from '@nestjs/graphql'
import { QuoteRecord } from 'quote-record/quote-record.entity'

@InputType()
export class UpdateQuoteInput {
  @Field(() => Int)
  id: QuoteRecord['id']

  @Field(() => String)
  text: QuoteRecord['text']
}
