import { ForbiddenException } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions/dist'
import { UserService } from 'user/user.service'
import { QuoteRecordService } from './quote-record.service'
import { QuoteRecordType } from './quote-record.type'

const pubSub = new PubSub()
@Resolver(() => QuoteRecordType)
export class QuoteRecordResolver {
  constructor(
    private readonly quoteRecordService: QuoteRecordService,
    private readonly userService: UserService
  ) {}

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
    return this.quoteRecordService.findOneBy({ text })
  }

  @Query(() => Int)
  async getQuoteRecordTotalCount() {
    return this.quoteRecordService.getCount()
  }

  @Subscription(() => QuoteRecordType, { name: 'quoteRecordCreated' })
  quoteRecordCreated() {
    return pubSub.asyncIterableIterator('quoteRecordCreated')
  }

  @Mutation(() => QuoteRecordType)
  async createQuoteRecord(
    @Args('text', { type: () => String }) text: string
  ) {
    // TODO: use currentUser with decorators
    const currentUser = await this.userService.findOneBy({ id: 1 })
    if (!currentUser)
      throw new ForbiddenException(`User of id ${1} does not exist`)

    const quoteRecordCreated = await this.quoteRecordService.create({ author: currentUser, text })
    void pubSub.publish('quoteRecordCreated', { quoteRecordCreated })
    return quoteRecordCreated
  }
}
