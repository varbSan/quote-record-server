import { Field, Int, ObjectType } from '@nestjs/graphql'
import { QuoteRecord } from './quoteRecord.entity'

@ObjectType()
export class QuoteRecordType extends QuoteRecord {
  @Field(() => Int)
  declare id: QuoteRecord['id']

  @Field(() => String)
  declare text: QuoteRecord['text']

  @Field(() => Date)
  declare createdAt: QuoteRecord['createdAt']

  @Field(() => Date)
  declare updatedAt: QuoteRecord['updatedAt']
}
