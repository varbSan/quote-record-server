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
import { DeleteQuoteInput } from './graphql/delete-quote.input'
import { UpdateQuoteInput } from './graphql/update-quote.input'
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
  @Mutation(() => QuoteRecordType)
  async updateQuote(
    @CurrentUser() currentUser: User,
    @Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput
  ) {
    return this.quoteRecordService.update({ user: currentUser, ...updateQuoteInput })
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Int)
  async deleteQuote(
    @CurrentUser() currentUser: User,
    @Args('deleteQuoteInput') deleteQuoteInput: DeleteQuoteInput
  ) {
    return this.quoteRecordService.delete({ user: currentUser, ...deleteQuoteInput })
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
