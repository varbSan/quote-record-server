import { Field, InputType } from '@nestjs/graphql'
import { CreateQuote, QuoteRecord } from 'quote-record/quote-record.entity'

@InputType()
export class CreateQuoteRecordInput {
  constructor(input: CreateQuote) {
    Object.assign(this, input)
  }

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => Boolean)
  isPublic: QuoteRecord['isPublic']
}
