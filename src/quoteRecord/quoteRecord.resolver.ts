import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions/dist'
import { QuoteRecordService } from './quoteRecord.service'
import { QuoteRecordType } from './quoteRecord.type'

const pubSub = new PubSub()
@Resolver(() => QuoteRecordType)
export class QuoteRecordResolver {
  constructor(private readonly quoteRecordService: QuoteRecordService) {}

  @Query(() => QuoteRecordType)
  async getLastQuoteRecord() {
    return this.quoteRecordService.getLast()
  }

  @Subscription(() => QuoteRecordType, { name: 'quoteRecordCreated' })
  quoteRecordCreated() {
    return pubSub.asyncIterableIterator('quoteRecordCreated')
  }

  @Mutation(() => QuoteRecordType)
  async createQuoteRecord(@Args('text', { type: () => String }) text: string) {
    const quoteRecordCreated = await this.quoteRecordService.create(text)
    void pubSub.publish('quoteRecordCreated', { quoteRecordCreated })
    return quoteRecordCreated
  }
}
