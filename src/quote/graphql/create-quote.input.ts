import { Field, InputType } from '@nestjs/graphql'
import { CreateQuote, Quote } from 'quote/quote.entity'

@InputType()
export class CreateQuoteInput {
  constructor(input: CreateQuote) {
    Object.assign(this, input)
  }

  @Field(() => String)
  text: Quote['text']

  @Field(() => Boolean)
  isPublic: Quote['isPublic']
}
