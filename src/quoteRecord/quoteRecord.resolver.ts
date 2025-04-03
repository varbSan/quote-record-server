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

  @Query(() => QuoteRecordType)
  async getRandomQuoteRecord() { // TODO: restrict toc userId
    return this.quoteRecordService.getRandom()
  }

  @Query(() => QuoteRecordType)
  async getQuoteRecordByText(@Args('text', { type: () => String }) text: string) {
    return this.quoteRecordService.findBy({ text })
  }

  @Query(() => Number)
  async getQuoteRecordTotalCount() {
    return this.quoteRecordService.getCount()
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
