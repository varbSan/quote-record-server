import { Field, InputType, Int } from '@nestjs/graphql'
import { QuoteRecord } from 'quote-record/quote-record.entity'

@InputType()
export class DeleteQuoteInput {
  @Field(() => Int)
  id: QuoteRecord['id']
}
