import { Field, Int, ObjectType } from '@nestjs/graphql'
import { QuoteRecord } from 'quote-record/quote-record.entity'
import { UserType } from 'user/graphql/user.type'
import { User } from 'user/user.entity'

@ObjectType()
export class QuoteRecordType {
  @Field(() => Int)
  id: QuoteRecord['id']

  @Field(() => String)
  text: QuoteRecord['text']

  @Field(() => UserType)
  user: User

  @Field(() => Date)
  createdAt: QuoteRecord['createdAt']

  @Field(() => Date)
  updatedAt: QuoteRecord['updatedAt']
}
