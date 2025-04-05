import { Field, InputType } from '@nestjs/graphql'
import { QuoteRecord } from 'quote-record/quote-record.entity'
import { CreateQuoteRecord } from './create-quote-record.interface'

@InputType()
export class CreateQuoteRecordInput {
  constructor(input: CreateQuoteRecord) {
    Object.assign(this, input)
  }

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => String)
  author: QuoteRecord['author']
}
