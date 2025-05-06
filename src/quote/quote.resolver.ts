import { UseGuards } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteType } from 'quote/graphql/quote.type'
import { UploadService } from 'upload/upload.service'
import { User } from 'user/user.entity'
import { WebSocketService } from 'web-socket/web-socket.service'
import { CreateQuoteInput } from './graphql/create-quote.input'
import { DeleteQuoteInput } from './graphql/delete-quote.input'
import { UpdateQuoteInput } from './graphql/update-quote.input'
import { Quote } from './quote.entity'
import { QuoteService } from './quote.service'

@Resolver(() => QuoteType)
export class QuoteResolver {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly webSocketService: WebSocketService,
    private readonly uploadService: UploadService
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => QuoteType)
  async getLastQuote(
    @CurrentUser() currentUser: User
  ) {
    return this.quoteService.getLast(currentUser)
  }

  @UseGuards(AuthGuard)
  @Query(() => QuoteType)
  async getQuote(
    @CurrentUser() currentUser: User,
    @Args('quoteId', { type: () => Int }) quoteId: number
  ) {
    return this.quoteService.findOneBy({ user: currentUser, id: quoteId })
  }

  @UseGuards(AuthGuard)
  @Query(() => QuoteType)
  async getRandomQuote(
    @CurrentUser() currentUser: User
  ) {
    return this.quoteService.getRandom(currentUser)
  }

  @UseGuards(AuthGuard)
  @Query(() => QuoteType)
  async getQuoteByText(
    @CurrentUser() currentUser: User,
    @Args('text', { type: () => String }) text: string
  ) {
    return this.quoteService.findOneBy({ text, user: currentUser })
  }

  @UseGuards(AuthGuard)
  @Query(() => Int)
  async getQuoteTotalCount(
    @CurrentUser() currentUser: User,
  ) {
    return this.quoteService.getCount({ user: currentUser })
  }

  // ⚠️ Guard is declared in subscritions in app.module ⚠️
  @Subscription(() => QuoteType, {
    name: 'quoteCreated',
    resolve: (payload) => {
      return payload.quoteCreated
    },
    filter: (payload, _variables, context) => {
      return payload?.quoteCreated?.user?.sub === context?.req?.userObj?.sub || payload?.quoteCreated.isPublic
    },
  })
  quoteCreated() {
    return this.webSocketService.getPubSub().asyncIterableIterator('quoteCreated')
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuoteType)
  async createQuote(
    @CurrentUser() currentUser: User,
    @Args('createQuoteInput') createQuoteInput: CreateQuoteInput
  ) {
    const quoteCreated = await this.quoteService.create({ user: currentUser, ...createQuoteInput })
    void this.webSocketService.getPubSub().publish('quoteCreated', { quoteCreated })
    return quoteCreated
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuoteType)
  async generateQuoteImage(
    @CurrentUser() currentUser: User,
    @Args('quoteId', { type: () => Int }) quoteId: number,
  ) {
    return this.quoteService.generateImage(currentUser, quoteId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuoteType)
  async updateQuote(
    @CurrentUser() currentUser: User,
    @Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput
  ) {
    return this.quoteService.update({ user: currentUser, ...updateQuoteInput })
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Int)
  async deleteQuote(
    @CurrentUser() currentUser: User,
    @Args('deleteQuoteInput') deleteQuoteInput: DeleteQuoteInput
  ) {
    return this.quoteService.delete({ user: currentUser, ...deleteQuoteInput })
  }

  @UseGuards(AuthGuard)
  @Query(() => [QuoteType])
  async getQuotes(
    @CurrentUser() currentUser: User,
    @Args('searchTerm', { nullable: true }) searchTerm?: string
  ) {
    return this.quoteService.findByTerm(currentUser, searchTerm)
  }

  @ResolveField('imageUrl', () => String)
  async imageUrl(
    @CurrentUser() currentUser: User,
    @Parent() quote: Quote
  ): Promise<string> {
    if (!quote.imagePrompt) {
      return ''
    }
    return this.uploadService.generatePresignedUrlDownload(`user-${currentUser.id}_quote-${quote.id}_0`)
  }
}
