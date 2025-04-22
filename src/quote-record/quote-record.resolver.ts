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
import { CreateQuoteRecordInput } from './graphql/create-quote-record.input'
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
    resolve: (payload) => {
      return payload.quoteRecordCreated
    },
    filter: (payload, _variables, context) => {
      return payload?.quoteRecordCreated?.user?.sub === context?.req?.userObj?.sub || payload?.quoteRecordCreated.isPublic
    },
  })
  quoteRecordCreated() {
    return this.webSocketService.getPubSub().asyncIterableIterator('quoteRecordCreated')
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuoteRecordType)
  async createQuoteRecord(
    @CurrentUser() currentUser: User,
    @Args('createQuoteRecordInput') createQuoteRecordInput: CreateQuoteRecordInput
  ) {
    const quoteRecordCreated = await this.quoteRecordService.create({ user: currentUser, ...createQuoteRecordInput })
    void this.webSocketService.getPubSub().publish('quoteRecordCreated', { quoteRecordCreated })
    return quoteRecordCreated
  }

  @UseGuards(AuthGuard)
  @Query(() => [QuoteRecordType])
  async getQuotes(
    @CurrentUser() currentUser: User,
    @Args('searchTerm', { nullable: true }) searchTerm?: string
  ) {
    return this.quoteRecordService.findByTerm(currentUser, searchTerm)
  }
}
