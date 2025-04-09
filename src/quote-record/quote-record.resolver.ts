import { UseGuards } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteRecordType } from 'quote-record/graphql/quote-record.type'
import { User } from 'user/user.entity'
import { WebSocketService } from 'web-socket/web-socket.service'
import { QuoteRecordService } from './quote-record.service'

@Resolver(() => QuoteRecordType)
export class QuoteRecordResolver {
  constructor(
    private readonly quoteRecordService: QuoteRecordService,
    private readonly webSocketService: WebSocketService
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => QuoteRecordType)
  async getLastQuoteRecord(
    @CurrentUser() currentUser: User
  ) {
    return this.quoteRecordService.getLast(currentUser)
  }

  @UseGuards(AuthGuard)
  @Query(() => QuoteRecordType)
  async getRandomQuoteRecord(
    @CurrentUser() currentUser: User
  ) {
    return this.quoteRecordService.getRandom(currentUser)
  }

  @UseGuards(AuthGuard)
  @Query(() => QuoteRecordType)
  async getQuoteRecordByText(
    @CurrentUser() currentUser: User,
    @Args('text', { type: () => String }) text: string
  ) {
    return this.quoteRecordService.findOneBy({ text, user: currentUser })
  }

  @UseGuards(AuthGuard)
  @Query(() => Int)
  async getQuoteRecordTotalCount(
    @CurrentUser() currentUser: User,
  ) {
    return this.quoteRecordService.getCount({ user: currentUser })
  }

  // ⚠️ Guard is declared in subscritions in app.module ⚠️
  @Subscription(() => QuoteRecordType, {
    name: 'quoteRecordCreated',
    // resolve: (payload, ) => payload.quoteRecordCreated,
    // filter: (payload, _variables, context) => {
    //   // Only allow through if the record belongs to this user
    //   return payload.quoteRecordCreated.user.id === context.userObj.id
    // },
  })
  quoteRecordCreated() {
    return this.webSocketService.getPubSub().asyncIterableIterator('quoteRecordCreated')
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuoteRecordType)
  async createQuoteRecord(
    @CurrentUser() currentUser: User,
    @Args('text', { type: () => String }) text: string
  ) {
    const quoteRecordCreated = await this.quoteRecordService.create({ user: currentUser, text })
    void this.webSocketService.getPubSub().publish('quoteRecordCreated', { quoteRecordCreated })
    return quoteRecordCreated
  }
}
