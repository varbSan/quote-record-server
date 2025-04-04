import { Field, Int, ObjectType } from '@nestjs/graphql'
import { QuoteRecord } from './quoteRecord.entity'

@ObjectType()
export class QuoteRecordType {
  @Field(() => Int)
  id: QuoteRecord['id']

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => Date)
  createdAt: QuoteRecord['createdAt']

  @Field(() => Date)
  updatedAt: QuoteRecord['updatedAt']
}
