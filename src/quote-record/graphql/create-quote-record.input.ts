import { Field, InputType } from '@nestjs/graphql'
import { CreateQuoteRecord, QuoteRecord } from 'quote-record/quote-record.entity'

@InputType()
export class CreateQuoteRecordInput {
  constructor(input: CreateQuoteRecord) {
    Object.assign(this, input)
  }

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => Boolean)
  isPublic: QuoteRecord['isPublic']
}
