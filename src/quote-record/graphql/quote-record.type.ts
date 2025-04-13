import { Field, Int, ObjectType } from '@nestjs/graphql'
import { QuoteRecord } from 'quote-record/quote-record.entity'
import { UserType } from 'user/graphql/user.type'

@ObjectType()
export class QuoteRecordType {
  @Field(() => Int)
  id: QuoteRecord['id']

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => UserType)
  user: QuoteRecord['user']

  @Field(() => Boolean)
  isPublic: QuoteRecord['isPublic']

  @Field(() => Date)
  createdAt: QuoteRecord['createdAt']

  @Field(() => Date)
  updatedAt: QuoteRecord['updatedAt']
}
