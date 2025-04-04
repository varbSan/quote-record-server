import { Field, InputType } from '@nestjs/graphql'
import { QuoteRecord } from 'quoteRecord/quoteRecord.entity'
import { CreateQuoteRecord } from './createQuoteRecord.interface'

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
